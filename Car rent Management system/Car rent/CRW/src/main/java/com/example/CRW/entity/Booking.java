package com.example.CRW.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity

@Table(name = "bookings")

public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "check in date is required")
    private LocalDate checkInDate;

    @Future(message = "check out date must be in the future ")
    private LocalDate checkOutDate;

    @Min(value = 1, message = "Number of adults must not be less than 1")
    private int numOfAdults;

    @Min(value = 0, message = "Number of children must not be less than 0")
    private int numOfChildren;

    private int totalNumberOfPassengers;


    private  String bookingConfirmationCode;



    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch= FetchType.LAZY)
    @JoinColumn(name = "car_id")
    private Car car;



    public void calculateTotalNumberOfPassengers(){


        this.totalNumberOfPassengers = this.numOfChildren+this.numOfAdults;
    }


    public  void setNumOfChildren(int numOfChildren){

        this.numOfChildren = numOfChildren;
        calculateTotalNumberOfPassengers();
    }


    public  void setNumOfAdults(int numOfAdults){

        this.numOfAdults = numOfAdults;
        calculateTotalNumberOfPassengers();
    }

    @Override
    public String toString() {
        return "Booking{" +
                "bookingConfirmationCode='" + bookingConfirmationCode + '\'' +
                ", id=" + id +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", numOfAdults=" + numOfAdults +
                ", numOfChildren=" + numOfChildren +
                ", totalNumberOfPassengers=" + totalNumberOfPassengers +


                '}';

    }




}
