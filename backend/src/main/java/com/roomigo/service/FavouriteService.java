package com.roomigo.service;

import com.roomigo.dto.ListingResponse;
import com.roomigo.entity.Favourite;
import com.roomigo.entity.Listing;
import com.roomigo.entity.User;
import com.roomigo.repository.FavouriteRepository;
import com.roomigo.repository.ListingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FavouriteService {

    private final FavouriteRepository favouriteRepository;
    private final ListingRepository listingRepository;
    private final ListingService listingService;

    public FavouriteService(FavouriteRepository favouriteRepository,
                            ListingRepository listingRepository,
                            ListingService listingService) {
        this.favouriteRepository = favouriteRepository;
        this.listingRepository = listingRepository;
        this.listingService = listingService;
    }

    @Transactional
    public boolean toggleFavourite(Long listingId, User user) {
        Optional<Favourite> existing = favouriteRepository.findByUserIdAndListingId(user.getId(), listingId);
        if (existing.isPresent()) {
            favouriteRepository.delete(existing.get());
            return false;
        } else {
            Listing listing = listingRepository.findById(listingId)
                    .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));
            favouriteRepository.save(new Favourite(user, listing));
            return true;
        }
    }

    public List<ListingResponse> getMyFavourites(User user) {
        List<Favourite> favourites = favouriteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return favourites.stream()
                .map(f -> listingService.enrichResponse(f.getListing()))
                .collect(Collectors.toList());
    }

    public boolean isFavourite(Long listingId, User user) {
        if (user == null) return false;
        return favouriteRepository.existsByUserIdAndListingId(user.getId(), listingId);
    }
}
