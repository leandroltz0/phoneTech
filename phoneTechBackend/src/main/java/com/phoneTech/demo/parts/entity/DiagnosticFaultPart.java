package com.phoneTech.demo.parts.entity;

import com.phoneTech.demo.devices.entity.DiagnosticFault;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "diagnostic_fault_parts")
public class DiagnosticFaultPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fault_id", nullable = false)
    private DiagnosticFault fault;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "spare_part_id", nullable = false)
    private SparePart sparePart;

    @Column(name = "phone_variant_id")
    private Long phoneVariantId;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "is_required", nullable = false)
    private boolean required;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected DiagnosticFaultPart() {
    }

    public DiagnosticFaultPart(DiagnosticFault fault, SparePart sparePart, int quantity,
                               boolean required, String notes) {
        this(fault, sparePart, null, quantity, required, notes);
    }

    public DiagnosticFaultPart(DiagnosticFault fault, SparePart sparePart, Long phoneVariantId,
                               int quantity, boolean required, String notes) {
        this.fault = fault;
        this.sparePart = sparePart;
        this.phoneVariantId = phoneVariantId;
        this.quantity = quantity;
        this.required = required;
        this.notes = notes;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public DiagnosticFault getFault() { return fault; }
    public SparePart getSparePart() { return sparePart; }
    public Long getPhoneVariantId() { return phoneVariantId; }
    public int getQuantity() { return quantity; }
    public boolean isRequired() { return required; }
    public String getNotes() { return notes; }
    public Instant getCreatedAt() { return createdAt; }
}
