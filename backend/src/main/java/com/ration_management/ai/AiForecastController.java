
package com.ration_management.ai;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AiForecastController {

    private final AiForecastService aiForecastService;

    public AiForecastController(
            AiForecastService aiForecastService) {
        this.aiForecastService = aiForecastService;
    }

    @PostMapping("/forecast")
    public ResponseEntity<AiForecastResponse> forecastDemand(
            @Valid @RequestBody AiForecastRequest request) {

    	AiForecastResponse response =
    	        aiForecastService.forecastDemand(request);

        return ResponseEntity.ok(response);
    }
}
