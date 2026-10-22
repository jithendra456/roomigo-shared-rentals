package com.roomigo.controller;

import com.roomigo.dto.*;
import com.roomigo.entity.User;
import com.roomigo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/phone/otp")
    public ResponseEntity<Map<String, Object>> requestPhoneOtp(@Valid @RequestBody PhoneOtpRequest req) {
        boolean sent = authService.sendPhoneOtp(req.getPhone());
        return ResponseEntity.ok(Map.of(
                "success", sent,
                "message", "Verification OTP sent successfully to " + req.getPhone() + " (Use code 123456 in demo/dev mode)"
        ));
    }

    @PostMapping("/phone/verify")
    public ResponseEntity<Map<String, Object>> verifyPhoneOtp(@Valid @RequestBody VerifyOtpRequest req) {
        boolean verified = authService.verifyPhoneOtp(req.getPhone(), req.getOtp());
        if (!verified) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid or expired OTP code"));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Phone number verified successfully!"));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(authService.toAuthResponse(user, null));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody User user) {
        return ResponseEntity.ok(authService.updateProfile(user));
    }
}
