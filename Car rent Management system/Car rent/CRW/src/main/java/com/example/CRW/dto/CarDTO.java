package com.example.CRW.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)

public class CarDTO {



    private Long id;
    private String vehicleCategory;
    private String fuelType;
    private BigDecimal vehicleCapacity;
    private String vehiclePrice;
    private String vehiclePhotoURL;
    private String vehicleDescription;


    private List<BookingDTO> bookings;
}
