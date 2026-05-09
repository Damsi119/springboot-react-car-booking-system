package com.example.CRW.service.interfac;

import com.example.CRW.dto.Response;
import com.example.CRW.entity.Booking;

import java.util.List;

public interface IBookingService {


    Response saveBooking(Long carId, Long userId, Booking bookingRequest);

    Response findBookingByConfirmationCode(String confirmationCode);

    Response getAllBookings();

    Response cancelBooking(Long bookingId);

    List<Booking> getBookingsByUser(Long userId);
}
