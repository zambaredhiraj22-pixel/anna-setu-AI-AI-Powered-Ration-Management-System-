
package com.ration_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ration_management.dto.BeneficiaryRequest;
import com.ration_management.dto.BeneficiaryResponse;
import com.ration_management.entity.Beneficiary;
import com.ration_management.exception.ResourceNotFoundException;
import com.ration_management.repository.BeneficiaryRepository;

@Service
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;

    public BeneficiaryService(
            BeneficiaryRepository beneficiaryRepository) {
        this.beneficiaryRepository = beneficiaryRepository;
    }

    // Convert entity to response DTO
    private BeneficiaryResponse toResponse(Beneficiary beneficiary) {
        return new BeneficiaryResponse(
                beneficiary.getId(),
                beneficiary.getFullName(),
                beneficiary.getRationCardNumber(),
                beneficiary.getCardType(),
                beneficiary.getPhotoData()
        );
    }

    // Create beneficiary
    public BeneficiaryResponse addBeneficiary(
            BeneficiaryRequest request) {

        if (beneficiaryRepository.existsByRationCardNumber(
                request.getRationCardNumber())) {
            throw new IllegalArgumentException(
                    "Ration card number already exists");
        }

        Beneficiary beneficiary = new Beneficiary();

        beneficiary.setFullName(request.getFullName());
        beneficiary.setRationCardNumber(
                request.getRationCardNumber());
        beneficiary.setCardType(request.getCardType());
        beneficiary.setPhotoData(request.getPhotoData());

        Beneficiary saved =
                beneficiaryRepository.save(beneficiary);

        return toResponse(saved);
    }

    // Get all beneficiaries
    public List<BeneficiaryResponse> getAllBeneficiaries() {
        return beneficiaryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Get beneficiary by ID
    public BeneficiaryResponse getBeneficiaryById(Long id) {

        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Beneficiary not found with ID: " + id
                    )
                );

        return toResponse(beneficiary);
    }

    // Update beneficiary
    @Transactional
    public BeneficiaryResponse updateBeneficiary(
            Long id, BeneficiaryRequest request) {

        Beneficiary existing = beneficiaryRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Beneficiary not found with ID: " + id
                    )
                );

        boolean cardNumberChanged =
                !existing.getRationCardNumber().equals(
                        request.getRationCardNumber());

        if (cardNumberChanged &&
                beneficiaryRepository.existsByRationCardNumber(
                        request.getRationCardNumber())) {
            throw new IllegalArgumentException(
                    "Ration card number already exists");
        }

        existing.setFullName(request.getFullName());
        existing.setRationCardNumber(
                request.getRationCardNumber());
        existing.setCardType(request.getCardType());
        existing.setPhotoData(request.getPhotoData());

        Beneficiary updated =
                beneficiaryRepository.save(existing);

        return toResponse(updated);
    }

    // Delete beneficiary
    public void deleteBeneficiary(Long id) {

        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Beneficiary not found with ID: " + id
                    )
                );

        beneficiaryRepository.delete(beneficiary);
    }
}
