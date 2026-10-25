package com.phoneTech.demo.projects.controller;

import com.phoneTech.demo.projects.dto.ProjectImageResponse;
import com.phoneTech.demo.projects.exception.InvalidImageException;
import com.phoneTech.demo.projects.exception.ProjectNotFoundException;
import com.phoneTech.demo.projects.exception.RestExceptionHandler;
import com.phoneTech.demo.projects.service.ProjectImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProjectImageControllerTest {

    @Mock
    private ProjectImageService imageService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new ProjectImageController(imageService))
                .setControllerAdvice(new RestExceptionHandler())
                .build();
    }

    @Test
    void uploadsImageAndReturnsCreated() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "foto.jpg", "image/jpeg",
                "contenido".getBytes(StandardCharsets.UTF_8));
        when(imageService.uploadImage(eq(3L), any())).thenReturn(
                new ProjectImageResponse(7L, 3L, "9f2c-photo.jpg", "/uploads/9f2c-photo.jpg", 1));

        mockMvc.perform(multipart("/api/v1/projects/3/images").file(file))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.projectId").value(3))
                .andExpect(jsonPath("$.fileName").value("9f2c-photo.jpg"))
                .andExpect(jsonPath("$.url").value("/uploads/9f2c-photo.jpg"))
                .andExpect(jsonPath("$.sortOrder").value(1));
    }

    @Test
    void returnsBadRequestWhenImageIsRejected() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "doc.pdf", "application/pdf",
                "contenido".getBytes(StandardCharsets.UTF_8));
        when(imageService.uploadImage(eq(3L), any())).thenThrow(new InvalidImageException("Unsupported image type: application/pdf"));

        mockMvc.perform(multipart("/api/v1/projects/3/images").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").value("Unsupported image type: application/pdf"));
    }

    @Test
    void returnsNotFoundWhenProjectDoesNotExist() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "foto.jpg", "image/jpeg",
                "contenido".getBytes(StandardCharsets.UTF_8));
        when(imageService.uploadImage(eq(999L), any())).thenThrow(new ProjectNotFoundException(999L));

        mockMvc.perform(multipart("/api/v1/projects/999/images").file(file))
                .andExpect(status().isNotFound());
    }

    @Test
    void returnsImageList() throws Exception {
        when(imageService.getImages(3L)).thenReturn(List.of(
                new ProjectImageResponse(7L, 3L, "a.jpg", "/uploads/a.jpg", 1),
                new ProjectImageResponse(8L, 3L, "b.png", "/uploads/b.png", 2)
        ));

        mockMvc.perform(get("/api/v1/projects/3/images"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].url").value("/uploads/a.jpg"))
                .andExpect(jsonPath("$[1].url").value("/uploads/b.png"));
    }
}
