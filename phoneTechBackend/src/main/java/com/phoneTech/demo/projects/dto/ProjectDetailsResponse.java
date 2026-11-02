package com.phoneTech.demo.projects.dto;

import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import com.phoneTech.demo.projects.enums.ProjectStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record ProjectDetailsResponse(
        Long id,
        Long projectNumber,
        String phoneModel,
        ProjectStatus status,
        Instant createdAt,
        UnlockToolSupportStatus unlockToolStatus,
        String modelCode,
        String variantName,
        Short ramGb,
        Short storageGb,
        String chipset,
        String region,
        String imageUrl,
        BigDecimal salePrice,
        String saleCurrency,
        BigDecimal estimatedProfit,
        BigDecimal repairCost,
        String repairCurrency,
        List<ProjectFaultResponse> diagnosis
) {
}
