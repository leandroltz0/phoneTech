package com.phoneTech.demo.devices.dto;
import java.math.BigDecimal;
public record ResaleEstimateResponse(String condition,BigDecimal amount,String currency,String referenceDate,String source){}
