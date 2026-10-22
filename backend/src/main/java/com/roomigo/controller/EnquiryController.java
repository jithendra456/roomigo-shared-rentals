package com.roomigo.controller;

import com.roomigo.dto.EnquiryRequest;
import com.roomigo.entity.Enquiry;
import com.roomigo.entity.User;
import com.roomigo.service.AuthService;
import com.roomigo.service.EnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;
    private final AuthService authService;

    public EnquiryController(EnquiryService enquiryService, AuthService authService) {
        this.enquiryService = enquiryService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Enquiry> sendEnquiry(@Valid @RequestBody EnquiryRequest req) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(enquiryService.sendEnquiry(req, user));
    }

    @GetMapping("/received")
    public ResponseEntity<List<Enquiry>> getReceived() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(enquiryService.getReceivedEnquiries(user));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<Enquiry>> getSent() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(enquiryService.getSentEnquiries(user));
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<Enquiry> reply(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        String reply = body.get("reply");
        return ResponseEntity.ok(enquiryService.replyEnquiry(id, reply, user));
    }
}
