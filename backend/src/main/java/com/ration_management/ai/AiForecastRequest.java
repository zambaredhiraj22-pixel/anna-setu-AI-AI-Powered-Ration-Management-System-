
package com.ration_management.ai;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiForecastRequest {

    @NotBlank(message = "Item name is required")
    private String itemName;

    @NotBlank(message = "Unit is required")
    private String unit = "KG";

    @NotEmpty(message = "Monthly demand is required")
    @Size(min = 3, message = "Provide at least 3 months of demand")
    private List<@PositiveOrZero(
            message = "Demand cannot be negative"
    ) Double> monthlyDemand;
}
