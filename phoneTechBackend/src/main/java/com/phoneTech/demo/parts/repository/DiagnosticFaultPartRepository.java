package com.phoneTech.demo.parts.repository;

import com.phoneTech.demo.parts.entity.DiagnosticFaultPart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface DiagnosticFaultPartRepository extends JpaRepository<DiagnosticFaultPart, Long> {

    @EntityGraph(attributePaths = {"fault", "sparePart"})
    @Query("select r from DiagnosticFaultPart r where r.fault.id = :faultId "
            + "and r.sparePart.active = true order by r.id asc")
    List<DiagnosticFaultPart> findByFaultId(@Param("faultId") Long faultId);

    @EntityGraph(attributePaths = {"fault", "sparePart"})
    @Query("select r from DiagnosticFaultPart r where r.fault.id in :faultIds "
            + "and r.sparePart.active = true "
            + "and (r.phoneVariantId is null or r.phoneVariantId = :phoneVariantId) "
            + "order by r.fault.id asc, r.sparePart.id asc, r.id asc")
    List<DiagnosticFaultPart> findByFaultIdsAndVariantId(@Param("faultIds") Collection<Long> faultIds,
                                                         @Param("phoneVariantId") Long phoneVariantId);
}
