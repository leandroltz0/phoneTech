package com.phoneTech.demo.devices.service;

import com.phoneTech.demo.devices.dto.DeviceDetailResponse;
import com.phoneTech.demo.devices.dto.DevicePageResponse;
import com.phoneTech.demo.devices.dto.DeviceSummaryResponse;
import com.phoneTech.demo.devices.entity.PhoneModel;
import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import com.phoneTech.demo.devices.exception.DeviceNotFoundException;
import com.phoneTech.demo.devices.repository.PhoneModelRepository;
import com.phoneTech.demo.devices.repository.PhoneModelRepository.DeviceSummaryRow;
import com.phoneTech.demo.projects.exception.InvalidImageException;
import com.phoneTech.demo.projects.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class DeviceService {

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;

    private static final Map<String, String> EXTENSIONS_BY_CONTENT_TYPE = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp",
            "image/gif", "gif"
    );

    private final PhoneModelRepository phoneModelRepository;
    private final StorageService storageService;

    public DeviceService(PhoneModelRepository phoneModelRepository, StorageService storageService) {
        this.phoneModelRepository = phoneModelRepository;
        this.storageService = storageService;
    }

    @Transactional(readOnly = true)
    public DevicePageResponse getDevices(String query, int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = size <= 0 ? DEFAULT_PAGE_SIZE : Math.min(size, MAX_PAGE_SIZE);
        String safeQuery = query == null ? "" : query.trim();

        long totalElements = phoneModelRepository.countDeviceSummaries(safeQuery);
        int offset = (int) Math.min(Integer.MAX_VALUE, (long) safePage * safeSize);
        List<DeviceSummaryRow> rows = phoneModelRepository.findDeviceSummaries(
                safeQuery, safeSize, offset);

        List<DeviceSummaryResponse> items = rows.stream()
                .map(this::toSummary)
                .toList();

        int totalPages = (int) Math.ceil((double) totalElements / safeSize);
        boolean hasNext = safePage + 1 < totalPages;

        return new DevicePageResponse(items, safePage, safeSize, totalElements, totalPages, hasNext);
    }

    @Transactional(readOnly = true)
    public DeviceDetailResponse getDevice(Long id) {
        PhoneModel model = phoneModelRepository.findById(id)
                .filter(PhoneModel::isActive)
                .orElseThrow(() -> new DeviceNotFoundException(id));

        return toDetail(model);
    }

    @Transactional
    public DeviceDetailResponse uploadImage(Long id, MultipartFile file) {
        PhoneModel model = phoneModelRepository.findById(id)
                .filter(PhoneModel::isActive)
                .orElseThrow(() -> new DeviceNotFoundException(id));

        String extension = resolveExtension(file);
        String fileName = storageService.store(file, extension);
        String previousImageUri = model.getImageUri();

        try {
            model.updateImageUri("/uploads/" + fileName);
            phoneModelRepository.save(model);
        } catch (RuntimeException e) {
            storageService.delete(fileName);
            throw e;
        }

        if (previousImageUri != null && previousImageUri.startsWith("/uploads/")) {
            String oldFileName = previousImageUri.substring("/uploads/".length());
            storageService.delete(oldFileName);
        }

        return toDetail(model);
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

    private DeviceDetailResponse toDetail(PhoneModel model) {
        return new DeviceDetailResponse(
                model.getId(),
                model.getBrand(),
                model.getCommercialName(),
                model.getImageUri(),
                model.getUnlocktoolStatus()
        );
    }

    private DeviceSummaryResponse toSummary(DeviceSummaryRow row) {
        return new DeviceSummaryResponse(
                row.getId(),
                row.getBrand(),
                row.getCommercialName(),
                row.getImageUri(),
                toStatus(row.getUnlockToolStatus())
        );
    }

    private UnlockToolSupportStatus toStatus(String status) {
        return status == null ? UnlockToolSupportStatus.UNKNOWN : UnlockToolSupportStatus.valueOf(status);
    }
}
