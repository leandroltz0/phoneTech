package com.phoneTech.demo.parts.controller;

import com.phoneTech.demo.parts.dto.CreateSupplierSparePartRequest;
import com.phoneTech.demo.parts.dto.SupplierSparePartResponse;
import com.phoneTech.demo.parts.service.PartsCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/supplier-spare-parts")
public class SupplierSparePartController {

    private final PartsCatalogService service;

    public SupplierSparePartController(PartsCatalogService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SupplierSparePartResponse> create(
            @Valid @RequestBody CreateSupplierSparePartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createOffer(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierSparePartResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody CreateSupplierSparePartRequest request) {
        return ResponseEntity.ok(service.updateOffer(id, request));
    }
}
