
package com.ration_management.controller;

import java.util.List;
import com.ration_management.entity.Commodity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.ration_management.dto.CommodityRequest;
import com.ration_management.dto.CommodityResponse;
import com.ration_management.service.CommodityService;

@RestController
@RequestMapping("/api/commodities")
public class CommodityController {

    private final CommodityService commodityService;

    public CommodityController(CommodityService commodityService) {
        this.commodityService = commodityService;
    }

    // Create commodity
    @PostMapping
    public CommodityResponse addCommodity(
            @Valid @RequestBody CommodityRequest request) {
        return commodityService.addCommodity(request);
    }

    // Get all commodities
    @GetMapping
    public List<CommodityResponse> getAllCommodities() {
        return commodityService.getAllCommodities();
    }

    // Get commodity by ID
    @GetMapping("/{id}")
    public CommodityResponse getCommodityById(
            @PathVariable Long id) {
        return commodityService.getCommodityById(id);
    }

    // Update commodity
    @PutMapping("/{id}")
    public CommodityResponse updateCommodity(
            @PathVariable Long id,
            @Valid @RequestBody CommodityRequest request) {
        return commodityService.updateCommodity(id, request);
    }

    // Delete commodity
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommodity(
            @PathVariable Long id) {
        commodityService.deleteCommodity(id);
        return ResponseEntity.noContent().build();
    }
}
