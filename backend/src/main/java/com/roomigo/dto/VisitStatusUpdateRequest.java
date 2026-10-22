package com.roomigo.dto;

import jakarta.validation.constraints.NotBlank;

public class VisitStatusUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status; // ACCEPTED, DECLINED, COMPLETED, CANCELLED

    private String posterResponseNote;

    public VisitStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPosterResponseNote() { return posterResponseNote; }
    public void setPosterResponseNote(String posterResponseNote) { this.posterResponseNote = posterResponseNote; }
}
