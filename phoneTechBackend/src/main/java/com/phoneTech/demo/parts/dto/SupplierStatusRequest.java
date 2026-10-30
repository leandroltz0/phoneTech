package com.phoneTech.demo.parts.dto;

import jakarta.validation.constraints.NotNull;

public record SupplierStatusRequest(@NotNull Boolean active) {
}
