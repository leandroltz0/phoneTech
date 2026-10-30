package com.phoneTech.demo.projects.entity;

import com.phoneTech.demo.parts.entity.SparePart;
import com.phoneTech.demo.parts.entity.Supplier;
import com.phoneTech.demo.parts.entity.SupplierSparePart;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "project_spare_parts")
public class ProjectSparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "spare_part_id", nullable = false)
    private SparePart sparePart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_spare_part_id")
    private SupplierSparePart supplierSparePart;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_cost", nullable = false, precision = 14, scale = 2)
    private BigDecimal unitCost;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(name = "is_purchased", nullable = false)
    private boolean purchased;

    @Column(name = "purchased_at")
    private Instant purchasedAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected ProjectSparePart() {
    }

    public ProjectSparePart(Long projectId, SparePart sparePart, Supplier supplier,
                            SupplierSparePart supplierSparePart, int quantity,
                            BigDecimal unitCost, String currency, boolean purchased) {
        this.projectId = projectId;
        this.sparePart = sparePart;
        this.supplier = supplier;
        this.supplierSparePart = supplierSparePart;
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.currency = currency;
        this.purchased = purchased;
        this.purchasedAt = purchased ? Instant.now() : null;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void update(SparePart sparePart, Supplier supplier, SupplierSparePart supplierSparePart,
                       int quantity, BigDecimal unitCost, String currency, boolean purchased) {
        this.sparePart = sparePart;
        this.supplier = supplier;
        this.supplierSparePart = supplierSparePart;
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.currency = currency;
        if (purchased && !this.purchased) this.purchasedAt = Instant.now();
        if (!purchased) this.purchasedAt = null;
        this.purchased = purchased;
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public Long getProjectId() { return projectId; }
    public SparePart getSparePart() { return sparePart; }
    public Supplier getSupplier() { return supplier; }
    public SupplierSparePart getSupplierSparePart() { return supplierSparePart; }
    public int getQuantity() { return quantity; }
    public BigDecimal getUnitCost() { return unitCost; }
    public String getCurrency() { return currency; }
    public boolean isPurchased() { return purchased; }
    public Instant getPurchasedAt() { return purchasedAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
