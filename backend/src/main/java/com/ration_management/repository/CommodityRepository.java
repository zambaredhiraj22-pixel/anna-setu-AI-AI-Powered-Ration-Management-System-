package com.ration_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ration_management.entity.Commodity;

public interface CommodityRepository
        extends JpaRepository<Commodity, Long> {

}