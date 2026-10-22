
package com.ration_management.dto;

import jakarta.validation.constraints.NotBlank;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class BeneficiaryRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Ration card number is required")
    private String rationCardNumber;

    @NotBlank(message = "Card type is required")
    private String cardType;
    
    private String photoData;
}
