package com.phoneTech.demo.parts.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record SupplierSparePartResponse(
        Long id,
        Long supplierId,
        String supplierName,
        Long sparePartId,
        String sparePartName,
        String supplierSku,
        BigDecimal purchasePrice,
        String currency,
        boolean available,
        String notes,
        Instant createdAt,
        Instant updatedAt) {
}
