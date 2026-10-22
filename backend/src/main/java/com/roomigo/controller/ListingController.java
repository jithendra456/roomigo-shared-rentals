package com.roomigo.controller;

import com.roomigo.dto.ListingRequest;
import com.roomigo.dto.ListingResponse;
import com.roomigo.entity.ListingType;
import com.roomigo.entity.User;
import com.roomigo.service.AuthService;
import com.roomigo.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/listings")
public class ListingController {

    private final ListingService listingService;
    private final AuthService authService;

    public ListingController(ListingService listingService, AuthService authService) {
        this.listingService = listingService;
        this.authService = authService;
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ListingResponse>> search(
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) String furnishing,
            @RequestParam(required = false) String preferredGender,
            @RequestParam(required = false) Integer minRent,
            @RequestParam(required = false) Integer maxRent,
            @RequestParam(required = false) Boolean verifiedOnly,
            @RequestParam(required = false, defaultValue = "reconfirmed") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        return ResponseEntity.ok(listingService.search(
                locality, listingType, roomType, furnishing, preferredGender,
                minRent, maxRent, verifiedOnly, sort, page, size
        ));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ListingResponse>> getRecent() {
        return ResponseEntity.ok(listingService.getRecentVacancies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getListingById(id));
    }

    @PostMapping
    public ResponseEntity<ListingResponse> createListing(@Valid @RequestBody ListingRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(listingService.createListing(request, user));
    }

    @PostMapping("/{id}/reconfirm")
    public ResponseEntity<ListingResponse> reconfirm(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(listingService.reconfirmAvailability(id, user));
    }

    @PostMapping("/{id}/occupied")
    public ResponseEntity<Map<String, String>> markOccupied(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        listingService.markOccupied(id, user);
        return ResponseEntity.ok(Map.of("message", "Listing marked as occupied"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        listingService.deleteListing(id, user);
        return ResponseEntity.ok(Map.of("message", "Listing deleted"));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> getMyListings() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(listingService.getMyListings(user));
    }
}
