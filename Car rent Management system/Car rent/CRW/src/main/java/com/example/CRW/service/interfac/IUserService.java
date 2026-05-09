package com.example.CRW.service.interfac;


import com.example.CRW.dto.Response;
import com.example.CRW.entity.User;

public interface IUserService {


    Response register(User user);

    Response login(User user);

    Response getAllUsers();

    Response getUsersById(Long userId);

    Response getUserBookingHistory(Long userId);

    Response getMyInfo(Long userId);

    Response deleteUser(Long userId);

    Response getUserByEmail(String email);

}
