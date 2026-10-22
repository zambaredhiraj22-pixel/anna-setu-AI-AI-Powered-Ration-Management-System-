
package com.ration_management.ai;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ration_management.repository.DemandForecastRepository;
import com.ration_management.repository.MonthlyDemandProjection;

@Service
public class DatabaseForecastService {

    private final DemandForecastRepository demandForecastRepository;
    private final AiForecastService aiForecastService;

    public DatabaseForecastService(
            DemandForecastRepository demandForecastRepository,
            AiForecastService aiForecastService) {

        this.demandForecastRepository = demandForecastRepository;
        this.aiForecastService = aiForecastService;
    }


public AiForecastResponse forecastFromDatabase(Long commodityId) {

    List<MonthlyDemandProjection> history =
            demandForecastRepository.findMonthlyDemand(commodityId);

    if (history == null || history.isEmpty()) {
        throw new IllegalArgumentException(
                "No demand history found for this commodity."
        );
    }

    List<Double> monthlyDemand = history.stream()
            .map(row -> row.getMonthlyDemand().doubleValue())
            .toList();

    // If fewer than 3 months are available, use the latest
    // month's demand as a fallback prediction.
    if (monthlyDemand.size() < 3) {

        Double latestDemand =
                monthlyDemand.get(monthlyDemand.size() - 1);

        return new AiForecastResponse(
                "Commodity ID " + commodityId,
                "KG",
                latestDemand,
                "LAST_MONTH_FALLBACK",
                "Insufficient monthly history for AI forecasting. "
                + "Latest month's demand is used as the estimate."
        );
    }

    AiForecastRequest request = new AiForecastRequest();
    request.setItemName("Commodity ID " + commodityId);
    request.setUnit("KG");
    request.setMonthlyDemand(monthlyDemand);

    return aiForecastService.forecastDemand(request);
}

}

