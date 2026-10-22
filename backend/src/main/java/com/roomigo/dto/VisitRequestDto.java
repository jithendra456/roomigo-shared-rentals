package com.roomigo.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class VisitRequestDto {
    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotNull(message = "Preferred date is required")
    @FutureOrPresent(message = "Date cannot be in the past")
    private LocalDate preferredDate;

    @NotBlank(message = "Time slot is required")
    private String timeSlot; // Morning (9 AM - 12 PM), Afternoon (12 PM - 4 PM), Evening (4 PM - 8 PM)

    @NotBlank(message = "Visit type is required")
    private String visitType = "IN_PERSON"; // IN_PERSON, VIDEO_CALL

    private String notes;

    public VisitRequestDto() {}

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }

    public LocalDate getPreferredDate() { return preferredDate; }
    public void setPreferredDate(LocalDate preferredDate) { this.preferredDate = preferredDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getVisitType() { return visitType; }
    public void setVisitType(String visitType) { this.visitType = visitType; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
