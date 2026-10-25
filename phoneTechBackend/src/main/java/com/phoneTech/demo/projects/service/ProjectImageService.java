package com.phoneTech.demo.projects.service;

import com.phoneTech.demo.projects.dto.ProjectImageResponse;
import com.phoneTech.demo.projects.entity.ProjectImage;
import com.phoneTech.demo.projects.exception.InvalidImageException;
import com.phoneTech.demo.projects.exception.ProjectNotFoundException;
import com.phoneTech.demo.projects.repository.ProjectImageRepository;
import com.phoneTech.demo.projects.repository.ProjectRepository;
import com.phoneTech.demo.projects.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class ProjectImageService {

    private static final Map<String, String> EXTENSIONS_BY_CONTENT_TYPE = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp",
            "image/gif", "gif"
    );

    private final ProjectRepository projectRepository;
    private final ProjectImageRepository imageRepository;
    private final StorageService storageService;

    public ProjectImageService(ProjectRepository projectRepository,
                               ProjectImageRepository imageRepository,
                               StorageService storageService) {
        this.projectRepository = projectRepository;
        this.imageRepository = imageRepository;
        this.storageService = storageService;
    }

    @Transactional
    public ProjectImageResponse uploadImage(Long projectId, MultipartFile file) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException(projectId);
        }

        String extension = resolveExtension(file);
        String fileName = storageService.store(file, extension);
        try {
            ProjectImage image = new ProjectImage(projectId, fileName, imageRepository.nextSortOrder(projectId));
            imageRepository.save(image);
            return toResponse(image);
        } catch (RuntimeException e) {
            storageService.delete(fileName);
            throw e;
        }
    }

    @Transactional(readOnly = true)
    public List<ProjectImageResponse> getImages(Long projectId) {
        if (!projectRepository.existsById(projectId)) {
            throw new ProjectNotFoundException(projectId);
        }
        return imageRepository.findByProjectIdOrderBySortOrderAscCreatedAtAsc(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    private String resolveExtension(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidImageException("The image file is empty");
        }

        String contentType = file.getContentType();
        String extension = contentType == null
                ? null
                : EXTENSIONS_BY_CONTENT_TYPE.get(contentType.toLowerCase(Locale.ROOT));
        if (extension == null) {
            throw new InvalidImageException("Unsupported image type: " + contentType);
        }
        return extension;
    }

    private ProjectImageResponse toResponse(ProjectImage image) {
        return new ProjectImageResponse(
                image.getId(),
                image.getProjectId(),
                image.getFileName(),
                "/uploads/" + image.getFileName(),
                image.getSortOrder()
        );
    }
}
