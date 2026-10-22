
package com.ration_management.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ration_management.dto.RationDistributionRequest;
import com.ration_management.dto.RationDistributionResponse;
import com.ration_management.entity.Beneficiary;
import com.ration_management.entity.Stock;
import com.ration_management.entity.RationDistribution;
import com.ration_management.exception.ResourceNotFoundException;
import com.ration_management.repository.BeneficiaryRepository;
import com.ration_management.repository.StockRepository;
import com.ration_management.repository.RationDistributionRepository;

@Service
public class RationDistributionService {

    private final RationDistributionRepository distributionRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final StockRepository stockRepository;

    public RationDistributionService(
            RationDistributionRepository distributionRepository,
            BeneficiaryRepository beneficiaryRepository,
            StockRepository stockRepository) {
        this.distributionRepository = distributionRepository;
        this.beneficiaryRepository = beneficiaryRepository;
        this.stockRepository = stockRepository;
    }

    private RationDistributionResponse toResponse(
            RationDistribution distribution) {

        return new RationDistributionResponse(
                distribution.getId(),
                distribution.getBeneficiary().getId(),
                distribution.getBeneficiary().getFullName(),
                distribution.getStock().getId(),
                distribution.getStock().getCommodity().getName(),
                distribution.getQuantityDistributed(),
                distribution.getStock().getCommodity().getUnit(),
                distribution.getDistributionDate()
        );
    }

    @Transactional
    public RationDistributionResponse distributeRation(
            RationDistributionRequest request) {

        Beneficiary beneficiary = beneficiaryRepository
                .findById(request.getBeneficiaryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Beneficiary not found: "
                                + request.getBeneficiaryId()));

        Stock stock = stockRepository
                .findById(request.getStockId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock not found: " + request.getStockId()));

        BigDecimal requested = request.getQuantityDistributed();
        BigDecimal available = stock.getAvailableQuantity();

        if (requested.compareTo(available) > 0) {
            throw new IllegalArgumentException(
                    "Insufficient stock. Available quantity: " + available);
        }

        stock.setAvailableQuantity(available.subtract(requested));
        stockRepository.save(stock);

        RationDistribution distribution = new RationDistribution();
        distribution.setBeneficiary(beneficiary);
        distribution.setStock(stock);
        distribution.setQuantityDistributed(requested);

        RationDistribution saved =
                distributionRepository.save(distribution);

        return toResponse(saved);
    }

    public List<RationDistributionResponse> getAllDistributions() {
        return distributionRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RationDistributionResponse getDistributionById(Long id) {
        RationDistribution distribution = distributionRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Distribution not found: " + id));

        return toResponse(distribution);
    }
}
