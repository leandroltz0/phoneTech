package com.phoneTech.demo.devices.dto;

import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;

public record DeviceDetailResponse(
        Long id,
        String brand,
        String commercialName,
        String imageUri,
        UnlockToolSupportStatus unlockToolStatus
) {
}
