package com.phoneTech.demo.devices.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "phone_model_variants")
public class PhoneModelVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phone_model_id", nullable = false)
    private Long phoneModelId;

    @Column(nullable = false, length = 50)
    private String code;

    @Column(nullable = false, length = 20)
    private String ram;

    @Column(nullable = false, length = 20)
    private String storage;

    @Column(name = "resale_price", precision = 14, scale = 2)
    private BigDecimal resalePrice;

    @Column(name = "is_common", nullable = false)
    private boolean isCommon;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected PhoneModelVariant() {
    }

    public Long getId() {
        return id;
    }

    public Long getPhoneModelId() {
        return phoneModelId;
    }

    public String getCode() {
        return code;
    }

    public String getRam() {
        return ram;
    }

    public String getStorage() {
        return storage;
    }

    public BigDecimal getResalePrice() {
        return resalePrice;
    }

    public boolean isCommon() {
        return isCommon;
    }

    public boolean isActive() {
        return isActive;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
