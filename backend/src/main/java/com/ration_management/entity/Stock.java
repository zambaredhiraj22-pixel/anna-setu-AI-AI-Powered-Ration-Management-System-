
package com.ration_management.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "stocks")
@Getter
@Setter
@NoArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Commodity is required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "commodity_id", nullable = false)
    private Commodity commodity;

    @NotNull(message = "Available quantity is required")
    @DecimalMin(value = "0.00", message = "Quantity cannot be negative")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal availableQuantity = BigDecimal.ZERO;
}
