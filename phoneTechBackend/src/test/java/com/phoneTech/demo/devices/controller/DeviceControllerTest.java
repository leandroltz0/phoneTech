package com.phoneTech.demo.devices.controller;

import com.phoneTech.demo.devices.dto.DeviceDetailResponse;
import com.phoneTech.demo.devices.dto.DevicePageResponse;
import com.phoneTech.demo.devices.dto.DeviceSummaryResponse;
import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import com.phoneTech.demo.devices.exception.DeviceNotFoundException;
import com.phoneTech.demo.devices.service.DeviceService;
import com.phoneTech.demo.projects.exception.InvalidImageException;
import com.phoneTech.demo.projects.exception.RestExceptionHandler;
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

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class DeviceControllerTest {

    @Mock
    private DeviceService deviceService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new DeviceController(deviceService))
                .setControllerAdvice(new RestExceptionHandler())
                .build();
    }

    @Test
    void returnsDevicesPageWithSummaryFields() throws Exception {
        when(deviceService.getDevices(null, 0, 20)).thenReturn(new DevicePageResponse(
                List.of(new DeviceSummaryResponse(
                        1L, "Samsung", "Galaxy A03", null, UnlockToolSupportStatus.UNKNOWN)),
                0, 20, 1, 1, false));

        mockMvc.perform(get("/api/v1/devices"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        {
                          "items": [{
                            "id": 1,
                            "brand": "Samsung",
                            "commercialName": "Galaxy A03",
                            "imageUri": null,
                            "unlockToolStatus": "UNKNOWN"
                          }],
                          "page": 0,
                          "size": 20,
                          "totalElements": 1,
                          "totalPages": 1,
                          "hasNext": false
                        }
                        """, true));
    }

    @Test
    void passesSearchQueryAndPaginationToService() throws Exception {
        when(deviceService.getDevices("a03", 1, 10)).thenReturn(new DevicePageResponse(
                List.of(), 1, 10, 0, 0, false));

        mockMvc.perform(get("/api/v1/devices").param("query", "a03").param("page", "1").param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(1))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.items.length()").value(0));
    }

    @Test
    void returnsDeviceDetailWithImageAndSupportStatus() throws Exception {
        when(deviceService.getDevice(1L)).thenReturn(new DeviceDetailResponse(
                1L, "Samsung", "Galaxy A03", null, UnlockToolSupportStatus.SUPPORTED));

        mockMvc.perform(get("/api/v1/devices/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.brand").value("Samsung"))
                .andExpect(jsonPath("$.commercialName").value("Galaxy A03"))
                .andExpect(jsonPath("$.imageUri").value(nullValue()))
                .andExpect(jsonPath("$.unlockToolStatus").value("SUPPORTED"));
    }

    @Test
    void returnsNotFoundWhenDeviceDoesNotExist() throws Exception {
        when(deviceService.getDevice(999L)).thenThrow(new DeviceNotFoundException(999L));

        mockMvc.perform(get("/api/v1/devices/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Device not found: 999"));
    }

    @Test
    void uploadsDeviceImageSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "galaxy-a03.png", "image/png",
                "dummy-image-bytes".getBytes(StandardCharsets.UTF_8));
        when(deviceService.uploadImage(eq(1L), any())).thenReturn(new DeviceDetailResponse(
                1L, "Samsung", "Galaxy A03", "/uploads/uuid.png", UnlockToolSupportStatus.SUPPORTED));

        mockMvc.perform(multipart("/api/v1/devices/1/image").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.brand").value("Samsung"))
                .andExpect(jsonPath("$.commercialName").value("Galaxy A03"))
                .andExpect(jsonPath("$.imageUri").value("/uploads/uuid.png"))
                .andExpect(jsonPath("$.unlockToolStatus").value("SUPPORTED"));
    }

    @Test
    void returnsNotFoundWhenUploadingImageForNonExistentDevice() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "phone.jpg", "image/jpeg",
                "bytes".getBytes(StandardCharsets.UTF_8));
        when(deviceService.uploadImage(eq(999L), any())).thenThrow(new DeviceNotFoundException(999L));

        mockMvc.perform(multipart("/api/v1/devices/999/image").file(file))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Device not found: 999"));
    }

    @Test
    void returnsBadRequestWhenImageIsInvalid() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "bad.txt", "text/plain",
                "bytes".getBytes(StandardCharsets.UTF_8));
        when(deviceService.uploadImage(eq(1L), any())).thenThrow(new InvalidImageException("Unsupported image type: text/plain"));

        mockMvc.perform(multipart("/api/v1/devices/1/image").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.detail").value("Unsupported image type: text/plain"));
    }
}
