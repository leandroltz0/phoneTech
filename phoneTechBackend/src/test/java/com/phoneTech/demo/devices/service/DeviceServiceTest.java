package com.phoneTech.demo.devices.service;

import com.phoneTech.demo.devices.dto.DeviceDetailResponse;
import com.phoneTech.demo.devices.dto.DevicePageResponse;
import com.phoneTech.demo.devices.dto.DeviceSummaryResponse;
import com.phoneTech.demo.devices.entity.PhoneModel;
import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import com.phoneTech.demo.devices.exception.DeviceNotFoundException;
import com.phoneTech.demo.devices.repository.PhoneModelRepository;
import com.phoneTech.demo.devices.repository.PhoneModelRepository.DeviceSummaryRow;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DeviceServiceTest {

    @Mock
    private PhoneModelRepository phoneModelRepository;

    private DeviceService service() {
        return new DeviceService(phoneModelRepository);
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
