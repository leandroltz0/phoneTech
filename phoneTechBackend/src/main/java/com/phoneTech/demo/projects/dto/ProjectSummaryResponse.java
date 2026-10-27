package com.phoneTech.demo.projects.dto;

import com.phoneTech.demo.projects.enums.ProjectStatus;

import java.math.BigDecimal;

public record ProjectSummaryResponse(
        Long id,
        Long projectNumber,
        String phoneModel,
        BigDecimal estimatedProfit,
        String diagnosis,
        String imageUrl,
        ProjectStatus status
) {
}
