package com.ration_management.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "commodities")
@Getter
@Setter
@NoArgsConstructor
public class Commodity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Commodity name is required")
    @Column(nullable = false, unique = true)
    private String name;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.00",
            message = "Quantity cannot be negative")
    @Column(name = "quantity_available",
            nullable = false,
            precision = 10,
            scale = 2)
    private BigDecimal quantityAvailable = BigDecimal.ZERO;

    @NotBlank(message = "Unit is required")
    @Column(nullable = false)
    private String unit = "KG";
}