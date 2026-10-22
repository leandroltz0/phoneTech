package com.phoneTech.demo.projects.dto;

import com.phoneTech.demo.projects.enums.ProjectStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProjectResponse(
        Long id,
        Integer projectNumber,
        String phoneModel,
        String variant,
        String diagnosis,
        BigDecimal estimatedProfit,
        BigDecimal actualProfit,
        ProjectStatus status,
        LocalDateTime createdAt
) {
}
