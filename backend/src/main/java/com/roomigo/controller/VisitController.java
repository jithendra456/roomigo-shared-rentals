package com.roomigo.controller;

import com.roomigo.dto.VisitRequestDto;
import com.roomigo.dto.VisitStatusUpdateRequest;
import com.roomigo.entity.User;
import com.roomigo.entity.VisitRequest;
import com.roomigo.service.AuthService;
import com.roomigo.service.VisitService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/visits")
public class VisitController {

    private final VisitService visitService;
    private final AuthService authService;

    public VisitController(VisitService visitService, AuthService authService) {
        this.visitService = visitService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<VisitRequest> scheduleVisit(@Valid @RequestBody VisitRequestDto dto) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(visitService.requestVisit(dto, user));
    }

    @GetMapping("/received")
    public ResponseEntity<List<VisitRequest>> getReceivedVisits() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(visitService.getPosterVisits(user));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<VisitRequest>> getSentVisits() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(visitService.getRequesterVisits(user));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<VisitRequest> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody VisitStatusUpdateRequest update) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(visitService.updateVisitStatus(id, update, user));
    }
}
