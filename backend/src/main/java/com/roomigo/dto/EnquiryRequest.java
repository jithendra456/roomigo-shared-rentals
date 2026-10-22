package com.roomigo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EnquiryRequest {
    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotBlank(message = "Message is required")
    private String message;

    private String senderOccupation;
    private LocalDate moveInDate;
    private String senderPhone;

    public EnquiryRequest() {}

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSenderOccupation() { return senderOccupation; }
    public void setSenderOccupation(String senderOccupation) { this.senderOccupation = senderOccupation; }

    public LocalDate getMoveInDate() { return moveInDate; }
    public void setMoveInDate(LocalDate moveInDate) { this.moveInDate = moveInDate; }

    public String getSenderPhone() { return senderPhone; }
    public void setSenderPhone(String senderPhone) { this.senderPhone = senderPhone; }
}
