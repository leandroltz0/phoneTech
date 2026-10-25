package com.phoneTech.demo.projects.controller;

import com.phoneTech.demo.projects.dto.ProjectImageResponse;
import com.phoneTech.demo.projects.service.ProjectImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/images")
public class ProjectImageController {

    private final ProjectImageService imageService;

    public ProjectImageController(ProjectImageService imageService) {
        this.imageService = imageService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectImageResponse>> getImages(@PathVariable Long projectId) {
        return ResponseEntity.ok(imageService.getImages(projectId));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectImageResponse> uploadImage(@PathVariable Long projectId,
                                                            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imageService.uploadImage(projectId, file));
    }
}
