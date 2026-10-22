package com.roomigo.dto;

import com.roomigo.entity.VerificationStatus;
import jakarta.validation.constraints.NotNull;

public class ListingVerificationReviewRequest {
    @NotNull(message = "Review status is required")
    private VerificationStatus status; // APPROVED, REJECTED, PENDING

    private Boolean approxLocationVerified = true;
    private Boolean rentVerified = true;
    private Boolean photosVerified = true;
    private Boolean rulesVerified = true;

    private String adminNotes;
    private String rejectionReason;

    public ListingVerificationReviewRequest() {}

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public Boolean getApproxLocationVerified() { return approxLocationVerified; }
    public void setApproxLocationVerified(Boolean approxLocationVerified) { this.approxLocationVerified = approxLocationVerified; }

    public Boolean getRentVerified() { return rentVerified; }
    public void setRentVerified(Boolean rentVerified) { this.rentVerified = rentVerified; }

    public Boolean getPhotosVerified() { return photosVerified; }
    public void setPhotosVerified(Boolean photosVerified) { this.photosVerified = photosVerified; }

    public Boolean getRulesVerified() { return rulesVerified; }
    public void setRulesVerified(Boolean rulesVerified) { this.rulesVerified = rulesVerified; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
