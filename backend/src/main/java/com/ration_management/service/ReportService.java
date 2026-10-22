
package com.ration_management.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ration_management.dto.StockReportResponse;
import com.ration_management.dto.StockResponse;
import com.ration_management.entity.Stock;
import com.ration_management.repository.StockRepository;

@Service
public class ReportService {

    private final StockRepository stockRepository;

    public ReportService(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    public List<StockResponse> getLowStockItems(BigDecimal threshold) {

        if (threshold == null || threshold.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Threshold cannot be negative");
        }

        return stockRepository.findAll()
                .stream()
                .filter(stock -> stock.getAvailableQuantity()
                        .compareTo(threshold) < 0)
                .map(this::toResponse)
                .toList();
    }

    public StockReportResponse getStockSummary(BigDecimal threshold) {

        if (threshold == null || threshold.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Threshold cannot be negative");
        }

        List<Stock> stocks = stockRepository.findAll();

        long lowStockCount = stocks.stream()
                .filter(stock -> stock.getAvailableQuantity()
                        .compareTo(threshold) < 0)
                .count();

        return new StockReportResponse(
                stocks.size(),
                lowStockCount,
                threshold
        );
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
}

