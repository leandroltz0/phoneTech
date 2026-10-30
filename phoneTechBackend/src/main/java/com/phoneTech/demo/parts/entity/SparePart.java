package com.phoneTech.demo.parts.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "spare_parts")
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "part_code", length = 100, unique = true)
    private String partCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "component_code", length = 50)
    private String componentCode;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SparePart() {
    }

    public SparePart(String partCode, String name, String componentCode, String description) {
        this.partCode = partCode;
        this.name = name;
        this.componentCode = componentCode;
        this.description = description;
        this.active = true;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void update(String partCode, String name, String componentCode, String description) {
        this.partCode = partCode;
        this.name = name;
        this.componentCode = componentCode;
        this.description = description;
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getPartCode() { return partCode; }
    public String getName() { return name; }
    public String getComponentCode() { return componentCode; }
    public String getDescription() { return description; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
