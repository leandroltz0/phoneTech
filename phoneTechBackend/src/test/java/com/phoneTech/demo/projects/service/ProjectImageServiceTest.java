package com.phoneTech.demo.projects.service;

import com.phoneTech.demo.projects.dto.ProjectImageResponse;
import com.phoneTech.demo.projects.entity.ProjectImage;
import com.phoneTech.demo.projects.exception.InvalidImageException;
import com.phoneTech.demo.projects.exception.ProjectNotFoundException;
import com.phoneTech.demo.projects.repository.ProjectImageRepository;
import com.phoneTech.demo.projects.repository.ProjectRepository;
import com.phoneTech.demo.projects.storage.StorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectImageServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectImageRepository imageRepository;

    @Mock
    private StorageService storageService;

    private ProjectImageService service() {
        return new ProjectImageService(projectRepository, imageRepository, storageService);
    }

    @Test
    void storesUploadedImageAndReturnsItsPublicUrl() {
        MultipartFile file = imageFile("image/jpeg");
        when(projectRepository.existsById(3L)).thenReturn(true);
        when(imageRepository.nextSortOrder(3L)).thenReturn(1);
        when(storageService.store(file, "jpg")).thenReturn("9f2c-photo.jpg");

        ProjectImageResponse response = service().uploadImage(3L, file);

        assertThat(response.projectId()).isEqualTo(3L);
        assertThat(response.fileName()).isEqualTo("9f2c-photo.jpg");
        assertThat(response.url()).isEqualTo("/uploads/9f2c-photo.jpg");
        assertThat(response.sortOrder()).isEqualTo(1);
        verify(imageRepository).save(any(ProjectImage.class));
    }

    @Test
    void rejectsFileWithoutContent() {
        MultipartFile file = new MockMultipartFile("file", "vacio.jpg", "image/jpeg", new byte[0]);
        when(projectRepository.existsById(3L)).thenReturn(true);

        assertThatThrownBy(() -> service().uploadImage(3L, file))
                .isInstanceOf(InvalidImageException.class)
                .hasMessage("The image file is empty");

        verify(storageService, never()).store(any(), anyString());
    }

    @Test
    void rejectsUnsupportedContentType() {
        MultipartFile file = new MockMultipartFile("file", "doc.pdf", "application/pdf", "contenido".getBytes(StandardCharsets.UTF_8));
        when(projectRepository.existsById(3L)).thenReturn(true);

        assertThatThrownBy(() -> service().uploadImage(3L, file))
                .isInstanceOf(InvalidImageException.class)
                .hasMessage("Unsupported image type: application/pdf");

        verify(storageService, never()).store(any(), anyString());
    }

    @Test
    void doesNotStoreAnythingWhenProjectDoesNotExist() {
        MultipartFile file = imageFile("image/png");
        when(projectRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> service().uploadImage(999L, file))
                .isInstanceOf(ProjectNotFoundException.class);

        verify(storageService, never()).store(any(), anyString());
    }

    @Test
    void deletesStoredFileWhenPersistenceFails() {
        MultipartFile file = imageFile("image/png");
        when(projectRepository.existsById(3L)).thenReturn(true);
        when(imageRepository.nextSortOrder(3L)).thenReturn(1);
        when(storageService.store(file, "png")).thenReturn("9f2c-photo.png");
        when(imageRepository.save(any(ProjectImage.class))).thenThrow(new IllegalStateException("db down"));

        assertThatThrownBy(() -> service().uploadImage(3L, file))
                .isInstanceOf(IllegalStateException.class);

        verify(storageService).delete("9f2c-photo.png");
    }

    @Test
    void listsImagesOrderedBySortOrder() {
        when(projectRepository.existsById(3L)).thenReturn(true);
        when(imageRepository.findByProjectIdOrderBySortOrderAscCreatedAtAsc(3L)).thenReturn(List.of(
                new ProjectImage(3L, "a.jpg", 1),
                new ProjectImage(3L, "b.png", 2)
        ));

        List<ProjectImageResponse> response = service().getImages(3L);

        assertThat(response).hasSize(2);
        assertThat(response.get(0).url()).isEqualTo("/uploads/a.jpg");
        assertThat(response.get(1).fileName()).isEqualTo("b.png");
    }

    @Test
    void throwsNotFoundWhenListingImagesOfMissingProject() {
        when(projectRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> service().getImages(999L))
                .isInstanceOf(ProjectNotFoundException.class);
    }

    private MultipartFile imageFile(String contentType) {
        return new MockMultipartFile("file", "foto.jpg", contentType, "contenido".getBytes(StandardCharsets.UTF_8));
    }
}
