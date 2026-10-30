package com.phoneTech.demo.projects.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ProjectSparePartRequest(
        @NotNull Long sparePartId,
        Long supplierSparePartId,
        @NotNull @Positive Integer quantity,
        @DecimalMin(value = "0.00", inclusive = false, message = "El costo unitario debe ser mayor que cero") BigDecimal unitCost,
        @Pattern(regexp = "[A-Z]{3}", message = "La moneda debe tener tres letras mayúsculas") String currency,
        @NotNull Boolean purchased) {
}
