package com.phoneTech.demo.projects.repository;

import com.phoneTech.demo.projects.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
