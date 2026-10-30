package com.phoneTech.demo.devices.dto;
import java.util.List;
public record DeviceSelectionDataResponse(DeviceDetailResponse device,UnlockToolSupportResponse unlockTool,List<SelectionVariantResponse> variants,List<DiagnosisCategoryResponse> diagnosisCategories){}
