
package com.ration_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ration_management.entity.RationDistribution;

@Repository
public interface DemandForecastRepository
        extends JpaRepository<RationDistribution, Long> {

    @Query(value = """
        SELECT
            DATE_FORMAT(d.distribution_date, '%Y-%m') AS month,
            SUM(d.quantity_distributed) AS monthlyDemand
        FROM ration_distributions d
        JOIN stocks s ON d.stock_id = s.id
        WHERE s.commodity_id = :commodityId
        GROUP BY DATE_FORMAT(d.distribution_date, '%Y-%m')
        ORDER BY month ASC
        """, nativeQuery = true)
    List<MonthlyDemandProjection> findMonthlyDemand(
            @Param("commodityId") Long commodityId);
}
