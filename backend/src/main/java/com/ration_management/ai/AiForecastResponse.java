
package com.ration_management.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AiForecastResponse {

    private String item_name;
    private String unit;
    private Double predicted_demand;
    private String method;
    private String note;
}
