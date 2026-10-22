
package com.ration_management.repository;

import java.math.BigDecimal;

public interface MonthlyDemandProjection {
    String getMonth();

    BigDecimal getMonthlyDemand();
}
