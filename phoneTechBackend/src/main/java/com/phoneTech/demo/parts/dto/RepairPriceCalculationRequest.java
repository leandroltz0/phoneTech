package com.phoneTech.demo.parts.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public record RepairPriceCalculationRequest(
        @NotNull Long deviceId,
        @NotNull Long variantId,
        @NotNull List<@NotNull Long> faultIds,
        String saleCondition
) {
}
