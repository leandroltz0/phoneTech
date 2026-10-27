package com.phoneTech.demo.projects.service;

import com.phoneTech.demo.projects.dto.ProjectDetailResponse;
import com.phoneTech.demo.projects.dto.ProjectFaultResponse;
import com.phoneTech.demo.projects.dto.ProjectSummaryResponse;
import com.phoneTech.demo.projects.enums.ProjectStatus;
import com.phoneTech.demo.projects.exception.ProjectNotFoundException;
import com.phoneTech.demo.projects.repository.ProjectRepository;
import com.phoneTech.demo.projects.repository.ProjectRepository.ProjectDetailRow;
import com.phoneTech.demo.projects.repository.ProjectRepository.ProjectSummaryRow;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectSummaryResponse> getAllProjects() {
        return projectRepository.findProjectSummaries().stream()
                .map(this::toSummary)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectById(Long id) {
        List<ProjectDetailRow> rows = projectRepository.findProjectDetail(id);
        if (rows.isEmpty()) {
            throw new ProjectNotFoundException(id);
        }

        ProjectDetailRow project = rows.get(0);
        List<ProjectFaultResponse> diagnosis = rows.stream()
                .filter(row -> row.getFaultId() != null)
                .map(this::toFault)
                .toList();

        return new ProjectDetailResponse(
                project.getId(),
                project.getProjectNumber(),
                project.getPhoneModel(),
                project.getEstimatedProfit(),
                toStatus(project.getStatus()),
                project.getCreatedAt(),
                diagnosis
        );
    }

    private ProjectSummaryResponse toSummary(ProjectSummaryRow row) {
        return new ProjectSummaryResponse(
                row.getId(),
                row.getProjectNumber(),
                row.getPhoneModel(),
                row.getEstimatedProfit(),
                row.getDiagnosis(),
                row.getImageUrl(),
                toStatus(row.getStatus())
        );
    }

    private ProjectFaultResponse toFault(ProjectDetailRow row) {
        return new ProjectFaultResponse(
                row.getComponentCode(),
                row.getComponentName(),
                row.getFaultCode(),
                row.getFaultName(),
                row.getDescription(),
                row.getImageUri(),
                Boolean.TRUE.equals(row.getConfirmed()),
                row.getNotes()
        );
    }

    private ProjectStatus toStatus(String status) {
        return ProjectStatus.valueOf(status);
    }
}
