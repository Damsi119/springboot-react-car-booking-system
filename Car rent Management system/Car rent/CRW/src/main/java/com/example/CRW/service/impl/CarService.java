package com.example.CRW.service.impl;

import com.example.CRW.dto.CarDTO;
import com.example.CRW.dto.Response;
import com.example.CRW.entity.Car;
import com.example.CRW.exception.OurException;
import com.example.CRW.repo.BookingRepository;
import com.example.CRW.repo.CarRepository;
import com.example.CRW.service.AwsS3Service;
import com.example.CRW.service.interfac.ICarService;
import com.example.CRW.utils.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class CarService implements ICarService {

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private AwsS3Service awsS3Service;


    @Override
    public Response addCar(MultipartFile photo, String vehicleCategory, String fuelType, BigDecimal vehicleCapacity, String vehicleDescription, BigDecimal vehiclePrice) {


        Response response = new Response();

        try {
            String imageUrl = awsS3Service.saveImageToS3(photo);

            Car car = new Car();
            car.setFuelType(fuelType);
            car.setVehicleCategory(vehicleCategory);
            car.setVehicleCapacity(vehicleCapacity);
            car.setVehicleDescription(vehicleDescription);
            car.setVehiclePrice(vehiclePrice);
            car.setVehiclePhotoURL(imageUrl);

            Car savedCar = carRepository.save(car);
            CarDTO carDTO = Utils.mapCarEntityToCarDTO(savedCar);

            response.setStatusCode(200);
            response.setMessage("Car has been added successfully");
            response.setCar(carDTO);


        }catch (Exception e){

            response.setStatusCode(200);
            response.setMessage("Error saving car" +e.getMessage());
        }
        return response;
    }

    // ✅ SAME AS getAllRoomTypes
    @Override
    public List<String> VehicleCategory() {
        return carRepository.findDistinctvehicleCategory();
    }

    // ✅ SAME AS getAllRooms
    @Override
    public Response getAllCars() {

        Response response = new Response();

        try {
            List<Car> cars =
                    carRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

            List<CarDTO> carDTOList =
                    Utils.mapCarListEntityToCarListDTO(cars);

            response.setStatusCode(200);
            response.setMessage("Cars fetched successfully");
            response.setCarList(carDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching cars: " + e.getMessage());
        }

        return response;
    }

    // ✅ SAME AS deleteRoom
    @Override
    public Response deleteCar(String carId) {

        Response response = new Response();

        try {
            Long id = Long.parseLong(carId);

            Car car = carRepository.findById(id)
                    .orElseThrow(() -> new OurException("Car not found"));

            carRepository.delete(car);

            response.setStatusCode(200);
            response.setMessage("Car deleted successfully");

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error deleting car: " + e.getMessage());
        }

        return response;
    }

    // ✅ SAME AS updateRoom
    @Override
    public Response updateCar(
            Long carId,
            String VehicleDescription,
            String FuelType,
            BigDecimal VehicleCapacity,
            BigDecimal VehiclePrice,
            MultipartFile photo,
            String VehicleCategory
    ) {

        Response response = new Response();

        try {
            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new OurException("Car not found"));
            if (VehicleCategory != null && !VehicleCategory.isBlank())
                car.setVehicleCategory(VehicleCategory);

            if (FuelType != null && !FuelType.isBlank())
                car.setFuelType(FuelType);

            if (VehicleDescription != null && !VehicleDescription.isBlank())
                car.setVehicleDescription(VehicleDescription);

            if (VehicleCapacity != null)
                car.setVehicleCapacity(VehicleCapacity);

            if (VehiclePrice != null)
                car.setVehiclePrice(VehiclePrice);

            if (photo != null && !photo.isEmpty()) {
                String imageUrl = awsS3Service.saveImageToS3(photo);
                car.setVehiclePhotoURL(imageUrl);
            }

            Car updatedCar = carRepository.save(car);
            CarDTO carDTO = Utils.mapCarEntityToCarDTO(updatedCar);

            response.setStatusCode(200);
            response.setMessage("Car updated successfully");
            response.setCar(carDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating car: " + e.getMessage());
        }

        return response;
    }

    // ✅ SAME AS getRoomById
    @Override
    public Response getCarById(Long carId) {

        Response response = new Response();

        try {
            Car car = carRepository.findById(carId)
                    .orElseThrow(() -> new OurException("Car not found"));

            CarDTO carDTO =
                    Utils.mapCarEntityToCarDTOPlusBookings(car);

            response.setStatusCode(200);
            response.setMessage("Car fetched successfully");
            response.setCar(carDTO);

        } catch (OurException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching car: " + e.getMessage());
        }

        return response;
    }

    // ✅ SAME AS getAvailableRoomsByDateAndType
    @Override
    public Response findAvailableCarsByDatesAndCategory(
            LocalDate checkInDate,
            LocalDate checkOutDate,
            String vehicleCategory,
            String fuelType
    ) {

        Response response = new Response();

        try {
            List<Car> cars =
                    carRepository.findAvailableCarsByDatesAndCategory(checkInDate, checkOutDate,vehicleCategory);

            List<Car> availableCars = cars.stream()
                    .filter(car -> car.getBookings().stream()
                            .noneMatch(booking ->
                                    booking.getCheckInDate().isBefore(checkOutDate)
                                            && booking.getCheckOutDate().isAfter(checkInDate)))
                    .toList();

            List<CarDTO> carDTOList =
                    Utils.mapCarListEntityToCarListDTO(availableCars);

            response.setStatusCode(200);
            response.setMessage("Available cars fetched successfully");
            response.setCarList(carDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching available cars: " + e.getMessage());
        }

        return response;
    }

    // ✅ SAME AS getAllAvailableRooms
    @Override
    public Response getAllAvailableCars() {

        Response response = new Response();

        try {
            LocalDate today = LocalDate.now();

            List<Car> cars = carRepository.findAll();

            List<Car> availableCars = cars.stream()
                    .filter(car -> car.getBookings().isEmpty()
                            || car.getBookings().stream()
                            .allMatch(booking ->
                                    booking.getCheckOutDate().isBefore(today)))
                    .toList();

            List<CarDTO> carDTOList =
                    Utils.mapCarListEntityToCarListDTO(availableCars);

            response.setStatusCode(200);
            response.setMessage("Available cars fetched successfully");
            response.setCarList(carDTOList);

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching available cars: " + e.getMessage());
        }

        return response;
    }
}
