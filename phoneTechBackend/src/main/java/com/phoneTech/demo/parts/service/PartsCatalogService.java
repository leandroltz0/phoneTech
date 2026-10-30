package com.phoneTech.demo.parts.service;

import com.phoneTech.demo.devices.entity.DiagnosticFault;
import com.phoneTech.demo.devices.repository.DiagnosticFaultRepository;
import com.phoneTech.demo.devices.repository.PhoneVariantRepository;
import com.phoneTech.demo.parts.dto.CreateDiagnosticFaultPartRequest;
import com.phoneTech.demo.parts.dto.CreateSparePartRequest;
import com.phoneTech.demo.parts.dto.CreateSupplierRequest;
import com.phoneTech.demo.parts.dto.CreateSupplierSparePartRequest;
import com.phoneTech.demo.parts.dto.DiagnosticFaultPartResponse;
import com.phoneTech.demo.parts.dto.SparePartResponse;
import com.phoneTech.demo.parts.dto.SupplierResponse;
import com.phoneTech.demo.parts.dto.SupplierDetailResponse;
import com.phoneTech.demo.parts.dto.SupplierSparePartResponse;
import com.phoneTech.demo.parts.entity.DiagnosticFaultPart;
import com.phoneTech.demo.parts.entity.SparePart;
import com.phoneTech.demo.parts.entity.Supplier;
import com.phoneTech.demo.parts.entity.SupplierSparePart;
import com.phoneTech.demo.parts.exception.DiagnosticFaultNotFoundException;
import com.phoneTech.demo.parts.exception.SparePartNotFoundException;
import com.phoneTech.demo.parts.exception.SupplierNotFoundException;
import com.phoneTech.demo.parts.exception.SupplierSparePartNotFoundException;
import com.phoneTech.demo.parts.repository.DiagnosticFaultPartRepository;
import com.phoneTech.demo.parts.repository.SparePartRepository;
import com.phoneTech.demo.parts.repository.SupplierRepository;
import com.phoneTech.demo.parts.repository.SupplierSparePartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PartsCatalogService {

    private final SupplierRepository suppliers;
    private final SparePartRepository spareParts;
    private final SupplierSparePartRepository offers;
    private final DiagnosticFaultPartRepository faultParts;
    private final DiagnosticFaultRepository faults;
    private final PhoneVariantRepository variants;

    public PartsCatalogService(SupplierRepository suppliers, SparePartRepository spareParts,
                               SupplierSparePartRepository offers,
                               DiagnosticFaultPartRepository faultParts,
                               DiagnosticFaultRepository faults,
                               PhoneVariantRepository variants) {
        this.suppliers = suppliers;
        this.spareParts = spareParts;
        this.offers = offers;
        this.faultParts = faultParts;
        this.faults = faults;
        this.variants = variants;
    }

    @Transactional(readOnly = true)
    public List<SupplierResponse> getActiveSuppliers() {
        return suppliers.findByActiveTrueOrderByNameAsc().stream().map(this::supplierResponse).toList();
    }

    @Transactional(readOnly = true)
    public SupplierDetailResponse getSupplier(Long id) {
        Supplier supplier = findSupplier(id);
        return new SupplierDetailResponse(supplierResponse(supplier),
                offers.findBySupplierId(id).stream().map(this::offerResponse).toList());
    }

    @Transactional
    public SupplierResponse createSupplier(CreateSupplierRequest request) {
        return supplierResponse(suppliers.save(new Supplier(request.name().trim(), request.contactName(),
                request.phone(), request.whatsapp(), request.email(), request.address(), request.city(), request.notes())));
    }

    @Transactional
    public SupplierResponse updateSupplier(Long id, CreateSupplierRequest request) {
        Supplier supplier = findSupplier(id);
        supplier.update(request.name().trim(), request.contactName(), request.phone(), request.whatsapp(),
                request.email(), request.address(), request.city(), request.notes());
        return supplierResponse(suppliers.save(supplier));
    }

    @Transactional
    public SupplierResponse updateSupplierStatus(Long id, boolean active) {
        Supplier supplier = findSupplier(id);
        supplier.updateStatus(active);
        return supplierResponse(suppliers.save(supplier));
    }

    @Transactional(readOnly = true)
    public List<SparePartResponse> getActiveSpareParts() {
        return spareParts.findByActiveTrueOrderByNameAsc().stream().map(this::sparePartResponse).toList();
    }

    @Transactional(readOnly = true)
    public SparePartResponse getSparePart(Long id) {
        return sparePartResponse(findSparePart(id));
    }

    @Transactional
    public SparePartResponse createSparePart(CreateSparePartRequest request) {
        return sparePartResponse(spareParts.save(new SparePart(request.partCode(), request.name().trim(),
                request.componentCode(), request.description(), request.imageUri())));
    }

    @Transactional
    public SparePartResponse updateSparePart(Long id, CreateSparePartRequest request) {
        SparePart sparePart = findSparePart(id);
        sparePart.update(request.partCode(), request.name().trim(), request.componentCode(), request.description(),
                request.imageUri() == null ? sparePart.getImageUri() : request.imageUri());
        return sparePartResponse(spareParts.save(sparePart));
    }

    @Transactional(readOnly = true)
    public List<SupplierSparePartResponse> getOffersForSparePart(Long sparePartId) {
        findSparePart(sparePartId);
        return offers.findAvailableOffersBySparePartId(sparePartId).stream().map(this::offerResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<SupplierSparePartResponse> getOffersForSupplier(Long supplierId) {
        findSupplier(supplierId);
        return offers.findBySupplierId(supplierId).stream().map(this::offerResponse).toList();
    }

    @Transactional
    public SupplierSparePartResponse createOffer(CreateSupplierSparePartRequest request) {
        Supplier supplier = findActiveSupplier(request.supplierId());
        SparePart sparePart = findActiveSparePart(request.sparePartId());
        SupplierSparePart offer = new SupplierSparePart(supplier, sparePart, request.supplierSku(),
                request.purchasePrice(), request.currency(), request.available(), request.notes());
        return offerResponse(offers.save(offer));
    }

    @Transactional
    public SupplierSparePartResponse updateOffer(Long id, CreateSupplierSparePartRequest request) {
        SupplierSparePart offer = offers.findById(id).orElseThrow(() -> new SupplierSparePartNotFoundException(id));
        Supplier supplier = findActiveSupplier(request.supplierId());
        SparePart sparePart = findActiveSparePart(request.sparePartId());
        offer.updateAssociation(supplier, sparePart, request.supplierSku(), request.purchasePrice(),
                request.currency(), request.available(), request.notes());
        return offerResponse(offers.save(offer));
    }

    @Transactional(readOnly = true)
    public List<DiagnosticFaultPartResponse> getPartsForFault(Long faultId) {
        DiagnosticFault fault = faults.findById(faultId)
                .orElseThrow(() -> new DiagnosticFaultNotFoundException(faultId));
        List<DiagnosticFaultPart> relations = faultParts.findByFaultId(faultId);
        if (relations.isEmpty()) {
            return List.of();
        }
        List<Long> sparePartIds = relations.stream().map(r -> r.getSparePart().getId()).toList();
        Map<Long, List<SupplierSparePartResponse>> offersByPart = offers
                .findAvailableOffersBySparePartIds(sparePartIds).stream()
                .map(this::offerResponse)
                .collect(java.util.stream.Collectors.groupingBy(
                        SupplierSparePartResponse::sparePartId, LinkedHashMap::new, java.util.stream.Collectors.toList()));
        return relations.stream().map(relation -> new DiagnosticFaultPartResponse(
                fault.getId(), fault.getFaultCode(), fault.getFaultName(), relation.getPhoneVariantId(),
                relation.getSparePart().getId(),
                relation.getSparePart().getName(), relation.getQuantity(), relation.isRequired(), relation.getNotes(),
                offersByPart.getOrDefault(relation.getSparePart().getId(), List.of()))).toList();
    }

    @Transactional
    public DiagnosticFaultPartResponse createFaultPartRelation(CreateDiagnosticFaultPartRequest request) {
        DiagnosticFault fault = faults.findById(request.faultId())
                .orElseThrow(() -> new DiagnosticFaultNotFoundException(request.faultId()));
        SparePart sparePart = findActiveSparePart(request.sparePartId());
        if (request.phoneVariantId() != null) {
            variants.findById(request.phoneVariantId())
                    .filter(com.phoneTech.demo.devices.entity.PhoneVariant::isActive)
                    .orElseThrow(() -> new com.phoneTech.demo.devices.exception.DeviceVariantNotFoundException(
                            request.phoneVariantId()));
        }
        DiagnosticFaultPart relation = faultParts.save(new DiagnosticFaultPart(fault, sparePart,
                request.phoneVariantId(), request.quantity(), request.required(), request.notes()));
        return getPartsForFault(fault.getId()).stream()
                .filter(item -> item.sparePartId().equals(relation.getSparePart().getId()))
                .findFirst().orElseThrow();
    }

    private Supplier findSupplier(Long id) {
        return suppliers.findById(id).orElseThrow(() -> new SupplierNotFoundException(id));
    }

    private Supplier findActiveSupplier(Long id) {
        Supplier supplier = findSupplier(id);
        if (!supplier.isActive()) throw new SupplierNotFoundException(id);
        return supplier;
    }

    private SparePart findSparePart(Long id) {
        return spareParts.findById(id).orElseThrow(() -> new SparePartNotFoundException(id));
    }

    private SparePart findActiveSparePart(Long id) {
        SparePart sparePart = findSparePart(id);
        if (!sparePart.isActive()) throw new SparePartNotFoundException(id);
        return sparePart;
    }

    private SupplierResponse supplierResponse(Supplier s) {
        return new SupplierResponse(s.getId(), s.getName(), s.getContactName(), s.getPhone(), s.getWhatsapp(),
                s.getEmail(), s.getAddress(), s.getCity(), s.getNotes(), s.isActive(), s.getCreatedAt(), s.getUpdatedAt());
    }

    private SparePartResponse sparePartResponse(SparePart p) {
        return new SparePartResponse(p.getId(), p.getPartCode(), p.getName(), p.getComponentCode(),
                p.getDescription(), p.getImageUri(), p.isActive(), p.getCreatedAt(), p.getUpdatedAt());
    }

    private SupplierSparePartResponse offerResponse(SupplierSparePart o) {
        return new SupplierSparePartResponse(o.getId(), o.getSupplier().getId(), o.getSupplier().getName(),
                o.getSparePart().getId(), o.getSparePart().getName(), o.getSupplierSku(), o.getPurchasePrice(),
                o.getCurrency(), o.isAvailable(), o.getNotes(), o.getCreatedAt(), o.getUpdatedAt());
    }
}
