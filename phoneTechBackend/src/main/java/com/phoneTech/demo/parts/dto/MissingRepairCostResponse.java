package com.phoneTech.demo.parts.dto;

public record MissingRepairCostResponse(
        Long faultId,
        Long sparePartId,
        String sparePartName,
        String reason
) {
}
