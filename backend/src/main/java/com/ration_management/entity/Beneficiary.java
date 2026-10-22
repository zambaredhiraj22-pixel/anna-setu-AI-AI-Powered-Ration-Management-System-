
package com.ration_management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "beneficiaries")
@Getter
@Setter
@NoArgsConstructor
public class Beneficiary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    @Column(nullable = false)
    private String fullName;

    @NotBlank(message = "Ration card number is required")
    @Column(nullable = false, unique = true)
    private String rationCardNumber;

    @NotBlank(message = "Card type is required")
    @Column(nullable = false)
    private String cardType;
    
    @Lob
    @Column(name = "photo_data", columnDefinition = "LONGTEXT")
    private String photoData;
    
}


