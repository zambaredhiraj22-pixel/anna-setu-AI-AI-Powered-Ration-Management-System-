
package com.ration_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ration_management.dto.CommodityRequest;
import com.ration_management.dto.CommodityResponse;
import com.ration_management.entity.Commodity;
import com.ration_management.exception.ResourceNotFoundException;
import com.ration_management.repository.CommodityRepository;

@Service
public class CommodityService {

    private final CommodityRepository commodityRepository;

    public CommodityService(CommodityRepository commodityRepository) {
        this.commodityRepository = commodityRepository;
    }

    // Convert Entity to Response DTO
    private CommodityResponse toResponse(Commodity commodity) {
        return new CommodityResponse(
                commodity.getId(),
                commodity.getName(),
                commodity.getQuantityAvailable(),
                commodity.getUnit()
        );
    }

    // Create commodity
    public CommodityResponse addCommodity(CommodityRequest request) {

        Commodity commodity = new Commodity();

        commodity.setName(request.getName());
        commodity.setQuantityAvailable(request.getQuantityAvailable());
        commodity.setUnit(request.getUnit());

        Commodity savedCommodity = commodityRepository.save(commodity);

        return toResponse(savedCommodity);
    }

    // Get all commodities
    public List<CommodityResponse> getAllCommodities() {

        return commodityRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Get commodity by ID
    public CommodityResponse getCommodityById(Long id) {

        Commodity commodity = commodityRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Commodity not found with ID: " + id
                    )
                );

        return toResponse(commodity);
    }

    // Update commodity
    @Transactional
    public CommodityResponse updateCommodity(
            Long id, CommodityRequest request) {

        Commodity existingCommodity = commodityRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Commodity not found with ID: " + id
                    )
                );

        existingCommodity.setName(request.getName());

        existingCommodity.setQuantityAvailable(
                request.getQuantityAvailable());

        existingCommodity.setUnit(request.getUnit());

        Commodity updatedCommodity =
                commodityRepository.save(existingCommodity);

        return toResponse(updatedCommodity);
    }

    // Delete commodity
    public void deleteCommodity(Long id) {

        Commodity commodity = commodityRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Commodity not found with ID: " + id
                    )
                );

        commodityRepository.delete(commodity);
    }
}
