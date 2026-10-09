package com.campusbrand.asset;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findAllByOrderByCreatedAtDesc();
    @Query("SELECT a FROM Asset a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(a.category) LIKE LOWER(CONCAT('%', :term, '%')) OR LOWER(COALESCE(a.owner, '')) LIKE LOWER(CONCAT('%', :term, '%'))")
    List<Asset> search(@Param("term") String term);
    long countByStatusIgnoreCase(String status);
}
