package com.phoneTech.demo.projects.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ProjectSparePartResponse(
        Long id,
        Long projectId,
        Long sparePartId,
        String sparePartName,
        Long supplierId,
        String supplierName,
        Long supplierSparePartId,
        int quantity,
        BigDecimal unitCost,
        BigDecimal totalCost,
        String currency,
        boolean purchased,
        Instant purchasedAt,
        Instant createdAt,
        Instant updatedAt) {
}
