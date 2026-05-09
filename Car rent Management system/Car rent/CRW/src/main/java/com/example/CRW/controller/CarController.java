package com.example.CRW.controller;

import com.example.CRW.dto.Response;
import com.example.CRW.service.interfac.IBookingService;
import com.example.CRW.service.interfac.ICarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    @Autowired
    private ICarService carService;
    @Autowired
    private IBookingService bookingService;



    @PostMapping("/add")


    public ResponseEntity<Response>addCar(


                     @RequestParam(value = "photo",required = false)MultipartFile photo,
                     @RequestParam(value= "vehicleCategory", required = false )String vehicleCategory,
                     @RequestParam(value= "fuelType", required = false )String fuelType,

                     @RequestParam(value= "vehiclePrice", required = false )BigDecimal vehiclePrice,
                     @RequestParam(value= "vehicleCapacity", required = false ) BigDecimal vehicleCapacity,
                     @RequestParam(value= "vehicleDescription", required = false )String vehicleDescription

    ){


        if(photo==null || photo.isEmpty() ||vehicleCategory==null|| vehicleCategory.isBlank() ||  vehiclePrice==null || vehicleCapacity==null){


            Response response = new Response();
            response.setStatusCode(400);
            response.setMessage(" Please provide all required fields:photo,  vehicleCategory, fuelType,  vehicleCapacity,  vehicleDescription, vehiclePrice");
            return ResponseEntity.status(response.getStatusCode()).body(response);

        }


        Response response= carService.addCar( photo,  vehicleCategory, fuelType,  vehicleCapacity,  vehicleDescription, vehiclePrice);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }



    @GetMapping("/all")
    public ResponseEntity<Response> getAllCars() {
        Response response = carService.getAllCars();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/categories")
    public List<String> getVehicleCategories() {
        return carService.VehicleCategory();
    }

    @GetMapping("/car-by-id/{carId}")
    public ResponseEntity<Response> getCarById(@PathVariable Long carId) {
        Response response = carService.getCarById(carId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/all-available-cars")
    public ResponseEntity<Response> getAllAvailableCars() {
        Response response = carService.getAllAvailableCars();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/available-cars-by-date-and-vehicleCategory")
    public ResponseEntity<Response> findAvailableCarsByDatesAndCategory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam(required = false) String vehicleCategory,
            @RequestParam(required = false) String fuelType
    ) {
        if (checkInDate == null || checkOutDate == null || vehicleCategory == null || vehicleCategory.isBlank()) {
            Response response = new Response();
            response.setStatusCode(400);
            response.setMessage("Please provide all required fields: checkInDate, checkOutDate, vehicleCategory");
            return ResponseEntity.status(response.getStatusCode()).body(response);
        }

        Response response = carService.findAvailableCarsByDatesAndCategory(checkInDate, checkOutDate, vehicleCategory, fuelType);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @PutMapping("/update/{carId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> updateCar(
            @PathVariable Long carId,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestParam(value = "vehicleCategory", required = false) String vehicleCategory,
            @RequestParam(value = "fuelType", required = false) String fuelType,
            @RequestParam(value= "vehicleCapacity", required = false ) BigDecimal vehicleCapacity,
            @RequestParam(value = "vehiclePrice", required = false) BigDecimal vehiclePrice,
            @RequestParam(value = "vehicleDescription", required = false) String vehicleDescription
    ) {
        Response response = carService.updateCar(carId, vehicleDescription, fuelType, vehicleCapacity, vehiclePrice, photo, vehicleCategory);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/delete/{carId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Response> deleteCar(@PathVariable String carId) {
        Response response = carService.deleteCar(carId);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
