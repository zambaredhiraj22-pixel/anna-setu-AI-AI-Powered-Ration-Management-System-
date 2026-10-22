
package com.ration_management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ration_management.dto.StockRequest;
import com.ration_management.dto.StockResponse;
import com.ration_management.service.StockService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    public StockResponse addStock(
            @Valid @RequestBody StockRequest request) {
        return stockService.addStock(request);
    }

    @GetMapping
    public List<StockResponse> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{id}")
    public StockResponse getStockById(@PathVariable Long id) {
        return stockService.getStockById(id);
    }

    @GetMapping("/commodity/{commodityId}")
    public StockResponse getStockByCommodityId(
            @PathVariable Long commodityId) {
        return stockService.getStockByCommodityId(commodityId);
    }

    @PutMapping("/{id}")
    public StockResponse updateStock(
            @PathVariable Long id,
            @Valid @RequestBody StockRequest request) {
        return stockService.updateStock(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }
}
