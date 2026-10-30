package com.phoneTech.demo.parts.controller;

import com.phoneTech.demo.parts.dto.CreateSparePartRequest;
import com.phoneTech.demo.parts.dto.CreateSupplierSparePartRequest;
import com.phoneTech.demo.parts.dto.SparePartResponse;
import com.phoneTech.demo.parts.dto.SupplierSparePartResponse;
import com.phoneTech.demo.parts.service.PartsCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spare-parts")
public class SparePartController {

    private final PartsCatalogService service;

    public SparePartController(PartsCatalogService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SparePartResponse>> list() {
        return ResponseEntity.ok(service.getActiveSpareParts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePartResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getSparePart(id));
    }

    @PostMapping
    public ResponseEntity<SparePartResponse> create(@Valid @RequestBody CreateSparePartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createSparePart(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SparePartResponse> update(@PathVariable Long id,
                                                    @Valid @RequestBody CreateSparePartRequest request) {
        return ResponseEntity.ok(service.updateSparePart(id, request));
    }

    @GetMapping("/{id}/suppliers")
    public ResponseEntity<List<SupplierSparePartResponse>> offers(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOffersForSparePart(id));
    }
}
