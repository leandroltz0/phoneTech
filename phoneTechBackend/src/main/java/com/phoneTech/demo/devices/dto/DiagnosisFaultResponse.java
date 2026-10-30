package com.phoneTech.demo.devices.dto;
public record DiagnosisFaultResponse(Long id,String code,String name,String description,String imageUri,int sortOrder,boolean active){}
