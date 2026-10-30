package com.phoneTech.demo.parts.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateDiagnosticFaultPartRequest(
        @NotNull Long faultId,
        @NotNull Long sparePartId,
        @NotNull @Positive Integer quantity,
        @NotNull Boolean required,
        String notes,
        Long phoneVariantId) {
}
