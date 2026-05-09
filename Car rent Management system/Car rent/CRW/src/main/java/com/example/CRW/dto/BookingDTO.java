package com.example.CRW.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDate;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)

public class BookingDTO {


    private Long id;


    private LocalDate checkInDate;


    private LocalDate checkOutDate;


    private int numOfAdults;


    private int numOfChildren;


    private int totalNumberOfPassengers;

    private  String bookingConfirmationCode;

    private UserDTO user;

    private CarDTO car;





}
