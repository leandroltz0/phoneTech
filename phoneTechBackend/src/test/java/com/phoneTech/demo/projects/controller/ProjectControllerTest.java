package com.phoneTech.demo.projects.controller;

import com.phoneTech.demo.projects.dto.ProjectResponse;
import com.phoneTech.demo.projects.enums.ProjectStatus;
import com.phoneTech.demo.projects.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ProjectControllerTest {

    @Mock
    private ProjectService projectService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(new ProjectController(projectService)).build();
    }

    @Test
    void returnsProjectsAsJson() throws Exception {
        when(projectService.getAllProjects()).thenReturn(List.of(
                new ProjectResponse(
                        1L,
                        1,
                        "Samsung Galaxy A03",
                        "SM-A035M",
                        "Módulo roto, tapa dañada",
                        new BigDecimal("25000.00"),
                        null,
                        ProjectStatus.PENDING,
                        LocalDateTime.parse("2026-10-19T10:30:00")
                )
        ));

        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(content().json("""
                        [{
                          "id": 1,
                          "projectNumber": 1,
                          "phoneModel": "Samsung Galaxy A03",
                          "variant": "SM-A035M",
                          "diagnosis": "Módulo roto, tapa dañada",
                          "estimatedProfit": 25000.00,
                          "actualProfit": null,
                          "status": "PENDING",
                          "createdAt": "2026-10-19T10:30:00"
                        }]
                        """));
    }

    @Test
    void returnsEmptyArrayWhenThereAreNoProjects() throws Exception {
        when(projectService.getAllProjects()).thenReturn(List.of());

        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }
}
