package com.phoneTech.demo.projects.controller;

import com.phoneTech.demo.projects.dto.ProjectRepairCostResponse;
import com.phoneTech.demo.projects.dto.ProjectSparePartRequest;
import com.phoneTech.demo.projects.dto.ProjectSparePartResponse;
import com.phoneTech.demo.projects.service.ProjectSparePartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}")
public class ProjectSparePartController {

    private final ProjectSparePartService service;

    public ProjectSparePartController(ProjectSparePartService service) {
        this.service = service;
    }

    @GetMapping("/spare-parts")
    public ResponseEntity<List<ProjectSparePartResponse>> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(service.getProjectParts(projectId));
    }

    @PostMapping("/spare-parts")
    public ResponseEntity<ProjectSparePartResponse> add(@PathVariable Long projectId,
                                                        @Valid @RequestBody ProjectSparePartRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.addProjectPart(projectId, request));
    }

    @PutMapping("/spare-parts/{id}")
    public ResponseEntity<ProjectSparePartResponse> update(@PathVariable Long projectId,
                                                           @PathVariable Long id,
                                                           @Valid @RequestBody ProjectSparePartRequest request) {
        return ResponseEntity.ok(service.updateProjectPart(projectId, id, request));
    }

    @DeleteMapping("/spare-parts/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId, @PathVariable Long id) {
        service.deleteProjectPart(projectId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/repair-cost")
    public ResponseEntity<ProjectRepairCostResponse> repairCost(@PathVariable Long projectId) {
        return ResponseEntity.ok(service.getRepairCost(projectId));
    }
}
