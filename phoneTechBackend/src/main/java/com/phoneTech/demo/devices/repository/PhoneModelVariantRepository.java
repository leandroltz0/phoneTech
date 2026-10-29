package com.phoneTech.demo.devices.repository;

import com.phoneTech.demo.devices.entity.PhoneModelVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhoneModelVariantRepository extends JpaRepository<PhoneModelVariant, Long> {

    List<PhoneModelVariant> findByPhoneModelIdAndIsActiveTrueOrderByIsCommonDescCodeAsc(Long phoneModelId);
}
