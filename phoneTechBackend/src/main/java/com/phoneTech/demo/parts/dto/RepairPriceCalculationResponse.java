package com.phoneTech.demo.parts.dto;

import java.math.BigDecimal;
import java.util.List;

public record RepairPriceCalculationResponse(
        Long deviceId,
        String brand,
        String commercialName,
        Long variantId,
        String modelCode,
        String saleCondition,
        BigDecimal resalePrice,
        String currency,
        BigDecimal repairPartsCost,
        BigDecimal minimumProfit,
        BigDecimal maximumPurchasePrice,
        BigDecimal projectedProfit,
        boolean calculationAvailable,
        boolean purchaseAllowed,
        List<RepairPartCostResponse> parts,
        List<MissingRepairCostResponse> missingCosts
) {
}
