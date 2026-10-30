package com.phoneTech.demo.parts.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "contact_name", length = 150)
    private String contactName;

    @Column(length = 50)
    private String phone;

    @Column(length = 50)
    private String whatsapp;

    @Column(length = 150)
    private String email;

    @Column(length = 250)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Supplier() {
    }

    public Supplier(String name, String contactName, String phone, String whatsapp,
                    String email, String address, String city, String notes) {
        this.name = name;
        this.contactName = contactName;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.email = email;
        this.address = address;
        this.city = city;
        this.notes = notes;
        this.active = true;
        this.createdAt = Instant.now();
        this.updatedAt = this.createdAt;
    }

    public void update(String name, String contactName, String phone, String whatsapp,
                       String email, String address, String city, String notes) {
        this.name = name;
        this.contactName = contactName;
        this.phone = phone;
        this.whatsapp = whatsapp;
        this.email = email;
        this.address = address;
        this.city = city;
        this.notes = notes;
        this.updatedAt = Instant.now();
    }

    public void updateStatus(boolean active) {
        this.active = active;
        this.updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getContactName() { return contactName; }
    public String getPhone() { return phone; }
    public String getWhatsapp() { return whatsapp; }
    public String getEmail() { return email; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getNotes() { return notes; }
    public boolean isActive() { return active; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
