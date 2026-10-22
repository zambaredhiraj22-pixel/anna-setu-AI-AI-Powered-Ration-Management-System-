
package com.ration_management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ration_distributions")
@Getter
@Setter
@NoArgsConstructor
public class RationDistribution {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Beneficiary is required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "beneficiary_id", nullable = false)
    private Beneficiary beneficiary;

    @NotNull(message = "Stock is required")
    @ManyToOne(optional = false)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @NotNull(message = "Distributed quantity is required")
    @DecimalMin(value = "0.01",
            message = "Distributed quantity must be greater than zero")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal quantityDistributed;

    @Column(nullable = false)
    private LocalDateTime distributionDate = LocalDateTime.now();
}
