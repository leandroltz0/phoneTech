package com.phoneTech.demo.parts.service;

import com.phoneTech.demo.devices.entity.DiagnosticFault;
import com.phoneTech.demo.devices.entity.PhoneModel;
import com.phoneTech.demo.devices.entity.PhoneVariant;
import com.phoneTech.demo.devices.entity.PhoneVariantPrice;
import com.phoneTech.demo.devices.exception.DeviceNotFoundException;
import com.phoneTech.demo.devices.exception.DeviceVariantNotFoundException;
import com.phoneTech.demo.devices.repository.DiagnosticFaultRepository;
import com.phoneTech.demo.devices.repository.PhoneModelRepository;
import com.phoneTech.demo.devices.repository.PhoneVariantPriceRepository;
import com.phoneTech.demo.devices.repository.PhoneVariantRepository;
import com.phoneTech.demo.parts.dto.MissingRepairCostResponse;
import com.phoneTech.demo.parts.dto.RepairPartCostResponse;
import com.phoneTech.demo.parts.dto.RepairPriceCalculationRequest;
import com.phoneTech.demo.parts.dto.RepairPriceCalculationResponse;
import com.phoneTech.demo.parts.entity.DiagnosticFaultPart;
import com.phoneTech.demo.parts.entity.SupplierSparePart;
import com.phoneTech.demo.parts.repository.DiagnosticFaultPartRepository;
import com.phoneTech.demo.parts.repository.SupplierSparePartRepository;
import com.phoneTech.demo.parts.exception.InvalidRepairFaultException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RepairPriceCalculationService {

    private static final String DEFAULT_SALE_CONDITION = "GOOD";
    private static final Set<String> VALID_SALE_CONDITIONS =
            Set.of("EXCELLENT", "GOOD", "FAIR", "DAMAGED");

    private final PhoneModelRepository devices;
    private final PhoneVariantRepository variants;
    private final PhoneVariantPriceRepository prices;
    private final DiagnosticFaultRepository faults;
    private final DiagnosticFaultPartRepository faultParts;
    private final SupplierSparePartRepository offers;
    private final RepairPriceCalculator calculator;

    public RepairPriceCalculationService(PhoneModelRepository devices,
                                         PhoneVariantRepository variants,
                                         PhoneVariantPriceRepository prices,
                                         DiagnosticFaultRepository faults,
                                         DiagnosticFaultPartRepository faultParts,
                                         SupplierSparePartRepository offers,
                                         RepairPriceCalculator calculator) {
        this.devices = devices;
        this.variants = variants;
        this.prices = prices;
        this.faults = faults;
        this.faultParts = faultParts;
        this.offers = offers;
        this.calculator = calculator;
    }

    @Transactional(readOnly = true)
    public RepairPriceCalculationResponse calculate(RepairPriceCalculationRequest request) {
        PhoneModel device = devices.findById(request.deviceId())
                .filter(PhoneModel::isActive)
                .orElseThrow(() -> new DeviceNotFoundException(request.deviceId()));
        PhoneVariant variant = variants.findById(request.variantId())
                .filter(PhoneVariant::isActive)
                .filter(item -> item.getPhoneModelId().equals(device.getId()))
                .orElseThrow(() -> new DeviceVariantNotFoundException(request.variantId()));

        List<Long> faultIds = distinctFaultIds(request.faultIds());
        Map<Long, DiagnosticFault> selectedFaults = faultIds.isEmpty()
                ? Map.of()
                : loadActiveFaults(faultIds);
        String saleCondition = normalizeCondition(request.saleCondition());
        PhoneVariantPrice salePrice = prices.findByPhoneVariantIdAndConditionCode(variant.getId(), saleCondition)
                .stream().findFirst().orElse(null);

        List<DiagnosticFaultPart> relations = faultIds.isEmpty()
                ? List.of()
                : faultParts.findByFaultIdsAndVariantId(faultIds, variant.getId());
        Map<Long, List<DiagnosticFaultPart>> effectiveRelations = selectVariantRelations(relations, faultIds);
        List<MissingRepairCostResponse> missing = new ArrayList<>();
        List<PartRequirement> requirements = consolidateRequirements(selectedFaults, effectiveRelations, missing);

        String currency = salePrice == null ? null : salePrice.getCurrency().toUpperCase(Locale.ROOT);
        Map<Long, SupplierSparePart> cheapestOffers = currency == null
                ? Map.of()
                : cheapestOffers(requirements, currency);
        List<RepairPartCostResponse> partCosts = new ArrayList<>();
        BigDecimal repairsTotal = BigDecimal.ZERO.setScale(2);

        for (PartRequirement requirement : requirements) {
            SupplierSparePart offer = cheapestOffers.get(requirement.sparePartId());
            if (offer == null) {
                missing.add(new MissingRepairCostResponse(null, requirement.sparePartId(),
                        requirement.sparePartName(), currency == null
                        ? "La variante no tiene precio de venta configurado para la condición solicitada"
                        : "No existe una oferta vigente en " + currency));
                continue;
            }
            BigDecimal total = offer.getPurchasePrice().multiply(BigDecimal.valueOf(requirement.quantity()));
            repairsTotal = repairsTotal.add(total);
            partCosts.add(new RepairPartCostResponse(
                    requirement.sparePartId(), requirement.sparePartName(), requirement.faultIds(),
                    requirement.quantity(), offer.getPurchasePrice(), total, offer.getCurrency(),
                    offer.getId(), offer.getSupplier().getId(), offer.getSupplier().getName()));
        }

        boolean available = salePrice != null && missing.isEmpty();
        BigDecimal maximumPurchasePrice = null;
        BigDecimal projectedProfit = null;
        boolean purchaseAllowed = false;
        if (available) {
            RepairPriceCalculator.Result result = calculator.calculate(
                    salePrice.getReferenceSalePrice(), repairsTotal);
            maximumPurchasePrice = result.maximumPurchasePrice();
            projectedProfit = result.projectedProfit();
            purchaseAllowed = result.purchaseAllowed();
        }

        return new RepairPriceCalculationResponse(
                device.getId(), device.getBrand(), device.getCommercialName(), variant.getId(),
                variant.getModelCode(), saleCondition,
                salePrice == null ? null : salePrice.getReferenceSalePrice(), currency,
                repairsTotal, RepairPriceCalculator.MINIMUM_PROFIT, maximumPurchasePrice,
                projectedProfit, available, purchaseAllowed, partCosts, missing);
    }

    private Map<Long, DiagnosticFault> loadActiveFaults(List<Long> faultIds) {
        Map<Long, DiagnosticFault> selected = faults.findAllById(faultIds).stream()
                .filter(DiagnosticFault::isActive)
                .collect(Collectors.toMap(DiagnosticFault::getId, item -> item, (first, ignored) -> first,
                        LinkedHashMap::new));
        for (Long faultId : faultIds) {
            if (!selected.containsKey(faultId)) {
                throw new InvalidRepairFaultException(faultId);
            }
        }
        return selected;
    }

    private Map<Long, List<DiagnosticFaultPart>> selectVariantRelations(List<DiagnosticFaultPart> relations,
                                                                          List<Long> faultIds) {
        Map<Long, List<DiagnosticFaultPart>> grouped = relations.stream()
                .collect(Collectors.groupingBy(item -> item.getFault().getId(), LinkedHashMap::new,
                        Collectors.toList()));
        Map<Long, List<DiagnosticFaultPart>> effective = new LinkedHashMap<>();
        for (Long faultId : faultIds) {
            List<DiagnosticFaultPart> candidates = grouped.getOrDefault(faultId, List.of());
            boolean hasSpecific = candidates.stream().anyMatch(item -> item.getPhoneVariantId() != null);
            effective.put(faultId, candidates.stream()
                    .filter(item -> hasSpecific ? item.getPhoneVariantId() != null : item.getPhoneVariantId() == null)
                    .toList());
        }
        return effective;
    }

    private List<PartRequirement> consolidateRequirements(Map<Long, DiagnosticFault> selectedFaults,
                                                           Map<Long, List<DiagnosticFaultPart>> relations,
                                                           List<MissingRepairCostResponse> missing) {
        Map<Long, PartRequirementBuilder> builders = new LinkedHashMap<>();
        for (Map.Entry<Long, DiagnosticFault> entry : selectedFaults.entrySet()) {
            List<DiagnosticFaultPart> faultRelations = relations.getOrDefault(entry.getKey(), List.of());
            if (faultRelations.isEmpty()) {
                missing.add(new MissingRepairCostResponse(entry.getKey(), null, null,
                        "La falla no tiene repuestos configurados para esta variante"));
                continue;
            }
            for (DiagnosticFaultPart relation : faultRelations) {
                Long partId = relation.getSparePart().getId();
                PartRequirementBuilder builder = builders.computeIfAbsent(partId,
                        ignored -> new PartRequirementBuilder(partId, relation.getSparePart().getName()));
                builder.quantity = Math.max(builder.quantity, relation.getQuantity());
                builder.faultIds.add(entry.getKey());
            }
        }
        return builders.values().stream().map(PartRequirementBuilder::build).toList();
    }

    private Map<Long, SupplierSparePart> cheapestOffers(List<PartRequirement> requirements, String currency) {
        if (requirements.isEmpty()) return Map.of();
        Set<Long> partIds = requirements.stream().map(PartRequirement::sparePartId).collect(Collectors.toCollection(LinkedHashSet::new));
        return offers.findAvailableOffersBySparePartIdsAndCurrency(partIds, currency).stream()
                .collect(Collectors.toMap(item -> item.getSparePart().getId(), item -> item,
                        (first, ignored) -> first, LinkedHashMap::new));
    }

    private List<Long> distinctFaultIds(Collection<Long> faultIds) {
        return faultIds.stream().distinct().toList();
    }

    private String normalizeCondition(String condition) {
        String normalized = condition == null || condition.isBlank()
                ? DEFAULT_SALE_CONDITION
                : condition.trim().toUpperCase(Locale.ROOT);
        if (!VALID_SALE_CONDITIONS.contains(normalized)) {
            throw new IllegalArgumentException(
                    "saleCondition must be one of EXCELLENT, GOOD, FAIR or DAMAGED");
        }
        return normalized;
    }

    private record PartRequirement(Long sparePartId, String sparePartName, int quantity, List<Long> faultIds) { }

    private static final class PartRequirementBuilder {
        private final Long sparePartId;
        private final String sparePartName;
        private final Set<Long> faultIds = new LinkedHashSet<>();
        private int quantity;

        private PartRequirementBuilder(Long sparePartId, String sparePartName) {
            this.sparePartId = sparePartId;
            this.sparePartName = sparePartName;
        }

        private PartRequirement build() {
            return new PartRequirement(sparePartId, sparePartName, quantity, faultIds.stream().toList());
        }
    }
}
