package com.phoneTech.demo.parts.controller;

import com.phoneTech.demo.parts.dto.RepairPriceCalculationRequest;
import com.phoneTech.demo.parts.dto.RepairPriceCalculationResponse;
import com.phoneTech.demo.parts.service.RepairPriceCalculationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/repair-price-calculations")
public class RepairPriceCalculationController {

    private final RepairPriceCalculationService service;

    public RepairPriceCalculationController(RepairPriceCalculationService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<RepairPriceCalculationResponse> calculate(
            @Valid @RequestBody RepairPriceCalculationRequest request) {
        return ResponseEntity.ok(service.calculate(request));
    }
}
