
package com.ration_management.dto;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockReportResponse {

    private long totalStockItems;
    private long lowStockItems;
    private BigDecimal threshold;
}
