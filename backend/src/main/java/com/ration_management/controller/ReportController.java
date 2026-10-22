
package com.ration_management.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.ration_management.dto.StockReportResponse;
import com.ration_management.dto.StockResponse;
import com.ration_management.service.ReportService;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/low-stock")
    public List<StockResponse> getLowStockItems(
            @RequestParam(defaultValue = "50") BigDecimal threshold) {

        return reportService.getLowStockItems(threshold);
    }

    @GetMapping("/stock-summary")
    public StockReportResponse getStockSummary(
            @RequestParam(defaultValue = "50") BigDecimal threshold) {

        return reportService.getStockSummary(threshold);
    }
}
