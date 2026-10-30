package com.phoneTech.demo.devices.entity;
import com.phoneTech.demo.devices.enums.UnlockToolSupportStatus;
import jakarta.persistence.*;
@Entity @Table(name="phone_variants")
public class PhoneVariant {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="phone_model_id",nullable=false) private Long phoneModelId;
 @Column(name="model_code",nullable=false) private String modelCode;
 @Column(name="variant_name") private String variantName;
 @Column(name="ram_gb") private Short ramGb; @Column(name="storage_gb") private Short storageGb;
 private String chipset; private String region;
 @Enumerated(EnumType.STRING) @Column(name="unlocktool_status",nullable=false) private UnlockToolSupportStatus unlockToolStatus;
 @Column(name="is_active",nullable=false) private boolean active; @Column(name="image_uri") private String imageUri;
 protected PhoneVariant() {}
 public Long getId(){return id;} public Long getPhoneModelId(){return phoneModelId;} public String getModelCode(){return modelCode;}
 public String getVariantName(){return variantName;} public Short getRamGb(){return ramGb;} public Short getStorageGb(){return storageGb;}
 public String getChipset(){return chipset;} public String getRegion(){return region;} public UnlockToolSupportStatus getUnlockToolStatus(){return unlockToolStatus;}
 public boolean isActive(){return active;} public String getImageUri(){return imageUri;}
}
