package com.phoneTech.demo.parts.repository;

import com.phoneTech.demo.parts.entity.SupplierSparePart;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface SupplierSparePartRepository extends JpaRepository<SupplierSparePart, Long> {

    @EntityGraph(attributePaths = {"supplier", "sparePart"})
    @Query("select o from SupplierSparePart o where o.sparePart.id = :sparePartId "
            + "and o.supplier.active = true and o.sparePart.active = true "
            + "and o.available = true order by o.purchasePrice asc")
    List<SupplierSparePart> findAvailableOffersBySparePartId(@Param("sparePartId") Long sparePartId);

    @EntityGraph(attributePaths = {"supplier", "sparePart"})
    @Query("select o from SupplierSparePart o where o.sparePart.id in :sparePartIds "
            + "and o.supplier.active = true and o.sparePart.active = true "
            + "and o.available = true order by o.purchasePrice asc")
    List<SupplierSparePart> findAvailableOffersBySparePartIds(@Param("sparePartIds") Collection<Long> sparePartIds);

    @EntityGraph(attributePaths = {"supplier", "sparePart"})
    @Query("select o from SupplierSparePart o where o.sparePart.id in :sparePartIds "
            + "and o.supplier.active = true and o.sparePart.active = true "
            + "and o.available = true and o.currency = :currency "
            + "order by o.purchasePrice asc")
    List<SupplierSparePart> findAvailableOffersBySparePartIdsAndCurrency(
            @Param("sparePartIds") Collection<Long> sparePartIds,
            @Param("currency") String currency);

    @EntityGraph(attributePaths = {"supplier", "sparePart"})
    @Query("select o from SupplierSparePart o where o.supplier.id = :supplierId "
            + "order by o.sparePart.name asc")
    List<SupplierSparePart> findBySupplierId(@Param("supplierId") Long supplierId);
}
