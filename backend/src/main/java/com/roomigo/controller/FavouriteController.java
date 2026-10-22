package com.roomigo.controller;

import com.roomigo.dto.ListingResponse;
import com.roomigo.entity.User;
import com.roomigo.service.AuthService;
import com.roomigo.service.FavouriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;
    private final AuthService authService;

    public FavouriteController(FavouriteService favouriteService, AuthService authService) {
        this.favouriteService = favouriteService;
        this.authService = authService;
    }

    @PostMapping("/{listingId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleFavourite(@PathVariable Long listingId) {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isFav = favouriteService.toggleFavourite(listingId, user);
        return ResponseEntity.ok(Map.of("listingId", listingId, "favourited", isFav));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> getMyFavourites() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(favouriteService.getMyFavourites(user));
    }

    @GetMapping("/{listingId}/check")
    public ResponseEntity<Map<String, Boolean>> checkFavourite(@PathVariable Long listingId) {
        User user = authService.getCurrentAuthenticatedUser();
        return ResponseEntity.ok(Map.of("favourited", favouriteService.isFavourite(listingId, user)));
    }
}
