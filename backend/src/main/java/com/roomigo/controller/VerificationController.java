package com.roomigo.controller;

import com.roomigo.dto.RenterVerificationRequest;
import com.roomigo.entity.RenterVerification;
import com.roomigo.entity.User;
import com.roomigo.service.AuthService;
import com.roomigo.service.VerificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/verification")
public class VerificationController {

    private final VerificationService verificationService;
    private final AuthService authService;

    public VerificationController(VerificationService verificationService, AuthService authService) {
        this.verificationService = verificationService;
        this.authService = authService;
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getVerificationInfo() {
        return ResponseEntity.ok(verificationService.getVerificationInfo());
    }

    @PostMapping("/renter")
    public ResponseEntity<RenterVerification> submitRenterVerification(@Valid @RequestBody RenterVerificationRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(verificationService.submitRenterVerification(request, user));
    }

    @GetMapping("/renter/my")
    public ResponseEntity<RenterVerification> getMyVerification() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(verificationService.getMyVerification(user));
    }
}
