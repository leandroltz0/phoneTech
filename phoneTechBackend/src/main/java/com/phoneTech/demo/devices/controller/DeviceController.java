package com.phoneTech.demo.devices.controller;

import com.phoneTech.demo.devices.dto.DeviceDetailResponse;
import com.phoneTech.demo.devices.dto.DevicePageResponse;
import com.phoneTech.demo.devices.dto.DeviceVariantResponse;
import com.phoneTech.demo.devices.dto.DeviceSelectionDataResponse;
import com.phoneTech.demo.devices.dto.UnlockToolSupportResponse;
import com.phoneTech.demo.devices.service.DeviceService;
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
@RequestMapping("/api/v1/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<DevicePageResponse> getDevices(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(deviceService.getDevices(query, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDetailResponse> getDeviceById(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDevice(id));
    }

    @GetMapping("/{id}/variants")
    public ResponseEntity<List<DeviceVariantResponse>> getDeviceVariants(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceVariants(id));
    }

    @GetMapping("/{id}/selection-data")
    public ResponseEntity<DeviceSelectionDataResponse> getSelectionData(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getSelectionData(id));
    }

    @GetMapping("/{id}/unlock-tool-support")
    public ResponseEntity<UnlockToolSupportResponse> getUnlockToolSupport(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getUnlockToolSupport(id));
    }

    @PostMapping(value = "/{id}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DeviceDetailResponse> uploadImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(deviceService.uploadImage(id, file));
    }
}
