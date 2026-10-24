package com.phoneTech.demo.projects.dto;

public record ProjectFaultResponse(
        String componentCode,
        String componentName,
        String faultCode,
        String faultName,
        String description,
        String imageUri,
        boolean confirmed,
        String notes
) {
}
