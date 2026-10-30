package com.phoneTech.demo.devices.dto;

import java.util.List;

public record DevicePageResponse(
        List<DeviceSummaryResponse> items,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext
) {
}
