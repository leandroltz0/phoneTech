package com.phoneTech.demo.projects.service;

import com.phoneTech.demo.parts.entity.SparePart;
import com.phoneTech.demo.parts.entity.SupplierSparePart;
import com.phoneTech.demo.parts.repository.SparePartRepository;
import com.phoneTech.demo.parts.repository.SupplierSparePartRepository;
import com.phoneTech.demo.projects.dto.ProjectRepairCostResponse;
import com.phoneTech.demo.projects.dto.ProjectSparePartRequest;
import com.phoneTech.demo.projects.dto.ProjectSparePartResponse;
import com.phoneTech.demo.projects.entity.ProjectSparePart;
import com.phoneTech.demo.projects.exception.ProjectNotFoundException;
import com.phoneTech.demo.projects.exception.ProjectSparePartNotFoundException;
import com.phoneTech.demo.projects.repository.ProjectRepository;
import com.phoneTech.demo.projects.repository.ProjectSparePartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProjectSparePartService {

    private final ProjectRepository projects;
    private final ProjectSparePartRepository projectParts;
    private final SparePartRepository spareParts;
    private final SupplierSparePartRepository offers;

    public ProjectSparePartService(ProjectRepository projects, ProjectSparePartRepository projectParts,
                                   SparePartRepository spareParts, SupplierSparePartRepository offers) {
        this.projects = projects;
        this.projectParts = projectParts;
        this.spareParts = spareParts;
        this.offers = offers;
    }

    @Transactional(readOnly = true)
    public List<ProjectSparePartResponse> getProjectParts(Long projectId) {
        ensureProject(projectId);
        return projectParts.findByProjectIdOrderByCreatedAtAsc(projectId).stream().map(this::response).toList();
    }

    @Transactional
    public ProjectSparePartResponse addProjectPart(Long projectId, ProjectSparePartRequest request) {
        ensureProject(projectId);
        ResolvedPart resolved = resolve(request);
        ProjectSparePart entity = new ProjectSparePart(projectId, resolved.sparePart(), resolved.supplier(),
                resolved.offer(), request.quantity(), resolved.unitCost(), resolved.currency(), request.purchased());
        return response(projectParts.save(entity));
    }

    @Transactional
    public ProjectSparePartResponse updateProjectPart(Long projectId, Long id, ProjectSparePartRequest request) {
        ensureProject(projectId);
        ProjectSparePart entity = projectParts.findById(id)
                .filter(item -> item.getProjectId().equals(projectId))
                .orElseThrow(() -> new ProjectSparePartNotFoundException(id));
        ResolvedPart resolved = resolve(request);
        entity.update(resolved.sparePart(), resolved.supplier(), resolved.offer(), request.quantity(),
                resolved.unitCost(), resolved.currency(), request.purchased());
        return response(projectParts.save(entity));
    }

    @Transactional
    public void deleteProjectPart(Long projectId, Long id) {
        ensureProject(projectId);
        ProjectSparePart entity = projectParts.findById(id)
                .filter(item -> item.getProjectId().equals(projectId))
                .orElseThrow(() -> new ProjectSparePartNotFoundException(id));
        projectParts.delete(entity);
    }

    @Transactional(readOnly = true)
    public ProjectRepairCostResponse getRepairCost(Long projectId) {
        List<ProjectSparePartResponse> items = getProjectParts(projectId);
        BigDecimal total = items.stream().map(ProjectSparePartResponse::totalCost)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        String currency = items.stream().map(ProjectSparePartResponse::currency).distinct().count() == 1
                ? items.getFirst().currency() : null;
        return new ProjectRepairCostResponse(projectId, items, total, currency);
    }

    private ResolvedPart resolve(ProjectSparePartRequest request) {
        SparePart sparePart = spareParts.findById(request.sparePartId())
                .orElseThrow(() -> new IllegalArgumentException("Spare part not found: " + request.sparePartId()));
        if (request.supplierSparePartId() == null) {
            if (request.unitCost() == null || request.currency() == null) {
                throw new IllegalArgumentException("unitCost and currency are required without a supplier offer");
            }
            return new ResolvedPart(sparePart, null, null, request.unitCost(), request.currency());
        }
        SupplierSparePart offer = offers.findById(request.supplierSparePartId())
                .orElseThrow(() -> new IllegalArgumentException("Supplier offer not found: " + request.supplierSparePartId()));
        if (!offer.getSparePart().getId().equals(sparePart.getId())) {
            throw new IllegalArgumentException("The supplier offer does not belong to the selected spare part");
        }
        return new ResolvedPart(sparePart, offer.getSupplier(), offer, offer.getPurchasePrice(), offer.getCurrency());
    }

    private void ensureProject(Long projectId) {
        if (!projects.existsById(projectId)) throw new ProjectNotFoundException(projectId);
    }

    private ProjectSparePartResponse response(ProjectSparePart item) {
        BigDecimal total = item.getUnitCost().multiply(BigDecimal.valueOf(item.getQuantity()));
        return new ProjectSparePartResponse(item.getId(), item.getProjectId(), item.getSparePart().getId(),
                item.getSparePart().getName(), item.getSupplier() == null ? null : item.getSupplier().getId(),
                item.getSupplier() == null ? null : item.getSupplier().getName(),
                item.getSupplierSparePart() == null ? null : item.getSupplierSparePart().getId(),
                item.getQuantity(), item.getUnitCost(), total, item.getCurrency(), item.isPurchased(),
                item.getPurchasedAt(), item.getCreatedAt(), item.getUpdatedAt());
    }

    private record ResolvedPart(SparePart sparePart, com.phoneTech.demo.parts.entity.Supplier supplier,
                                SupplierSparePart offer, BigDecimal unitCost, String currency) {
    }
}
