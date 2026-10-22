
package com.ration_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ration_management.entity.RationDistribution;

public interface RationDistributionRepository
        extends JpaRepository<RationDistribution, Long> {
}
