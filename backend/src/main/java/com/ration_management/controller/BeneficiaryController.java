
package com.ration_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.ration_management.dto.BeneficiaryRequest;
import com.ration_management.dto.BeneficiaryResponse;
import com.ration_management.service.BeneficiaryService;

@RestController
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    public BeneficiaryController(
            BeneficiaryService beneficiaryService) {
        this.beneficiaryService = beneficiaryService;
    }

    // Create beneficiary
    @PostMapping
    public BeneficiaryResponse addBeneficiary(
            @Valid @RequestBody BeneficiaryRequest request) {
        return beneficiaryService.addBeneficiary(request);
    }

    // Get all beneficiaries
    @GetMapping
    public List<BeneficiaryResponse> getAllBeneficiaries() {
        return beneficiaryService.getAllBeneficiaries();
    }

    // Get beneficiary by ID
    @GetMapping("/{id}")
    public BeneficiaryResponse getBeneficiaryById(
            @PathVariable Long id) {
        return beneficiaryService.getBeneficiaryById(id);
    }

    // Update beneficiary
    @PutMapping("/{id}")
    public BeneficiaryResponse updateBeneficiary(
            @PathVariable Long id,
            @Valid @RequestBody BeneficiaryRequest request) {
        return beneficiaryService.updateBeneficiary(id, request);
    }

    // Delete beneficiary
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeneficiary(
            @PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(id);
        return ResponseEntity.noContent().build();
    }
}

