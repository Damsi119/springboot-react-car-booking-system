package com.example.CRW.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)

public class UserDTO {

    private Long id;
    private String email;
private String password;
    private String username;
    private String phoneNumber;
    private String role;
    private List<BookingDTO> bookings= new ArrayList<>();
}
