package com.phoneTech.demo.devices.dto;

import java.math.BigDecimal;

public record DeviceVariantResponse(
        Long id,
        String code,
        String ram,
        String storage,
        BigDecimal resalePrice,
        Boolean isCommon,
        String imageUri
) {
    public DeviceVariantResponse(Long id, String code, String ram, String storage,
                                 BigDecimal resalePrice, Boolean isCommon) {
        this(id, code, ram, storage, resalePrice, isCommon, null);
    }
}
