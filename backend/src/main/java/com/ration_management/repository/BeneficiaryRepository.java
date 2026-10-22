
package com.ration_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ration_management.entity.Beneficiary;

public interface BeneficiaryRepository
        extends JpaRepository<Beneficiary, Long> {

    boolean existsByRationCardNumber(String rationCardNumber);
}
