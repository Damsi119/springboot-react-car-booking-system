package com.example.CRW.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity

@Table(name = "cars")

public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String bookingConfirmationCode;
    private String vehicleCategory;
    private String fuelType;
    private BigDecimal vehicleCapacity;
    private BigDecimal vehiclePrice;
    private String vehiclePhotoURL;
    private String vehicleDescription;


    @OneToMany(
            mappedBy = "car",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Booking> bookings;


    @Override
    public String toString() {
        return "Car{" +
                "bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
                ", id=" + id +
                ", vehicleCategory='" + vehicleCategory + '\'' +
                ", fuelType='" + fuelType + '\'' +
                ", vehicleCapacity=" + vehicleCapacity +
                ", vehiclePrice=" + vehiclePrice +
                ", vehiclePhotoURL='" + vehiclePhotoURL + '\'' +
                ", vehicleDescription='" + vehicleDescription + '\'' +
                ", bookings=" + bookings +
                '}';
    }
}
