package com.phoneTech.demo.parts.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateSparePartRequest(
        String partCode,
        @NotBlank(message = "El nombre del repuesto es obligatorio") String name,
        String componentCode,
        String description) {
}
