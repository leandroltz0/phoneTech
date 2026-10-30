package com.phoneTech.demo.parts.controller;

import com.phoneTech.demo.parts.dto.CreateSupplierRequest;
import com.phoneTech.demo.parts.dto.CreateSupplierSparePartRequest;
import com.phoneTech.demo.parts.dto.SupplierResponse;
import com.phoneTech.demo.parts.dto.SupplierDetailResponse;
import com.phoneTech.demo.parts.dto.SupplierSparePartResponse;
import com.phoneTech.demo.parts.dto.SupplierStatusRequest;
import com.phoneTech.demo.parts.service.PartsCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/suppliers")
public class SupplierController {

    private final PartsCatalogService service;

    public SupplierController(PartsCatalogService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SupplierResponse>> list() {
        return ResponseEntity.ok(service.getActiveSuppliers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDetailResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getSupplier(id));
    }

    @PostMapping
    public ResponseEntity<SupplierResponse> create(@Valid @RequestBody CreateSupplierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createSupplier(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponse> update(@PathVariable Long id,
                                                   @Valid @RequestBody CreateSupplierRequest request) {
        return ResponseEntity.ok(service.updateSupplier(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SupplierResponse> updateStatus(@PathVariable Long id,
                                                         @Valid @RequestBody SupplierStatusRequest request) {
        return ResponseEntity.ok(service.updateSupplierStatus(id, request.active()));
    }

    @GetMapping("/{id}/offers")
    public ResponseEntity<List<SupplierSparePartResponse>> offers(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOffersForSupplier(id));
    }
}
