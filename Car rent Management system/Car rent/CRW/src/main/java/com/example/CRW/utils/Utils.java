package com.example.CRW.utils;

import com.example.CRW.dto.BookingDTO;
import com.example.CRW.dto.CarDTO;
import com.example.CRW.dto.UserDTO;
import com.example.CRW.entity.Booking;
import com.example.CRW.entity.Car;
import com.example.CRW.entity.User;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

public class Utils {

    /* ---------------- RANDOM STRING ---------------- */

    private static final String ALPHANUMERIC_STRING =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    private static final SecureRandom random = new SecureRandom();

    public static String generateRandomConfirmationCode(int length) {
        StringBuilder builder = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            builder.append(
                    ALPHANUMERIC_STRING.charAt(
                            random.nextInt(ALPHANUMERIC_STRING.length())
                    )
            );
        }
        return builder.toString();
    }

    /* ---------------- USER ---------------- */

    public static UserDTO mapUserEntityToUserDTO(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setRole(user.getRole());
        return userDTO;
    }

    public static UserDTO mapUserEntityToUserDTOPlusUserBookingsAndCars(User user) {
        UserDTO userDTO = mapUserEntityToUserDTO(user);

        if (user.getBookings() != null && !user.getBookings().isEmpty()) {
            userDTO.setBookings(
                    user.getBookings()
                            .stream()
                            .map(booking ->
                                    mapBookingEntityToBookDTOPlusBookedCar(booking, false)
                            )
                            .collect(Collectors.toList())
            );
        }
        return userDTO;
    }

    public static List<UserDTO> mapUserListEntityToUserListDTO(List<User> userList) {
        return userList
                .stream()
                .map(Utils::mapUserEntityToUserDTO)
                .collect(Collectors.toList());
    }

    /* ---------------- CAR ---------------- */

    public static CarDTO mapCarEntityToCarDTO(Car car) {
        CarDTO carDTO = new CarDTO();
        carDTO.setId(car.getId());
        carDTO.setVehicleCategory(car.getVehicleCategory());
        carDTO.setVehiclePrice(String.valueOf(car.getVehiclePrice()));
        carDTO.setVehiclePhotoURL(car.getVehiclePhotoURL());
        carDTO.setVehicleDescription(car.getVehicleDescription());
        carDTO.setFuelType(car.getFuelType());

        return carDTO;
    }

    public static CarDTO mapCarEntityToCarDTOPlusBookings(Car car) {
        CarDTO carDTO = mapCarEntityToCarDTO(car);

        if (car.getBookings() != null && !car.getBookings().isEmpty()) {
            carDTO.setBookings(
                    car.getBookings()
                            .stream()
                            .map(Utils::mapBookingEntityToBookingDTO)
                            .collect(Collectors.toList())
            );
        }
        return carDTO;
    }

    public static List<CarDTO> mapCarListEntityToCarListDTO(List<Car> carList) {
        return carList
                .stream()
                .map(Utils::mapCarEntityToCarDTO)
                .collect(Collectors.toList());
    }

    /* ---------------- BOOKING ---------------- */

    public static BookingDTO mapBookingEntityToBookingDTO(Booking booking) {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setCheckInDate(booking.getCheckInDate());
        bookingDTO.setCheckOutDate(booking.getCheckOutDate());
        bookingDTO.setBookingConfirmationCode(booking.getBookingConfirmationCode());
        bookingDTO.setNumOfAdults(booking.getNumOfAdults());
        bookingDTO.setNumOfChildren(booking.getNumOfChildren());
        bookingDTO.setTotalNumberOfPassengers(booking.getTotalNumberOfPassengers());
        return bookingDTO;
    }

    public static BookingDTO mapBookingEntityToBookDTOPlusBookedCar(
            Booking booking,
            boolean mapUser
    ) {

        BookingDTO bookingDTO = mapBookingEntityToBookingDTO(booking);

        if (booking.getCar() != null) {
            bookingDTO.setCar(
                    mapCarEntityToCarDTO(booking.getCar())
            );
        }

        if (mapUser && booking.getUser() != null) {
            bookingDTO.setUser(
                    mapUserEntityToUserDTO(booking.getUser())
            );
        }

        return bookingDTO;
    }

    public static List<BookingDTO> mapBookingListEntityToBookingListDTO(
            List<Booking> bookingList
    ) {
        return bookingList
                .stream()
                .map(Utils::mapBookingEntityToBookingDTO)
                .collect(Collectors.toList());
    }
}
