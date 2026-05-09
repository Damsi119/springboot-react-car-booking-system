package com.example.CRW.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data

public class LoginRequset {

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}


