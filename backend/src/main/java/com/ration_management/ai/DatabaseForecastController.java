
package com.ration_management.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class DatabaseForecastController {

    private final DatabaseForecastService databaseForecastService;

    public DatabaseForecastController(
            DatabaseForecastService databaseForecastService) {
        this.databaseForecastService = databaseForecastService;
    }

    @GetMapping("/forecast/commodity/{commodityId}")
    public ResponseEntity<AiForecastResponse> forecastFromDatabase(
            @PathVariable Long commodityId) {

        AiForecastResponse response =
                databaseForecastService.forecastFromDatabase(commodityId);

        return ResponseEntity.ok(response);
    }
}
