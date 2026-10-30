package com.phoneTech.demo.parts.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record CreateSupplierSparePartRequest(
        @NotNull Long supplierId,
        @NotNull Long sparePartId,
        String supplierSku,
        @NotNull @DecimalMin(value = "0.00", inclusive = false, message = "El precio debe ser mayor que cero") BigDecimal purchasePrice,
        @NotBlank @Pattern(regexp = "[A-Z]{3}", message = "La moneda debe tener tres letras mayúsculas") String currency,
        @NotNull Boolean available,
        String notes) {
}
