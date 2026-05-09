package com.example.CRW.service.impl;

import com.example.CRW.dto.BookingDTO;
import com.example.CRW.dto.Response;
import com.example.CRW.entity.Booking;
import com.example.CRW.entity.Car;
import com.example.CRW.entity.User;
import com.example.CRW.exception.OurException;
import com.example.CRW.repo.BookingRepository;
import com.example.CRW.repo.CarRepository;
import com.example.CRW.repo.UserRepository;
import com.example.CRW.service.interfac.IBookingService;
import com.example.CRW.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.CRW.security.SecurityUtils;




import java.util.List;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Response saveBooking(Long carId, Long userId, Booking bookingRequest) {

        Response response = new Response();

        try {

            if (bookingRequest.getCheckOutDate()
                    .isBefore(bookingRequest.getCheckInDate())) {

                throw new IllegalArgumentException(
                        "Check Out Date must be after Check In Date");
            }

            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new OurException("Car Not Found"));

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new OurException("User Not Found"));

            List<Booking> existingBookings = car.getBookings();

            if (!carIsAvailable(bookingRequest, existingBookings)) {
                throw new OurException("Car Not Available for selected date range");
            }

            bookingRequest.setCar(car);
            bookingRequest.setUser(user);

            String bookingConfirmationCode =
                    Utils.generateRandomConfirmationCode(10);

            bookingRequest.setBookingConfirmationCode(bookingConfirmationCode);

            bookingRepository.save(bookingRequest);

            response.setMessage("Car Booking Confirmation");
            response.setStatusCode(200);
            response.setBookingConfirmationCode(bookingConfirmationCode);

        } catch (OurException oe) {

            response.setMessage(oe.getMessage());
            response.setStatusCode(404);

        } catch (Exception e) {

            response.setMessage("Error saving Booking " + e.getMessage());
            response.setStatusCode(500);
        }

        return response;
    }

    // 🔁 SAME logic as HMS (only name changed)
    private boolean carIsAvailable(Booking bookingRequest,
                                   List<Booking> existingBookings) {

        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate()
                                .equals(existingBooking.getCheckInDate())
                                || bookingRequest.getCheckOutDate()
                                .isBefore(existingBooking.getCheckOutDate())
                                || (bookingRequest.getCheckInDate()
                                .isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate()
                                .isBefore(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate()
                                .isBefore(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckOutDate()
                                .equals(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate()
                                .isBefore(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckOutDate()
                                .isAfter(existingBooking.getCheckOutDate()))
                                || (bookingRequest.getCheckInDate()
                                .equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate()
                                .equals(existingBooking.getCheckInDate()))
                                || (bookingRequest.getCheckInDate()
                                .equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate()
                                .equals(bookingRequest.getCheckInDate()))
                );
    }

    @Override
    public Response findBookingByConfirmationCode(String confirmationCode) {

        Response response = new Response();

        try {

            Booking booking = bookingRepository
                    .findByBookingConfirmationCode(confirmationCode)
                    .orElseThrow(() -> new OurException("Booking Not Found"));

            BookingDTO bookingDTO =
                    Utils.mapBookingEntityToBookingDTO(booking);

            response.setMessage("Car Booking Confirmation");
            response.setStatusCode(200);
            response.setBooking(bookingDTO);

        } catch (OurException oe) {

            response.setMessage(oe.getMessage());
            response.setStatusCode(404);

        } catch (Exception e) {

            response.setMessage("Error Finding Booking " + e.getMessage());
            response.setStatusCode(500);
        }

        return response;
    }

    @Override
    public Response getAllBookings() {

        Response response = new Response();

        try {

            List<Booking> bookingList =
                    bookingRepository.findAll(
                            Sort.by(Sort.Direction.DESC, "checkInDate"));

            List<BookingDTO> bookingDTOList =
                    Utils.mapBookingListEntityToBookingListDTO(bookingList);

            response.setMessage("Car Booking Confirmation");
            response.setStatusCode(200);
            response.setBookingList(bookingDTOList);

        } catch (Exception e) {

            response.setMessage("Error Getting Bookings " + e.getMessage());
            response.setStatusCode(500);
        }

        return response;
    }

    @Transactional
    @Override
    public Response cancelBooking(Long bookingId) {
        Response response = new Response();

        try {
            // 1️⃣ Load booking
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new OurException("Booking not found"));

            // 2️⃣ Get current logged-in user
            String loggedInUsername = SecurityUtils.getCurrentUsername();

            boolean isUSER = SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getAuthorities()
                    .stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_USER"));

            if (!booking.getUser().getUsername().equals(loggedInUsername)) {
                throw new OurException("You are not allowed to cancel this booking");
            }



            // 4️⃣ Remove booking from parent collections to prevent re-insert
            if (booking.getCar() != null) {
                booking.getCar().getBookings().remove(booking);
            }
            if (booking.getUser() != null) {
                booking.getUser().getBookings().remove(booking);
            }

            // 5️⃣ Map DTO before deletion (optional)
            BookingDTO bookingDTO = Utils.mapBookingEntityToBookingDTO(booking);

            // 6️⃣ Delete booking
            bookingRepository.delete(booking);

            response.setBooking(bookingDTO);
            response.setStatusCode(200);
            response.setMessage("Car Booking Cancelled Successfully");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error cancelling booking: " + e.getMessage());
        }

        return response;
    }


    @Override
    public List<Booking> getBookingsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return bookingRepository.findByUser(user);
    }




}
