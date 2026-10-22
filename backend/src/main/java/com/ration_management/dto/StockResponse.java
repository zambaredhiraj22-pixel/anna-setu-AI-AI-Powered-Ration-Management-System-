
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
public class StockResponse {

    private Long id;
    private Long commodityId;
    private String commodityName;
    private BigDecimal availableQuantity;
    private String unit;
}
