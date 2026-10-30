package com.phoneTech.demo.parts.dto;

import java.util.List;

public record SupplierDetailResponse(
        SupplierResponse supplier,
        List<SupplierSparePartResponse> offers) {
}
