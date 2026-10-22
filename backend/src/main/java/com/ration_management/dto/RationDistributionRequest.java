
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
public class RationDistributionRequest {

    @NotNull(message = "Beneficiary ID is required")
    private Long beneficiaryId;

    @NotNull(message = "Stock ID is required")
    private Long stockId;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.01",
            message = "Quantity must be greater than zero")
    private BigDecimal quantityDistributed;
}
