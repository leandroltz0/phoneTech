package com.phoneTech.demo.devices.dto;
import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus; import java.util.List;
public record UnlockToolSupportResponse(UnlockToolSupportStatus status,String displayName,String description,List<String> methods,String lastVerifiedAt){}
