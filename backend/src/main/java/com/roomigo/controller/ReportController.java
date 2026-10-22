package com.roomigo.controller;

import com.roomigo.dto.UserReportRequest;
import com.roomigo.entity.User;
import com.roomigo.entity.UserReport;
import com.roomigo.service.AuthService;
import com.roomigo.service.UserReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final UserReportService userReportService;
    private final AuthService authService;

    public ReportController(UserReportService userReportService, AuthService authService) {
        this.userReportService = userReportService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submitReport(@Valid @RequestBody UserReportRequest req) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        UserReport report = userReportService.submitReport(req, user);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "reportId", report.getId(),
                "message", "Report submitted. Our moderation team reviews suspicious vacancies within 4 hours to protect flatmates."
        ));
    }
}
