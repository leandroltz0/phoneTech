package com.phoneTech.demo.parts.controller;

import com.phoneTech.demo.parts.dto.CreateDiagnosticFaultPartRequest;
import com.phoneTech.demo.parts.dto.DiagnosticFaultPartResponse;
import com.phoneTech.demo.parts.service.PartsCatalogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/diagnostic-faults")
public class DiagnosticFaultPartController {

    private final PartsCatalogService service;

    public DiagnosticFaultPartController(PartsCatalogService service) {
        this.service = service;
    }

    @GetMapping("/{faultId}/parts")
    public ResponseEntity<List<DiagnosticFaultPartResponse>> getParts(@PathVariable Long faultId) {
        return ResponseEntity.ok(service.getPartsForFault(faultId));
    }

    @PostMapping("/parts")
    public ResponseEntity<DiagnosticFaultPartResponse> createRelation(
            @Valid @RequestBody CreateDiagnosticFaultPartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createFaultPartRelation(request));
    }
}
