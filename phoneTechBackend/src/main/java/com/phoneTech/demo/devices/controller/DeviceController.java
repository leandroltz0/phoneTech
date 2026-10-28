package com.phoneTech.demo.devices.controller;

import com.phoneTech.demo.devices.dto.DeviceDetailResponse;
import com.phoneTech.demo.devices.dto.DevicePageResponse;
import com.phoneTech.demo.devices.service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
