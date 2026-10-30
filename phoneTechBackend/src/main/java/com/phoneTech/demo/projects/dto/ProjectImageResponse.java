package com.phoneTech.demo.projects.dto;

public record ProjectImageResponse(
        Long id,
        Long projectId,
        String fileName,
        String url,
        int sortOrder
) {
}
