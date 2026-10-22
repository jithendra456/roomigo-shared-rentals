package com.roomigo.controller;

import com.roomigo.dto.AdminStatsResponse;
import com.roomigo.dto.ListingVerificationReviewRequest;
import com.roomigo.entity.*;
import com.roomigo.service.AdminService;
import com.roomigo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final AuthService authService;

    public AdminController(AdminService adminService, AuthService authService) {
        this.adminService = adminService;
        this.authService = authService;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getStats() {
        return ResponseEntity.ok(adminService.getStats());
    }

    @GetMapping("/verifications/listings")
    public ResponseEntity<List<ListingVerification>> getPendingListings() {
        return ResponseEntity.ok(adminService.getPendingListingVerifications());
    }

    @PostMapping("/verifications/listings/{id}/review")
    public ResponseEntity<ListingVerification> reviewListing(
            @PathVariable Long id,
            @Valid @RequestBody ListingVerificationReviewRequest review) {
        User admin = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(adminService.reviewListingVerification(id, review, admin));
    }

    @GetMapping("/verifications/renters")
    public ResponseEntity<List<RenterVerification>> getPendingRenters() {
        return ResponseEntity.ok(adminService.getPendingRenterVerifications());
    }

    @PostMapping("/verifications/renters/{id}/review")
    public ResponseEntity<RenterVerification> reviewRenter(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User admin = authService.getCurrentAuthenticatedUser();
        VerificationStatus status = VerificationStatus.valueOf(body.get("status"));
        String notes = body.get("adminNotes");
        String rejectionReason = body.get("rejectionReason");
        return ResponseEntity.ok(adminService.reviewRenterVerification(id, status, notes, rejectionReason, admin));
    }

    @GetMapping("/reports")
    public ResponseEntity<List<UserReport>> getReports() {
        return ResponseEntity.ok(adminService.getAllReports());
    }

    @PostMapping("/reports/{id}/resolve")
    public ResponseEntity<UserReport> resolveReport(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        User admin = authService.getCurrentAuthenticatedUser();
        String action = body.get("action");
        String notes = body.get("notes");
        return ResponseEntity.ok(adminService.resolveReport(id, action, notes, admin));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getAuditLogs());
    }

    @GetMapping("/localities")
    public ResponseEntity<List<Locality>> getLocalities() {
        return ResponseEntity.ok(adminService.getLocalities());
    }

    @PostMapping("/localities")
    public ResponseEntity<Locality> saveLocality(@RequestBody Locality locality) {
        User admin = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(adminService.saveLocality(locality, admin));
    }
}
