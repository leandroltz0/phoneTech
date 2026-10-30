package com.phoneTech.demo.parts.dto;

import java.math.BigDecimal;
import java.util.List;

public record RepairPartCostResponse(
        Long sparePartId,
        String sparePartName,
        List<Long> faultIds,
        int quantity,
        BigDecimal unitCost,
        BigDecimal totalCost,
        String currency,
        Long supplierOfferId,
        Long supplierId,
        String supplierName
) {
}
