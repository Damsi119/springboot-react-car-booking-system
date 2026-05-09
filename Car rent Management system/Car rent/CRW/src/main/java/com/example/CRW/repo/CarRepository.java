package com.example.CRW.repo;

import com.example.CRW.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface CarRepository extends JpaRepository<Car,Long> {


    @Query("SELECT DISTINCT c.vehicleCategory  FROM Car c")
    List<String> findDistinctvehicleCategory();


    @Query("""
    SELECT c
    FROM Car c
    LEFT JOIN Booking bk
        ON bk.car = c
        AND bk.checkInDate < :checkOutDate
        AND bk.checkOutDate > :checkInDate
    WHERE bk.id IS NULL
      AND (:vehicleCategory IS NULL OR c.vehicleCategory = :vehicleCategory)
""")
    List<Car> findAvailableCarsByDatesAndCategory(
            LocalDate checkInDate,
            LocalDate checkOutDate,
            String vehicleCategory
    );


    @Query("""
    SELECT c
    FROM Car c
    WHERE c.id NOT IN (
        SELECT b.car.id
        FROM Booking b
    )
""")

    List<Car> getAllAvailableCars();







}
