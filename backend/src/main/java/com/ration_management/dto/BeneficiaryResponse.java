
package com.ration_management.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BeneficiaryResponse {

    private Long id;

    private String fullName;

    private String rationCardNumber;

    private String cardType;
    
    private String photoData;
}
