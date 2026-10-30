package com.phoneTech.demo.devices.dto;
import java.util.List;
public record DiagnosisCategoryResponse(Long id,String code,String name,String description,String icon,int sortOrder,boolean active,List<DiagnosisFaultResponse> faults){}
