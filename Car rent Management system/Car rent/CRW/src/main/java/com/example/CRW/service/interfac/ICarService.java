package com.example.CRW.service.interfac;

import com.example.CRW.dto.Response;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ICarService {


    Response addCar(MultipartFile photo, String vehicleCategory, String fuelType, BigDecimal vehicleCapacity, String vehicleDescription, BigDecimal vehiclePrice);

    List<String> VehicleCategory();

    Response getAllCars();

    Response deleteCar(String carId);

    Response updateCar(Long carId, String vehicleDescription, String fuelType, BigDecimal vehicleCapacity, BigDecimal vehiclePrice, MultipartFile photo, String vehicleCategory);

    Response getCarById(Long carId);

    Response findAvailableCarsByDatesAndCategory(LocalDate checkInDate, LocalDate checkOutDate, String vehicleCategory , String fuelType);

    Response getAllAvailableCars();







}
