package com.phoneTech.demo.devices.entity;
import jakarta.persistence.*;
@Entity @Table(name="diagnostic_fault_catalog")
public class DiagnosticFault {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="component_code",nullable=false) private String componentCode;
 @Column(name="component_name",nullable=false) private String componentName;
 @Column(name="fault_code",nullable=false) private String faultCode;
 @Column(name="fault_name",nullable=false) private String faultName;
 @Column(nullable=false,columnDefinition="TEXT") private String description;
 @Column(name="image_uri") private String imageUri;
 @Column(name="sort_order",nullable=false) private int sortOrder;
 @Column(name="is_active",nullable=false) private boolean active;
 protected DiagnosticFault() {}
 public Long getId(){return id;} public String getComponentCode(){return componentCode;}
 public String getComponentName(){return componentName;} public String getFaultCode(){return faultCode;}
 public String getFaultName(){return faultName;} public String getDescription(){return description;}
 public String getImageUri(){return imageUri;} public int getSortOrder(){return sortOrder;} public boolean isActive(){return active;}
}
