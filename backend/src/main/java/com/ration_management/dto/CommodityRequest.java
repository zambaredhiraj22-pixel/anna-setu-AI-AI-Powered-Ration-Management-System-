
package com.ration_management.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class CommodityRequest {

    @NotBlank(message = "Commodity name is required")
    private String name;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.00",
            message = "Quantity cannot be negative")
    private BigDecimal quantityAvailable;

    @NotBlank(message = "Unit is required")
    private String unit;
}

