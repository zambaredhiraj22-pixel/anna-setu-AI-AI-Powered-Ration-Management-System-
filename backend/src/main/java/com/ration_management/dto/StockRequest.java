
package com.ration_management.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class StockRequest {

    @NotNull(message = "Commodity ID is required")
    private Long commodityId;

    @NotNull(message = "Available quantity is required")
    @DecimalMin(value = "0.00", message = "Quantity cannot be negative")
    private BigDecimal availableQuantity;
}
