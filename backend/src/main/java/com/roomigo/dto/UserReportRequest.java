package com.roomigo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserReportRequest {
    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotBlank(message = "Reason category is required")
    private String reasonCategory; // ALREADY_OCCUPIED, INACCURATE_RENT_OR_DEPOSIT, BROKER_OR_COMMERCIAL_SCAM, FAKE_OR_MISLEADING_PHOTOS, NO_REPLACEMENT_AUTHORITY, OTHER

    @NotBlank(message = "Description is required")
    private String description;

    public UserReportRequest() {}

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }

    public String getReasonCategory() { return reasonCategory; }
    public void setReasonCategory(String reasonCategory) { this.reasonCategory = reasonCategory; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
