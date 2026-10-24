package com.phoneTech.demo.projects.dto;

import com.phoneTech.demo.projects.enums.ProjectStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProjectDetailResponse(
        Long id,
        Long projectNumber,
        String phoneModel,
        BigDecimal estimatedProfit,
        ProjectStatus status,
        Instant createdAt,
        List<ProjectFaultResponse> diagnosis
) {
}
