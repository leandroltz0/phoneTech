package com.phoneTech.demo.projects.entity;

import com.phoneTech.demo.projects.enums.ProjectStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_number", nullable = false)
    private Integer projectNumber;

    @Column(name = "phone_model", nullable = false)
    private String phoneModel;

    @Column
    private String variant;

    @Column(columnDefinition = "TEXT")
    private String diagnosis;

    @Column(name = "estimated_profit", precision = 19, scale = 2, nullable = false)
    private BigDecimal estimatedProfit;

    @Column(name = "actual_profit", precision = 19, scale = 2)
    private BigDecimal actualProfit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Project() {
    }

    public Long getId() {
        return id;
    }

    public Integer getProjectNumber() {
        return projectNumber;
    }

    public String getPhoneModel() {
        return phoneModel;
    }

    public String getVariant() {
        return variant;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public BigDecimal getEstimatedProfit() {
        return estimatedProfit;
    }

    public BigDecimal getActualProfit() {
        return actualProfit;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
