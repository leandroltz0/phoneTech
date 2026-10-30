package com.phoneTech.demo.devices.dto;
import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus; import java.util.List;
public record SelectionVariantResponse(Long id,String modelCode,String variantName,Integer ramGb,Integer storageGb,String chipset,String region,UnlockToolSupportStatus unlockToolStatus,String imageUri,boolean isCommon,ResaleEstimateResponse resaleEstimate,List<ResaleEstimateResponse> resaleEstimates){}
