package com.phoneTech.demo.devices.service;

import com.phoneTech.demo.devices.dto.DeviceDetailResponse;
import com.phoneTech.demo.devices.dto.DevicePageResponse;
import com.phoneTech.demo.devices.dto.DeviceSummaryResponse;
import com.phoneTech.demo.devices.dto.DeviceVariantResponse;
import com.phoneTech.demo.devices.entity.PhoneModel;
import com.phoneTech.demo.devices.entity.PhoneModelVariant;
import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import com.phoneTech.demo.devices.exception.DeviceNotFoundException;
import com.phoneTech.demo.devices.repository.PhoneModelRepository;
import com.phoneTech.demo.devices.repository.PhoneModelRepository.DeviceSummaryRow;
import com.phoneTech.demo.devices.repository.PhoneModelVariantRepository;
import com.phoneTech.demo.projects.exception.InvalidImageException;
import com.phoneTech.demo.projects.storage.StorageService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeviceServiceTest {

    @Mock
    private PhoneModelRepository phoneModelRepository;

    @Mock
    private PhoneModelVariantRepository phoneModelVariantRepository;

    @Mock
    private StorageService storageService;

    private DeviceService service() {
        return new DeviceService(phoneModelRepository, phoneModelVariantRepository, storageService);
    }

    @Test
    void mapsSummaryRowsToSummaryResponses() {
        DeviceSummaryRow first = summaryRow(1L, "Samsung", "Galaxy A03", null, "UNKNOWN");
        DeviceSummaryRow second = summaryRow(2L, "Motorola", "Moto G60s", "/img/moto-g60s.png", "SUPPORTED");
        when(phoneModelRepository.countDeviceSummaries("")).thenReturn(2L);
        when(phoneModelRepository.findDeviceSummaries("", 20, 0)).thenReturn(List.of(first, second));

        DevicePageResponse page = service().getDevices(null, 0, 20);

        assertThat(page.items()).containsExactly(
                new DeviceSummaryResponse(1L, "Samsung", "Galaxy A03", null,
                        UnlockToolSupportStatus.UNKNOWN),
                new DeviceSummaryResponse(2L, "Motorola", "Moto G60s", "/img/moto-g60s.png",
                        UnlockToolSupportStatus.SUPPORTED));
        assertThat(page.totalElements()).isEqualTo(2);
        assertThat(page.totalPages()).isEqualTo(1);
        assertThat(page.hasNext()).isFalse();
    }

    @Test
    void returnsEmptyPageWhenThereAreNoDevices() {
        when(phoneModelRepository.countDeviceSummaries("")).thenReturn(0L);
        when(phoneModelRepository.findDeviceSummaries("", 20, 0)).thenReturn(List.of());

        DevicePageResponse page = service().getDevices("", 0, 20);

        assertThat(page.items()).isEmpty();
        assertThat(page.totalElements()).isZero();
        assertThat(page.hasNext()).isFalse();
    }

    @Test
    void paginatesAndClampsParameters() {
        when(phoneModelRepository.countDeviceSummaries("a03")).thenReturn(45L);
        when(phoneModelRepository.findDeviceSummaries("a03", 100, 0)).thenReturn(List.of());

        DevicePageResponse page = service().getDevices(" a03 ", -5, 999);

        assertThat(page.page()).isZero();
        assertThat(page.size()).isEqualTo(100);
        assertThat(page.totalElements()).isEqualTo(45);
        assertThat(page.totalPages()).isEqualTo(1);
        assertThat(page.hasNext()).isFalse();
        verify(phoneModelRepository).findDeviceSummaries("a03", 100, 0);
    }

    @Test
    void reportsNextPageWhenMoreElementsRemain() {
        when(phoneModelRepository.countDeviceSummaries("")).thenReturn(45L);
        when(phoneModelRepository.findDeviceSummaries("", 20, 0)).thenReturn(List.of());

        DevicePageResponse page = service().getDevices(null, 0, 20);

        assertThat(page.totalPages()).isEqualTo(3);
        assertThat(page.hasNext()).isTrue();
    }

    @Test
    void mapsDeviceDetailWithSupportStatus() {
        PhoneModel model = mock(PhoneModel.class);
        when(model.getId()).thenReturn(1L);
        when(model.getBrand()).thenReturn("Samsung");
        when(model.getCommercialName()).thenReturn("Galaxy A03");
        when(model.getImageUri()).thenReturn(null);
        when(model.getUnlocktoolStatus()).thenReturn(UnlockToolSupportStatus.UNKNOWN);
        when(model.isActive()).thenReturn(true);
        when(phoneModelRepository.findById(1L)).thenReturn(Optional.of(model));

        DeviceDetailResponse detail = service().getDevice(1L);

        assertThat(detail.id()).isEqualTo(1L);
        assertThat(detail.brand()).isEqualTo("Samsung");
        assertThat(detail.commercialName()).isEqualTo("Galaxy A03");
        assertThat(detail.imageUri()).isNull();
        assertThat(detail.unlockToolStatus()).isEqualTo(UnlockToolSupportStatus.UNKNOWN);
    }

    @Test
    void throwsNotFoundWhenDeviceDoesNotExist() {
        when(phoneModelRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().getDevice(999L))
                .isInstanceOf(DeviceNotFoundException.class)
                .hasMessage("Device not found: 999");
    }

    @Test
    void throwsNotFoundWhenDeviceIsInactive() {
        PhoneModel model = mock(PhoneModel.class);
        when(model.isActive()).thenReturn(false);
        when(phoneModelRepository.findById(7L)).thenReturn(Optional.of(model));

        assertThatThrownBy(() -> service().getDevice(7L))
                .isInstanceOf(DeviceNotFoundException.class)
                .hasMessage("Device not found: 7");
    }

    @Test
    void returnsVariantsOrderedByCommonFirst() {
        PhoneModel model = mock(PhoneModel.class);
        when(model.isActive()).thenReturn(true);
        when(phoneModelRepository.findById(1L)).thenReturn(Optional.of(model));

        PhoneModelVariant common = mock(PhoneModelVariant.class);
        when(common.getId()).thenReturn(10L);
        when(common.getCode()).thenReturn("SM-A035M");
        when(common.getRam()).thenReturn("4 GB");
        when(common.getStorage()).thenReturn("64 GB");
        when(common.getResalePrice()).thenReturn(new BigDecimal("150000.00"));
        when(common.isCommon()).thenReturn(true);

        PhoneModelVariant other = mock(PhoneModelVariant.class);
        when(other.getId()).thenReturn(11L);
        when(other.getCode()).thenReturn("SM-A035F");
        when(other.getRam()).thenReturn("3 GB");
        when(other.getStorage()).thenReturn("32 GB");
        when(other.getResalePrice()).thenReturn(new BigDecimal("135000.00"));
        when(other.isCommon()).thenReturn(false);

        when(phoneModelVariantRepository.findByPhoneModelIdAndIsActiveTrueOrderByIsCommonDescCodeAsc(1L))
                .thenReturn(List.of(common, other));

        List<DeviceVariantResponse> variants = service().getDeviceVariants(1L);

        assertThat(variants).containsExactly(
                new DeviceVariantResponse(10L, "SM-A035M", "4 GB", "64 GB",
                        new BigDecimal("150000.00"), true),
                new DeviceVariantResponse(11L, "SM-A035F", "3 GB", "32 GB",
                        new BigDecimal("135000.00"), false));
    }

    @Test
    void returnsEmptyVariantsWhenModelHasNone() {
        PhoneModel model = mock(PhoneModel.class);
        when(model.isActive()).thenReturn(true);
        when(phoneModelRepository.findById(2L)).thenReturn(Optional.of(model));
        when(phoneModelVariantRepository.findByPhoneModelIdAndIsActiveTrueOrderByIsCommonDescCodeAsc(2L))
                .thenReturn(List.of());

        assertThat(service().getDeviceVariants(2L)).isEmpty();
    }

    @Test
    void throwsNotFoundWhenFetchingVariantsForMissingDevice() {
        when(phoneModelRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service().getDeviceVariants(999L))
                .isInstanceOf(DeviceNotFoundException.class)
                .hasMessage("Device not found: 999");
    }

    @Test
    void throwsNotFoundWhenFetchingVariantsForInactiveDevice() {
        PhoneModel model = mock(PhoneModel.class);
        when(model.isActive()).thenReturn(false);
        when(phoneModelRepository.findById(7L)).thenReturn(Optional.of(model));

        assertThatThrownBy(() -> service().getDeviceVariants(7L))
                .isInstanceOf(DeviceNotFoundException.class)
                .hasMessage("Device not found: 7");
    }

    @Test
    void uploadsImageAndUpdatesDeviceModel() {
        PhoneModel model = new PhoneModel(1L, "Samsung", "Galaxy A03", null,
                UnlockToolSupportStatus.SUPPORTED, true, Instant.now(), Instant.now());
        when(phoneModelRepository.findById(1L)).thenReturn(Optional.of(model));
        when(storageService.store(any(), eq("png"))).thenReturn("stored-uuid.png");

        MockMultipartFile file = new MockMultipartFile("file", "image.png", "image/png",
                "bytes".getBytes(StandardCharsets.UTF_8));

        DeviceDetailResponse response = service().uploadImage(1L, file);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.imageUri()).isEqualTo("/uploads/stored-uuid.png");
        verify(phoneModelRepository).save(model);
        verify(storageService, never()).delete(any());
    }

    @Test
    void deletesOldImageWhenOverwritingExistingUpload() {
        PhoneModel model = new PhoneModel(1L, "Samsung", "Galaxy A03", "/uploads/old-file.png",
                UnlockToolSupportStatus.SUPPORTED, true, Instant.now(), Instant.now());
        when(phoneModelRepository.findById(1L)).thenReturn(Optional.of(model));
        when(storageService.store(any(), eq("jpg"))).thenReturn("new-file.jpg");

        MockMultipartFile file = new MockMultipartFile("file", "new.jpg", "image/jpeg",
                "bytes".getBytes(StandardCharsets.UTF_8));

        DeviceDetailResponse response = service().uploadImage(1L, file);

        assertThat(response.imageUri()).isEqualTo("/uploads/new-file.jpg");
        verify(storageService).delete("old-file.png");
        verify(phoneModelRepository).save(model);
    }

    @Test
    void uploadImageThrowsNotFoundWhenDeviceMissingOrInactive() {
        when(phoneModelRepository.findById(999L)).thenReturn(Optional.empty());
        MockMultipartFile file = new MockMultipartFile("file", "image.png", "image/png",
                "bytes".getBytes(StandardCharsets.UTF_8));

        assertThatThrownBy(() -> service().uploadImage(999L, file))
                .isInstanceOf(DeviceNotFoundException.class)
                .hasMessage("Device not found: 999");
    }

    @Test
    void uploadImageThrowsInvalidImageWhenFileEmptyOrInvalidType() {
        PhoneModel model = new PhoneModel(1L, "Samsung", "Galaxy A03", null,
                UnlockToolSupportStatus.SUPPORTED, true, Instant.now(), Instant.now());
        when(phoneModelRepository.findById(1L)).thenReturn(Optional.of(model));

        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.png", "image/png", new byte[0]);
        assertThatThrownBy(() -> service().uploadImage(1L, emptyFile))
                .isInstanceOf(InvalidImageException.class)
                .hasMessage("The image file is empty");

        MockMultipartFile invalidTypeFile = new MockMultipartFile("file", "text.txt", "text/plain",
                "bytes".getBytes(StandardCharsets.UTF_8));
        assertThatThrownBy(() -> service().uploadImage(1L, invalidTypeFile))
                .isInstanceOf(InvalidImageException.class)
                .hasMessage("Unsupported image type: text/plain");
    }

    @Test
    void cleansUpStoredFileWhenDatabaseSaveFails() {
        PhoneModel model = new PhoneModel(1L, "Samsung", "Galaxy A03", null,
                UnlockToolSupportStatus.SUPPORTED, true, Instant.now(), Instant.now());
        when(phoneModelRepository.findById(1L)).thenReturn(Optional.of(model));
        when(storageService.store(any(), eq("png"))).thenReturn("temp-file.png");
        doThrow(new RuntimeException("DB error")).when(phoneModelRepository).save(model);

        MockMultipartFile file = new MockMultipartFile("file", "img.png", "image/png",
                "bytes".getBytes(StandardCharsets.UTF_8));

        assertThatThrownBy(() -> service().uploadImage(1L, file))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("DB error");

        verify(storageService).delete("temp-file.png");
    }

    private DeviceSummaryRow summaryRow(Long id, String brand, String commercialName,
                                        String imageUri, String unlockToolStatus) {
        DeviceSummaryRow row = mock(DeviceSummaryRow.class);
        when(row.getId()).thenReturn(id);
        when(row.getBrand()).thenReturn(brand);
        when(row.getCommercialName()).thenReturn(commercialName);
        when(row.getImageUri()).thenReturn(imageUri);
        when(row.getUnlockToolStatus()).thenReturn(unlockToolStatus);
        return row;
    }
}
