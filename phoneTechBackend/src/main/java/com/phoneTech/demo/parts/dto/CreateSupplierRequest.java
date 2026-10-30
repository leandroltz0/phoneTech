package com.phoneTech.demo.parts.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CreateSupplierRequest(
        @NotBlank(message = "El nombre del proveedor es obligatorio") String name,
        String contactName,
        String phone,
        String whatsapp,
        @Email(message = "El email del proveedor no es válido") String email,
        String address,
        String city,
        String notes) {
}
