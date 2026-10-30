package com.phoneTech.demo.parts.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CreateSparePartRequest(
        String partCode,
        @NotBlank(message = "El nombre del repuesto es obligatorio") String name,
        String componentCode,
        String description,
        @Pattern(regexp = "/uploads/spare-parts/.+", message = "imageUri debe ser una ruta relativa dentro de /uploads/spare-parts")
        String imageUri) {
}
