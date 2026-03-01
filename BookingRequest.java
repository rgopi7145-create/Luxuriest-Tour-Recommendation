package com.tourbot.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull(message = "Tour ID is required")
    private Long tourId;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    private LocalDate dateOfBirth;
    private String nationality;

    @NotNull(message = "Travel date is required")
    private LocalDate travelDate;

    @NotNull(message = "Number of travelers is required")
    @Positive(message = "Number of travelers must be positive")
    private Integer numberOfTravelers;

    private String travelStyle;
    private String accommodationType;
    private String dietaryRequirements;
    private String specialRequests;

    private String emergencyContactName;
    private String emergencyContactRelationship;
    private String emergencyContactPhone;

    private String cardHolderName;
    private String cardNumber;
    private String billingAddress;
    private String billingCity;
    private String billingZip;
    private String billingCountry;
}
