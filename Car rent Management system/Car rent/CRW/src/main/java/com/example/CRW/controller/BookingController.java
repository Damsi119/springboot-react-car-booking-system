package com.example.CRW.controller;

import com.example.CRW.dto.BookingDTO;
import com.example.CRW.dto.Response;
import com.example.CRW.entity.Booking;
import com.example.CRW.service.interfac.IBookingService;
import com.example.CRW.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private IBookingService bookingService;

    // Book a car
    @PostMapping("/book-car/{carId}/{userId}")

    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('ROLE_USER')")
    public ResponseEntity<Response> saveBooking(@PathVariable Long carId,
                                                @PathVariable Long userId,
                                                @RequestBody Booking bookingRequest) {

        Response response = bookingService.saveBooking(carId, userId, bookingRequest);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // Get all bookings (Admin only)
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> getAllBookings() {
        Response response = bookingService.getAllBookings();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    // Find booking by confirmation code
    @GetMapping("/get-by-confirmation-code/{confirmationCode}")
    public ResponseEntity<Response> getBookingByConfirmationCode(@PathVariable String confirmationCode) {
        Response response = bookingService.findBookingByConfirmationCode(confirmationCode);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }


    @GetMapping("/user/{userId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('ROLE_USER')")
    public ResponseEntity<List<BookingDTO>> getBookingsByUser(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUser(userId); // returns List<Booking>

        // Map to DTOs for frontend
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(b -> Utils.mapBookingEntityToBookDTOPlusBookedCar(b, true))
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookingDTOs);
    }

    @DeleteMapping("/cancel/{bookingId}")
    public ResponseEntity<Response> cancelBooking(@PathVariable String bookingId) {
        Response response = bookingService.cancelBooking(Long.valueOf(bookingId));
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

}
