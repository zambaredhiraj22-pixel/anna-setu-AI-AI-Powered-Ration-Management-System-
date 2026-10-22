
package com.ration_management.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())

            // API uses JWT, so server sessions are not created.
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                // Allow browser preflight requests.
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // Login and registration are public.
                .requestMatchers("/api/auth/**").permitAll()

                // Admin-only endpoints.
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // BENEFICIARIES
                // All roles can view the beneficiary list.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/beneficiaries",
                    "/api/beneficiaries/**"
                ).hasAnyRole("ADMIN", "OFFICER", "USER")

                // Only ADMIN and OFFICER can create beneficiaries.
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/beneficiaries",
                    "/api/beneficiaries/**"
                ).hasAnyRole("ADMIN", "OFFICER")

                // Only ADMIN and OFFICER can update beneficiaries.
                .requestMatchers(
                    HttpMethod.PUT,
                    "/api/beneficiaries",
                    "/api/beneficiaries/**"
                ).hasAnyRole("ADMIN", "OFFICER")

                // Only ADMIN and OFFICER can delete beneficiaries.
                .requestMatchers(
                    HttpMethod.DELETE,
                    "/api/beneficiaries",
                    "/api/beneficiaries/**"
                ).hasAnyRole("ADMIN", "OFFICER")

                // COMMODITIES
                // All roles can view commodities.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/commodities",
                    "/api/commodities/**"
                ).hasAnyRole("ADMIN", "OFFICER", "USER")

                // Only ADMIN can create, update or delete commodities.
                .requestMatchers(
                    "/api/commodities",
                    "/api/commodities/**"
                ).hasRole("ADMIN")

                // STOCKS
                // All roles can view stock.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/stocks",
                    "/api/stocks/**"
                ).hasAnyRole("ADMIN", "OFFICER", "USER")

                // ADMIN and OFFICER can manage stock.
                .requestMatchers(
                    "/api/stocks",
                    "/api/stocks/**"
                ).hasAnyRole("ADMIN", "OFFICER")

                // RATION DISTRIBUTION
                // ADMIN and OFFICER can manage distributions.
                .requestMatchers(
                    "/api/distributions",
                    "/api/distributions/**",
                    "/api/distribution",
                    "/api/distribution/**"
                ).hasAnyRole("ADMIN", "OFFICER")

                // AI FORECAST
                // All roles can view/run forecast using GET.
                .requestMatchers(
                    HttpMethod.GET,
                    "/api/ai/forecast",
                    "/api/ai/forecast/**"
                ).hasAnyRole("ADMIN", "OFFICER", "USER")

                // Only ADMIN and OFFICER can use non-GET forecast endpoints.
                .requestMatchers(
                    "/api/ai/forecast",
                    "/api/ai/forecast/**"
                ).hasAnyRole("ADMIN", "OFFICER")

                // Any endpoint not listed above is ADMIN-only.
                .anyRequest().hasRole("ADMIN")
            )

            // Verify JWT on protected requests.
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173",
            "http://localhost:5174"
        ));

        configuration.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept"
        ));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}

