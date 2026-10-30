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
import jakarta.persistence.Transient;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_number", nullable = false)
    private Long projectNumber;

    @Column(name = "phone_model", nullable = false)
    private String phoneModel;

    @Transient
    private String variant;

    @Transient
    private String diagnosis;

    @Column(name = "estimated_profit", precision = 14, scale = 2)
    private BigDecimal estimatedProfit;

    @Transient
    private BigDecimal actualProfit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Project() {
    }

    public Long getId() {
        return id;
    }

    public Long getProjectNumber() {
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

    public Instant getCreatedAt() {
        return createdAt;
    }
}
