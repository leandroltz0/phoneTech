package com.phoneTech.demo.parts.repository;

import com.phoneTech.demo.parts.entity.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    List<SparePart> findByActiveTrueOrderByNameAsc();
}
