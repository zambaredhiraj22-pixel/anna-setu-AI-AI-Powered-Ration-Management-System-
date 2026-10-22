
package com.ration_management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RationDistributionResponse {

    private Long id;
    private Long beneficiaryId;
    private String beneficiaryName;
    private Long stockId;
    private String itemName;
    private BigDecimal quantityDistributed;
    private String unit;
    private LocalDateTime distributionDate;
}
