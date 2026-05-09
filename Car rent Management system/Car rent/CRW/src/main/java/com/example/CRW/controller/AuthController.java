package com.example.CRW.controller;



import com.example.CRW.dto.Response;
import com.example.CRW.entity.User;
import com.example.CRW.service.interfac.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")

public class AuthController {

    @Autowired

    private IUserService userService;

    @PostMapping("/register")

    public ResponseEntity<Response> register(@RequestBody User user){

        Response response = userService.register(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }







    @PostMapping("/login")

    public ResponseEntity<Response> login(@RequestBody User user ){

        Response response = userService.login(user);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }




}




