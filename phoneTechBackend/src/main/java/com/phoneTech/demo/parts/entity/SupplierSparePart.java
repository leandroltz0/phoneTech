package com.phoneTech.demo.parts.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "supplier_spare_parts", uniqueConstraints = @UniqueConstraint(
        name = "uk_supplier_spare_part_currency",
        columnNames = {"supplier_id", "spare_part_id", "currency"}))
public class SupplierSparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "supplier_id", nullable = false)
    private Supplier supplier;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "spare_part_id", nullable = false)
    private SparePart sparePart;

    @Column(name = "supplier_sku", length = 100)
    private String supplierSku;

    @Column(name = "purchase_price", nullable = false, precision = 14, scale = 2)
    private BigDecimal purchasePrice;

    @Column(nullable = false, length = 3)
    private String currency;

    @Column(name = "is_available", nullable = false)
    private boolean available;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected SupplierSparePart() {
    }

    public SupplierSparePart(Supplier supplier, SparePart sparePart, String supplierSku,
                             BigDecimal purchasePrice, String currency, boolean available,
                             String notes) {
        this.supplier = supplier;
        this.sparePart = sparePart;
        this.supplierSku = supplierSku;
        this.purchasePrice = purchasePrice;
        this.currency = currency;
        this.available = available;
        this.notes = notes;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void update(String supplierSku, BigDecimal purchasePrice, String currency,
                       boolean available, String notes) {
        this.supplierSku = supplierSku;
        this.purchasePrice = purchasePrice;
        this.currency = currency;
        this.available = available;
        this.notes = notes;
        this.updatedAt = Instant.now();
    }

    public void updateAssociation(Supplier supplier, SparePart sparePart, String supplierSku,
                                  BigDecimal purchasePrice, String currency, boolean available,
                                  String notes) {
        this.supplier = supplier;
        this.sparePart = sparePart;
        update(supplierSku, purchasePrice, currency, available, notes);
    }

    public Long getId() { return id; }
    public Supplier getSupplier() { return supplier; }
    public SparePart getSparePart() { return sparePart; }
    public String getSupplierSku() { return supplierSku; }
    public BigDecimal getPurchasePrice() { return purchasePrice; }
    public String getCurrency() { return currency; }
    public boolean isAvailable() { return available; }
    public String getNotes() { return notes; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
