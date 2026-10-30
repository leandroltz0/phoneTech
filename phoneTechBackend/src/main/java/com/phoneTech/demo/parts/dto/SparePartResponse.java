package com.phoneTech.demo.parts.dto;

import java.time.Instant;

public record SparePartResponse(
        Long id,
        String partCode,
        String name,
        String componentCode,
        String description,
        boolean active,
        Instant createdAt,
        Instant updatedAt) {
}
