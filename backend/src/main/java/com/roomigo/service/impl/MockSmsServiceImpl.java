package com.roomigo.service.impl;

import com.roomigo.service.SmsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MockSmsServiceImpl implements SmsService {

    private static final Logger log = LoggerFactory.getLogger(MockSmsServiceImpl.class);
    private static final SecureRandom random = new SecureRandom();

    private static class OtpRecord {
        final String otp;
        final LocalDateTime expiry;

        OtpRecord(String otp, LocalDateTime expiry) {
            this.otp = otp;
            this.expiry = expiry;
        }
    }

    private final Map<String, OtpRecord> otpStore = new ConcurrentHashMap<>();

    @Override
    public boolean sendVerificationOtp(String phone, String otp) {
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(10);
        String normalizedPhone = normalizePhone(phone);
        otpStore.put(normalizedPhone, new OtpRecord(otp, expiry));

        log.info("=================================================");
        log.info("[SMS GATEWAY] Provider: Mock/Developer Provider");
        log.info("[SMS GATEWAY] Recipient: {}", normalizedPhone);
        log.info("[SMS GATEWAY] Message: Your Roomigo verification code is: {}", otp);
        log.info("[SMS GATEWAY] Valid for 10 minutes. NEVER share this with anyone.");
        log.info("=================================================");
        return true;
    }

    @Override
    public boolean verifyOtp(String phone, String otp) {
        if (otp == null || otp.trim().isEmpty()) {
            return false;
        }

        // Developer test override
        if ("123456".equals(otp.trim())) {
            log.info("[SMS GATEWAY] Master/Demo OTP accepted for {}", phone);
            return true;
        }

        String normalizedPhone = normalizePhone(phone);
        OtpRecord record = otpStore.get(normalizedPhone);
        if (record == null) {
            return false;
        }

        if (LocalDateTime.now().isAfter(record.expiry)) {
            otpStore.remove(normalizedPhone);
            return false;
        }

        boolean matched = record.otp.equals(otp.trim());
        if (matched) {
            otpStore.remove(normalizedPhone);
        }
        return matched;
    }

    @Override
    public String generateAndSendOtp(String phone) {
        int code = 100000 + random.nextInt(900000);
        String otp = String.valueOf(code);
        sendVerificationOtp(phone, otp);
        return otp;
    }

    private String normalizePhone(String phone) {
        if (phone == null) return "";
        return phone.replaceAll("[^0-9]", "");
    }
}
