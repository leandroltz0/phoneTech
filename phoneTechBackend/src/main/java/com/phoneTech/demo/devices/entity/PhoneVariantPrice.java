package com.phoneTech.demo.devices.entity;
import jakarta.persistence.*; import java.math.BigDecimal;
@Entity @Table(name="phone_variant_prices")
public class PhoneVariantPrice {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="phone_variant_id",nullable=false) private Long phoneVariantId;
 @Column(name="condition_code",nullable=false) private String conditionCode;
 @Column(name="reference_sale_price",nullable=false,precision=14,scale=2) private BigDecimal referenceSalePrice;
 @Column(nullable=false) private String currency;
 protected PhoneVariantPrice() {}
 public Long getId(){return id;} public Long getPhoneVariantId(){return phoneVariantId;} public String getConditionCode(){return conditionCode;}
 public BigDecimal getReferenceSalePrice(){return referenceSalePrice;} public String getCurrency(){return currency;}
}
