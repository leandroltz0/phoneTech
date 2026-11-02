package com.phoneTech.demo.projects.service;

import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import com.phoneTech.demo.projects.dto.ProjectDetailResponse;
import com.phoneTech.demo.projects.dto.ProjectDetailsResponse;
import com.phoneTech.demo.projects.dto.ProjectSummaryResponse;
import com.phoneTech.demo.projects.enums.ProjectStatus;
import com.phoneTech.demo.projects.exception.ProjectNotFoundException;
import com.phoneTech.demo.projects.repository.ProjectRepository;
import com.phoneTech.demo.projects.repository.ProjectRepository.ProjectDetailRow;
import com.phoneTech.demo.projects.repository.ProjectRepository.ProjectDetailsRow;
import com.phoneTech.demo.projects.repository.ProjectRepository.ProjectSummaryRow;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    private static final Instant CREATION_DATE = Instant.parse("2026-10-19T13:30:00Z");

    @Mock
    private ProjectRepository projectRepository;

    @Test
    void mapsSummaryRowsToSummaryResponses() {
        ProjectSummaryRow firstRow = mock(ProjectSummaryRow.class);
        when(firstRow.getId()).thenReturn(1L);
        when(firstRow.getProjectNumber()).thenReturn(1L);
        when(firstRow.getPhoneModel()).thenReturn("Samsung Galaxy A03");
        when(firstRow.getEstimatedProfit()).thenReturn(new BigDecimal("25000.00"));
        when(firstRow.getDiagnosis()).thenReturn("Módulo: Módulo roto");
        when(firstRow.getImageUrl()).thenReturn("/uploads/a03.jpg");
        when(firstRow.getStatus()).thenReturn(ProjectStatus.PENDING.name());

        ProjectSummaryRow secondRow = mock(ProjectSummaryRow.class);
        when(secondRow.getId()).thenReturn(2L);
        when(secondRow.getProjectNumber()).thenReturn(2L);
        when(secondRow.getPhoneModel()).thenReturn("Motorola Moto E13");
        when(secondRow.getEstimatedProfit()).thenReturn(new BigDecimal("18000.00"));
        when(secondRow.getDiagnosis()).thenReturn("");
        when(secondRow.getStatus()).thenReturn(ProjectStatus.SOLD.name());

        when(projectRepository.findProjectSummaries()).thenReturn(List.of(firstRow, secondRow));

        List<ProjectSummaryResponse> response = new ProjectService(projectRepository).getAllProjects();

        assertThat(response).hasSize(2);
        assertThat(response.get(0)).isEqualTo(new ProjectSummaryResponse(
                1L, 1L, "Samsung Galaxy A03", new BigDecimal("25000.00"),
                "Módulo: Módulo roto", "/uploads/a03.jpg", ProjectStatus.PENDING));
        assertThat(response.get(1)).isEqualTo(new ProjectSummaryResponse(
                2L, 2L, "Motorola Moto E13", new BigDecimal("18000.00"),
                "", null, ProjectStatus.SOLD));
    }

    @Test
    void groupsFaultRowsIntoSingleDetailResponse() {
        ProjectDetailRow firstFault = mock(ProjectDetailRow.class);
        stubProjectFields(firstFault, 1L, "Samsung Galaxy A03",
                new BigDecimal("25000.00"), ProjectStatus.IN_REPAIR);
        stubFaultFields(firstFault, 10L, "Módulo", "Módulo roto");

        ProjectDetailRow secondFault = mock(ProjectDetailRow.class);
        stubFaultFields(secondFault, 11L, "Tapa", "Tapa dañada");

        when(projectRepository.findProjectDetail(1L)).thenReturn(List.of(firstFault, secondFault));

        ProjectDetailResponse response = new ProjectService(projectRepository).getProjectById(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.projectNumber()).isEqualTo(1L);
        assertThat(response.phoneModel()).isEqualTo("Samsung Galaxy A03");
        assertThat(response.estimatedProfit()).isEqualByComparingTo("25000.00");
        assertThat(response.status()).isEqualTo(ProjectStatus.IN_REPAIR);
        assertThat(response.createdAt()).isEqualTo(CREATION_DATE);
        assertThat(response.diagnosis()).hasSize(2);
        assertThat(response.diagnosis().get(0).componentName()).isEqualTo("Módulo");
        assertThat(response.diagnosis().get(0).faultName()).isEqualTo("Módulo roto");
        assertThat(response.diagnosis().get(0).confirmed()).isTrue();
        assertThat(response.diagnosis().get(0).notes()).isEqualTo("Observación");
        assertThat(response.diagnosis().get(1).componentName()).isEqualTo("Tapa");
        assertThat(response.diagnosis().get(1).faultName()).isEqualTo("Tapa dañada");
    }

    @Test
    void returnsEmptyDiagnosisWhenProjectHasNoFaults() {
        ProjectDetailRow row = mock(ProjectDetailRow.class);
        stubProjectFields(row, 3L, "Samsung Galaxy A10",
                new BigDecimal("9000.00"), ProjectStatus.READY_TO_SELL);
        when(row.getFaultId()).thenReturn(null);

        when(projectRepository.findProjectDetail(3L)).thenReturn(List.of(row));

        ProjectDetailResponse response = new ProjectService(projectRepository).getProjectById(3L);

        assertThat(response.diagnosis()).isEmpty();
        assertThat(response.status()).isEqualTo(ProjectStatus.READY_TO_SELL);
    }

    @Test
    void throwsNotFoundWhenProjectDoesNotExist() {
        when(projectRepository.findProjectDetail(999L)).thenReturn(List.of());

        assertThatThrownBy(() -> new ProjectService(projectRepository).getProjectById(999L))
                .isInstanceOf(ProjectNotFoundException.class)
                .hasMessage("Project not found: 999");
    }

    @Test
    void mapsProjectDetailsWithDevicePriceAndRepairCost() {
        ProjectDetailsRow row = mock(ProjectDetailsRow.class);
        when(row.getId()).thenReturn(3L);
        when(row.getProjectNumber()).thenReturn(3L);
        when(row.getPhoneModel()).thenReturn("Samsung Galaxy A03");
        when(row.getStatus()).thenReturn(ProjectStatus.PENDING.name());
        when(row.getCreatedAt()).thenReturn(CREATION_DATE);
        when(row.getUnlockToolStatus()).thenReturn("SUPPORTED");
        when(row.getModelCode()).thenReturn("A03-128GB");
        when(row.getVariantName()).thenReturn("Samsung Galaxy A03 4GB/128GB");
        when(row.getRamGb()).thenReturn((short) 4);
        when(row.getStorageGb()).thenReturn((short) 128);
        when(row.getChipset()).thenReturn("Unisoc T606");
        when(row.getRegion()).thenReturn("LATAM");
        when(row.getImageUrl()).thenReturn("/uploads/project-photo.jpg");
        when(row.getSalePrice()).thenReturn(new BigDecimal("150000.00"));
        when(row.getSaleCurrency()).thenReturn("ARS");
        when(row.getEstimatedProfit()).thenReturn(new BigDecimal("25000.00"));
        when(row.getRepairCost()).thenReturn(new BigDecimal("12000.00"));
        when(row.getRepairCurrency()).thenReturn("ARS");
        when(row.getFaultId()).thenReturn(9L);
        stubDetailsFaultFields(row);

        when(projectRepository.findProjectDetails(3L)).thenReturn(List.of(row));

        ProjectDetailsResponse response = new ProjectService(projectRepository).getProjectDetails(3L);

        assertThat(response.id()).isEqualTo(3L);
        assertThat(response.projectNumber()).isEqualTo(3L);
        assertThat(response.phoneModel()).isEqualTo("Samsung Galaxy A03");
        assertThat(response.status()).isEqualTo(ProjectStatus.PENDING);
        assertThat(response.createdAt()).isEqualTo(CREATION_DATE);
        assertThat(response.unlockToolStatus()).isEqualTo(UnlockToolSupportStatus.SUPPORTED);
        assertThat(response.modelCode()).isEqualTo("A03-128GB");
        assertThat(response.variantName()).isEqualTo("Samsung Galaxy A03 4GB/128GB");
        assertThat(response.ramGb()).isEqualTo((short) 4);
        assertThat(response.storageGb()).isEqualTo((short) 128);
        assertThat(response.chipset()).isEqualTo("Unisoc T606");
        assertThat(response.region()).isEqualTo("LATAM");
        assertThat(response.imageUrl()).isEqualTo("/uploads/project-photo.jpg");
        assertThat(response.salePrice()).isEqualByComparingTo("150000.00");
        assertThat(response.saleCurrency()).isEqualTo("ARS");
        assertThat(response.estimatedProfit()).isEqualByComparingTo("25000.00");
        assertThat(response.repairCost()).isEqualByComparingTo("12000.00");
        assertThat(response.repairCurrency()).isEqualTo("ARS");
        assertThat(response.diagnosis()).hasSize(1);
        assertThat(response.diagnosis().get(0).componentName()).isEqualTo("Módulo");
        assertThat(response.diagnosis().get(0).faultName()).isEqualTo("Módulo roto");
        assertThat(response.diagnosis().get(0).confirmed()).isTrue();
    }

    @Test
    void returnsNullSalePriceAndUnknownUnlockWhenProjectHasNoDeviceData() {
        ProjectDetailsRow row = mock(ProjectDetailsRow.class);
        when(row.getId()).thenReturn(3L);
        when(row.getProjectNumber()).thenReturn(3L);
        when(row.getPhoneModel()).thenReturn("Samsung Galaxy A03");
        when(row.getStatus()).thenReturn(ProjectStatus.PENDING.name());
        when(row.getCreatedAt()).thenReturn(CREATION_DATE);
        when(row.getUnlockToolStatus()).thenReturn(null);
        when(row.getEstimatedProfit()).thenReturn(new BigDecimal("25000.00"));
        when(row.getRepairCost()).thenReturn(BigDecimal.ZERO);
        when(row.getFaultId()).thenReturn(null);

        when(projectRepository.findProjectDetails(3L)).thenReturn(List.of(row));

        ProjectDetailsResponse response = new ProjectService(projectRepository).getProjectDetails(3L);

        assertThat(response.unlockToolStatus()).isEqualTo(UnlockToolSupportStatus.UNKNOWN);
        assertThat(response.salePrice()).isNull();
        assertThat(response.saleCurrency()).isNull();
        assertThat(response.imageUrl()).isNull();
        assertThat(response.repairCost()).isEqualByComparingTo("0");
        assertThat(response.diagnosis()).isEmpty();
    }

    @Test
    void throwsNotFoundWhenProjectDetailsDoNotExist() {
        when(projectRepository.findProjectDetails(999L)).thenReturn(List.of());

        assertThatThrownBy(() -> new ProjectService(projectRepository).getProjectDetails(999L))
                .isInstanceOf(ProjectNotFoundException.class)
                .hasMessage("Project not found: 999");
    }

    private void stubDetailsFaultFields(ProjectDetailsRow row) {
        when(row.getComponentCode()).thenReturn("MODULE");
        when(row.getComponentName()).thenReturn("Módulo");
        when(row.getFaultCode()).thenReturn("MODULE_BROKEN");
        when(row.getFaultName()).thenReturn("Módulo roto");
        when(row.getDescription()).thenReturn("La pantalla del celular está rota o dañada.");
        when(row.getImageUri()).thenReturn(null);
        when(row.getConfirmed()).thenReturn(true);
        when(row.getNotes()).thenReturn(null);
    }

    private void stubProjectFields(ProjectDetailRow row, Long projectNumber, String phoneModel,
                                   BigDecimal estimatedProfit, ProjectStatus status) {
        when(row.getId()).thenReturn(1L);
        when(row.getProjectNumber()).thenReturn(projectNumber);
        when(row.getPhoneModel()).thenReturn(phoneModel);
        when(row.getEstimatedProfit()).thenReturn(estimatedProfit);
        when(row.getStatus()).thenReturn(status.name());
        when(row.getCreatedAt()).thenReturn(CREATION_DATE);
    }

    private void stubFaultFields(ProjectDetailRow row, Long faultId, String componentName, String faultName) {
        when(row.getFaultId()).thenReturn(faultId);
        when(row.getComponentCode()).thenReturn("SCREEN");
        when(row.getComponentName()).thenReturn(componentName);
        when(row.getFaultCode()).thenReturn("BROKEN");
        when(row.getFaultName()).thenReturn(faultName);
        when(row.getDescription()).thenReturn("Falla detectada en el diagnóstico");
        when(row.getImageUri()).thenReturn("img/falla.png");
        when(row.getConfirmed()).thenReturn(true);
        when(row.getNotes()).thenReturn("Observación");
    }
}
