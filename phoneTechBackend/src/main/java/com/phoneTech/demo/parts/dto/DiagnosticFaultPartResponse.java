package com.phoneTech.demo.parts.dto;

import java.util.List;

public record DiagnosticFaultPartResponse(
        Long faultId,
        String faultCode,
        String faultName,
        Long phoneVariantId,
        Long sparePartId,
        String sparePartName,
        int quantity,
        boolean required,
        String notes,
        List<SupplierSparePartResponse> availableOffers) {
}
