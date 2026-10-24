package com.phoneTech.demo.projects.repository;

import com.phoneTech.demo.projects.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query(value = """
            SELECT
                p.id AS "id",
                p.project_number AS "projectNumber",
                p.phone_model AS "phoneModel",
                p.estimated_profit AS "estimatedProfit",
                p.status AS "status",
                COALESCE(
                    STRING_AGG(
                        DISTINCT (df.component_name || ': ' || df.fault_name),
                        ', '
                        ORDER BY (df.component_name || ': ' || df.fault_name)
                    ),
                    ''
                ) AS "diagnosis"
            FROM projects p
            LEFT JOIN project_faults pf ON pf.project_id = p.id
            LEFT JOIN diagnostic_fault_catalog df ON df.id = pf.fault_id
            GROUP BY
                p.id,
                p.project_number,
                p.phone_model,
                p.estimated_profit,
                p.status,
                p.created_at
            ORDER BY p.created_at DESC, p.project_number DESC
            """, nativeQuery = true)
    List<ProjectSummaryRow> findProjectSummaries();

    @Query(value = """
            SELECT
                p.id AS "id",
                p.project_number AS "projectNumber",
                p.phone_model AS "phoneModel",
                p.estimated_profit AS "estimatedProfit",
                p.status AS "status",
                p.created_at AS "createdAt",
                pf.id AS "faultId",
                df.component_code AS "componentCode",
                df.component_name AS "componentName",
                df.fault_code AS "faultCode",
                df.fault_name AS "faultName",
                df.description AS "description",
                df.image_uri AS "imageUri",
                pf.confirmed AS "confirmed",
                pf.notes AS "notes"
            FROM projects p
            LEFT JOIN project_faults pf ON pf.project_id = p.id
            LEFT JOIN diagnostic_fault_catalog df ON df.id = pf.fault_id
            WHERE p.id = :id
            ORDER BY df.sort_order, df.component_name, df.fault_name
            """, nativeQuery = true)
    List<ProjectDetailRow> findProjectDetail(@Param("id") Long id);

    interface ProjectSummaryRow {

        Long getId();

        Long getProjectNumber();

        String getPhoneModel();

        BigDecimal getEstimatedProfit();

        String getStatus();

        String getDiagnosis();
    }

    interface ProjectDetailRow {

        Long getId();

        Long getProjectNumber();

        String getPhoneModel();

        BigDecimal getEstimatedProfit();

        String getStatus();

        Instant getCreatedAt();

        Long getFaultId();

        String getComponentCode();

        String getComponentName();

        String getFaultCode();

        String getFaultName();

        String getDescription();

        String getImageUri();

        Boolean getConfirmed();

        String getNotes();
    }
}
