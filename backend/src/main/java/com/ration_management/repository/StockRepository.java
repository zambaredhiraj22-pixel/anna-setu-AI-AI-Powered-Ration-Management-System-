
package com.ration_management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ration_management.entity.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByCommodityId(Long commodityId);

    boolean existsByCommodityId(Long commodityId);
}
