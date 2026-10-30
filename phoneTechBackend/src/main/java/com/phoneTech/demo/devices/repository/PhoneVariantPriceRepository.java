package com.phoneTech.demo.devices.repository;
import com.phoneTech.demo.devices.entity.PhoneVariantPrice; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface PhoneVariantPriceRepository extends JpaRepository<PhoneVariantPrice,Long>{
 List<PhoneVariantPrice> findByPhoneVariantIdOrderByConditionCodeAsc(Long id);
 List<PhoneVariantPrice> findByPhoneVariantIdAndConditionCode(Long id, String conditionCode);
}
