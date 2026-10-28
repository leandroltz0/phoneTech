package com.phoneTech.demo.devices.entity;

import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "phone_models")
public class PhoneModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String brand;

    @Column(name = "commercial_name", nullable = false, length = 150)
    private String commercialName;

    @Column(name = "image_uri")
    private String imageUri;

    @Enumerated(EnumType.STRING)
    @Column(name = "unlocktool_status", nullable = false, length = 20)
    private UnlockToolSupportStatus unlocktoolStatus;

    @Column(name = "is_active", nullable = false)
    private boolean isActive;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected PhoneModel() {
    }

    public Long getId() {
        return id;
    }

    public String getBrand() {
        return brand;
    }

    public String getCommercialName() {
        return commercialName;
    }

    public String getImageUri() {
        return imageUri;
    }

    public UnlockToolSupportStatus getUnlocktoolStatus() {
        return unlocktoolStatus;
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
