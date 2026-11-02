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
                (
                    SELECT '/uploads/' || pi.file_name
                    FROM project_images pi
                    WHERE pi.project_id = p.id
                    ORDER BY pi.sort_order, pi.created_at, pi.id
                    LIMIT 1
                ) AS "imageUrl",
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

    @Query(value = """
            SELECT
                p.id AS "id",
                p.project_number AS "projectNumber",
                p.phone_model AS "phoneModel",
                p.status AS "status",
                p.created_at AS "createdAt",
                p.estimated_profit AS "estimatedProfit",
                p.phone_variant_id AS "phoneVariantId",
                v.model_code AS "modelCode",
                v.variant_name AS "variantName",
                v.ram_gb AS "ramGb",
                v.storage_gb AS "storageGb",
                v.chipset AS "chipset",
                v.region AS "region",
                COALESCE(m.unlocktool_status, 'UNKNOWN') AS "unlockToolStatus",
                COALESCE(
                    (
                        SELECT '/uploads/' || pi.file_name
                        FROM project_images pi
                        WHERE pi.project_id = p.id
                        ORDER BY pi.sort_order, pi.created_at, pi.id
                        LIMIT 1
                    ),
                    m.image_uri
                ) AS "imageUrl",
                (
                    SELECT pvp.reference_sale_price
                    FROM phone_variant_prices pvp
                    WHERE pvp.phone_variant_id = p.phone_variant_id
                      AND pvp.condition_code = 'GOOD'
                    LIMIT 1
                ) AS "salePrice",
                (
                    SELECT pvp.currency
                    FROM phone_variant_prices pvp
                    WHERE pvp.phone_variant_id = p.phone_variant_id
                      AND pvp.condition_code = 'GOOD'
                    LIMIT 1
                ) AS "saleCurrency",
                (
                    SELECT COALESCE(SUM(psp.unit_cost * psp.quantity), 0)
                    FROM project_spare_parts psp
                    WHERE psp.project_id = p.id
                ) AS "repairCost",
                (
                    SELECT CASE WHEN COUNT(DISTINCT psp.currency) = 1 THEN MIN(psp.currency) END
                    FROM project_spare_parts psp
                    WHERE psp.project_id = p.id
                ) AS "repairCurrency",
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
            LEFT JOIN phone_variants v ON v.id = p.phone_variant_id
            LEFT JOIN phone_models m ON m.id = COALESCE(
                v.phone_model_id,
                (
                    SELECT pm.id
                    FROM phone_models pm
                    WHERE p.phone_variant_id IS NULL
                      AND lower(pm.brand || ' ' || pm.commercial_name) = lower(p.phone_model)
                    LIMIT 1
                )
            )
            LEFT JOIN project_faults pf ON pf.project_id = p.id
            LEFT JOIN diagnostic_fault_catalog df ON df.id = pf.fault_id
            WHERE p.id = :id
            ORDER BY df.sort_order, df.component_name, df.fault_name
            """, nativeQuery = true)
    List<ProjectDetailsRow> findProjectDetails(@Param("id") Long id);

    interface ProjectSummaryRow {

        Long getId();

        Long getProjectNumber();

        String getPhoneModel();

        BigDecimal getEstimatedProfit();

        String getImageUrl();

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

    interface ProjectDetailsRow {

        Long getId();

        Long getProjectNumber();

        String getPhoneModel();

        String getStatus();

        Instant getCreatedAt();

        BigDecimal getEstimatedProfit();

        Long getPhoneVariantId();

        String getModelCode();

        String getVariantName();

        Short getRamGb();

        Short getStorageGb();

        String getChipset();

        String getRegion();

        String getUnlockToolStatus();

        String getImageUrl();

        BigDecimal getSalePrice();

        String getSaleCurrency();

        BigDecimal getRepairCost();

        String getRepairCurrency();

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
