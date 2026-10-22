package com.phoneTech.demo.projects.service;

import com.phoneTech.demo.projects.dto.ProjectResponse;
import com.phoneTech.demo.projects.entity.Project;
import com.phoneTech.demo.projects.repository.ProjectRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private ProjectResponse toResponse(Project project) {
        return new ProjectResponse(
                project.getId(),
                project.getProjectNumber(),
                project.getPhoneModel(),
                project.getVariant(),
                project.getDiagnosis(),
                project.getEstimatedProfit(),
                project.getActualProfit(),
                project.getStatus(),
                project.getCreatedAt()
        );
    }
}
