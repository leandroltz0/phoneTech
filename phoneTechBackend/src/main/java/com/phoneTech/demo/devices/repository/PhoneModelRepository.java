package com.phoneTech.demo.devices.repository;

import com.phoneTech.demo.devices.entity.PhoneModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhoneModelRepository extends JpaRepository<PhoneModel, Long> {

    @Query(value = """
            SELECT
                pm.id AS "id",
                pm.brand AS "brand",
                pm.commercial_name AS "commercialName",
                pm.image_uri AS "imageUri",
                pm.unlocktool_status AS "unlockToolStatus"
            FROM phone_models pm
            WHERE pm.is_active = TRUE
              AND (
                    :query IS NULL
                    OR :query = ''
                    OR pm.brand ILIKE '%' || :query || '%'
                    OR pm.commercial_name ILIKE '%' || :query || '%'
              )
            ORDER BY pm.brand ASC, pm.commercial_name ASC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<DeviceSummaryRow> findDeviceSummaries(@Param("query") String query,
                                               @Param("limit") int limit,
                                               @Param("offset") int offset);

    @Query(value = """
            SELECT COUNT(*)
            FROM phone_models pm
            WHERE pm.is_active = TRUE
              AND (
                    :query IS NULL
                    OR :query = ''
                    OR pm.brand ILIKE '%' || :query || '%'
                    OR pm.commercial_name ILIKE '%' || :query || '%'
              )
            """, nativeQuery = true)
    long countDeviceSummaries(@Param("query") String query);

    interface DeviceSummaryRow {

        Long getId();

        String getBrand();

        String getCommercialName();

        String getImageUri();

        String getUnlockToolStatus();
    }
}
