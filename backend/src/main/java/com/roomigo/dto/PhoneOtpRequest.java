package com.roomigo.dto;

import jakarta.validation.constraints.NotBlank;

public class PhoneOtpRequest {
    @NotBlank(message = "Phone number is required")
    private String phone;

    public PhoneOtpRequest() {}
    public PhoneOtpRequest(String phone) { this.phone = phone; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
