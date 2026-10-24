package com.phoneTech.demo.projects.controller;

import com.phoneTech.demo.projects.dto.ProjectDetailResponse;
import com.phoneTech.demo.projects.dto.ProjectFaultResponse;
import com.phoneTech.demo.projects.dto.ProjectSummaryResponse;
import com.phoneTech.demo.projects.enums.ProjectStatus;
import com.phoneTech.demo.projects.exception.ProjectNotFoundException;
import com.phoneTech.demo.projects.exception.RestExceptionHandler;
import com.phoneTech.demo.projects.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new ProjectController(projectService))
                .setControllerAdvice(new RestExceptionHandler())
                .build();
    }

    @Test
    void returnsProjectsWithSummaryFieldsOnly() throws Exception {
        when(projectService.getAllProjects()).thenReturn(List.of(
                new ProjectSummaryResponse(
                        1L,
                        1L,
                        "Samsung Galaxy A03",
                        new BigDecimal("25000.00"),
                        "Módulo: Módulo roto, Tapa: Tapa dañada",
                        ProjectStatus.PENDING
                )
        ));

        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        [{
                          "id": 1,
                          "projectNumber": 1,
                          "phoneModel": "Samsung Galaxy A03",
                          "estimatedProfit": 25000.00,
                          "diagnosis": "Módulo: Módulo roto, Tapa: Tapa dañada",
                          "status": "PENDING"
                        }]
                        """, true));
    }

    @Test
    void returnsEmptyArrayWhenThereAreNoProjects() throws Exception {
        when(projectService.getAllProjects()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void returnsProjectDetailWithDiagnosisCollection() throws Exception {
        when(projectService.getProjectById(1L)).thenReturn(new ProjectDetailResponse(
                1L,
                1L,
                "Samsung Galaxy A03",
                new BigDecimal("25000.00"),
                ProjectStatus.IN_REPAIR,
                Instant.parse("2026-10-19T13:30:00Z"),
                List.of(
                        new ProjectFaultResponse(
                                "SCREEN", "Módulo", "BROKEN", "Módulo roto",
                                "Pantalla rota", "img/modulo.png", true, "Confirmado"
                        ),
                        new ProjectFaultResponse(
                                "BACK_COVER", "Tapa", "DAMAGED", "Tapa dañada",
                                "Tapa trasera agrietada", null, false, null
                        )
                )
        ));

        mockMvc.perform(get("/api/v1/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.projectNumber").value(1))
                .andExpect(jsonPath("$.phoneModel").value("Samsung Galaxy A03"))
                .andExpect(jsonPath("$.estimatedProfit").value(25000.00))
                .andExpect(jsonPath("$.status").value("IN_REPAIR"))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.diagnosis.length()").value(2))
                .andExpect(jsonPath("$.diagnosis[0].componentCode").value("SCREEN"))
                .andExpect(jsonPath("$.diagnosis[0].componentName").value("Módulo"))
                .andExpect(jsonPath("$.diagnosis[0].faultCode").value("BROKEN"))
                .andExpect(jsonPath("$.diagnosis[0].faultName").value("Módulo roto"))
                .andExpect(jsonPath("$.diagnosis[0].description").value("Pantalla rota"))
                .andExpect(jsonPath("$.diagnosis[0].imageUri").value("img/modulo.png"))
                .andExpect(jsonPath("$.diagnosis[0].confirmed").value(true))
                .andExpect(jsonPath("$.diagnosis[0].notes").value("Confirmado"))
                .andExpect(jsonPath("$.diagnosis[1].imageUri").value(nullValue()))
                .andExpect(jsonPath("$.diagnosis[1].notes").value(nullValue()))
                .andExpect(jsonPath("$.diagnosis[1].confirmed").value(false));
    }

    @Test
    void returnsNotFoundWhenProjectDoesNotExist() throws Exception {
        when(projectService.getProjectById(999L)).thenThrow(new ProjectNotFoundException(999L));

        mockMvc.perform(get("/api/v1/projects/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.detail").value("Project not found: 999"));
    }
}
