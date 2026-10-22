
package com.ration_management.ai;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class AiForecastService {

    private final RestClient restClient;

    public AiForecastService() {
        this.restClient = RestClient.create("http://127.0.0.1:8001");
    }

    public AiForecastResponse forecastDemand(AiForecastRequest request) {

        try {
            AiForecastResponse response = restClient.post()
                    .uri("/api/ai/forecast")
                    .body(request)
                    .retrieve()
                    .body(AiForecastResponse.class);

            if (response == null) {
                throw new IllegalStateException(
                        "Python AI service returned an empty response.");
            }

            return response;

        } catch (RestClientException exception) {
            throw new IllegalStateException(
                    "Could not connect to Python AI service. "
                    + "Check whether it is running on port 8001.",
                    exception);
        }
    }
}
