package com.phoneTech.demo.devices.repository;
import com.phoneTech.demo.devices.entity.PhoneVariant; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface PhoneVariantRepository extends JpaRepository<PhoneVariant,Long>{
 List<PhoneVariant> findByPhoneModelIdAndActiveTrueOrderByModelCodeAsc(Long id);
}
