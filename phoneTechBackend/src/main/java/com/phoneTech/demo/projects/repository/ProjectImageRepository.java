package com.phoneTech.demo.projects.repository;

import com.phoneTech.demo.projects.entity.ProjectImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {

    List<ProjectImage> findByProjectIdOrderBySortOrderAscCreatedAtAsc(Long projectId);

    @Query("select coalesce(max(i.sortOrder), 0) + 1 from ProjectImage i where i.projectId = :projectId")
    int nextSortOrder(@Param("projectId") Long projectId);
}
