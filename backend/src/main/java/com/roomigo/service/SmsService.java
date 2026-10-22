package com.roomigo.service;

public interface SmsService {
    /**
     * Send one-time verification password to the provided phone number.
     * @param phone Indian standard phone format e.g. "+91 98765 43210" or "9876543210"
     * @param otp 6-digit verification code
     * @return boolean indicating delivery status
     */
    boolean sendVerificationOtp(String phone, String otp);

    /**
     * Verify the supplied OTP for a phone number.
     * @param phone Target phone number
     * @param otp Code to verify
     * @return true if valid and within TTL
     */
    boolean verifyOtp(String phone, String otp);

    /**
     * Generate and send a new OTP.
     * @param phone Target phone number
     * @return generated OTP
     */
    String generateAndSendOtp(String phone);
}
