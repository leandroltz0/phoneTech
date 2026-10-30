package com.phoneTech.demo.projects.repository;

import com.phoneTech.demo.projects.entity.ProjectSparePart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectSparePartRepository extends JpaRepository<ProjectSparePart, Long> {

    @EntityGraph(attributePaths = {"sparePart", "supplier", "supplierSparePart"})
    List<ProjectSparePart> findByProjectIdOrderByCreatedAtAsc(Long projectId);
}
