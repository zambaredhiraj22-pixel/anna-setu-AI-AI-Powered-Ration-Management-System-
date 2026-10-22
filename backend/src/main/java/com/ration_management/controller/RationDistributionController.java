
package com.ration_management.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.ration_management.dto.RationDistributionRequest;
import com.ration_management.dto.RationDistributionResponse;
import com.ration_management.service.RationDistributionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/distributions")
public class RationDistributionController {

    private final RationDistributionService distributionService;

    public RationDistributionController(
            RationDistributionService distributionService) {
        this.distributionService = distributionService;
    }

    @PostMapping
    public RationDistributionResponse distributeRation(
            @Valid @RequestBody RationDistributionRequest request) {
        return distributionService.distributeRation(request);
    }

    @GetMapping
    public List<RationDistributionResponse> getAllDistributions() {
        return distributionService.getAllDistributions();
    }

    @GetMapping("/{id}")
    public RationDistributionResponse getDistributionById(
            @PathVariable Long id) {
        return distributionService.getDistributionById(id);
    }
}
