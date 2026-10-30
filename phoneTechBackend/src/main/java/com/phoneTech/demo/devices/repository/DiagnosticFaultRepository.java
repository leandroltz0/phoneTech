package com.phoneTech.demo.devices.repository;
import com.phoneTech.demo.devices.entity.DiagnosticFault; import org.springframework.data.jpa.repository.JpaRepository; import java.util.List;
public interface DiagnosticFaultRepository extends JpaRepository<DiagnosticFault,Long>{
 List<DiagnosticFault> findByActiveTrueOrderByComponentCodeAscSortOrderAscFaultCodeAsc();
}
