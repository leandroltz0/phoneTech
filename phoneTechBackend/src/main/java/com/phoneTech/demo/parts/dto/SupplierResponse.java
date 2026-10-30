package com.phoneTech.demo.parts.dto;

import java.time.Instant;

public record SupplierResponse(
        Long id,
        String name,
        String contactName,
        String phone,
        String whatsapp,
        String email,
        String address,
        String city,
        String notes,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {
}
