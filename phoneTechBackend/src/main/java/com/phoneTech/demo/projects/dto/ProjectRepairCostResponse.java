package com.phoneTech.demo.projects.dto;

import java.math.BigDecimal;
import java.util.List;

public record ProjectRepairCostResponse(
        Long projectId,
        List<ProjectSparePartResponse> items,
        BigDecimal totalCost,
        String currency) {
}
