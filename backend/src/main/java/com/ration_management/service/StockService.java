
package com.ration_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ration_management.dto.StockRequest;
import com.ration_management.dto.StockResponse;
import com.ration_management.entity.Commodity;
import com.ration_management.entity.Stock;
import com.ration_management.exception.ResourceNotFoundException;
import com.ration_management.repository.CommodityRepository;
import com.ration_management.repository.StockRepository;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final CommodityRepository commodityRepository;

    public StockService(
            StockRepository stockRepository,
            CommodityRepository commodityRepository) {
        this.stockRepository = stockRepository;
        this.commodityRepository = commodityRepository;
    }

    private StockResponse toResponse(Stock stock) {
        return new StockResponse(
                stock.getId(),
                stock.getCommodity().getId(),
                stock.getCommodity().getName(),
                stock.getAvailableQuantity(),
                stock.getCommodity().getUnit()
        );
    }

    @Transactional
    public StockResponse addStock(StockRequest request) {

        Commodity commodity = commodityRepository
                .findById(request.getCommodityId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Commodity not found with ID: "
                                + request.getCommodityId()));

        if (stockRepository.existsByCommodityId(commodity.getId())) {
            throw new IllegalArgumentException(
                    "Stock already exists for this commodity. Use update stock instead.");
        }

        Stock stock = new Stock();
        stock.setCommodity(commodity);
        stock.setAvailableQuantity(request.getAvailableQuantity());

        return toResponse(stockRepository.save(stock));
    }

    public List<StockResponse> getAllStocks() {
        return stockRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public StockResponse getStockById(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock not found with ID: " + id));

        return toResponse(stock);
    }

    public StockResponse getStockByCommodityId(Long commodityId) {
        Stock stock = stockRepository.findByCommodityId(commodityId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock not found for commodity ID: " + commodityId));

        return toResponse(stock);
    }

    @Transactional
    public StockResponse updateStock(Long id, StockRequest request) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock not found with ID: " + id));

        Commodity commodity = commodityRepository
                .findById(request.getCommodityId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Commodity not found with ID: "
                                + request.getCommodityId()));

        if (!stock.getCommodity().getId().equals(commodity.getId())
                && stockRepository.existsByCommodityId(commodity.getId())) {
            throw new IllegalArgumentException(
                    "Stock already exists for this commodity.");
        }

        stock.setCommodity(commodity);
        stock.setAvailableQuantity(request.getAvailableQuantity());

        return toResponse(stockRepository.save(stock));
    }

    public void deleteStock(Long id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stock not found with ID: " + id));

        stockRepository.delete(stock);
    }
}
