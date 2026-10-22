package com.roomigo.service;

import com.roomigo.dto.ListingRequest;
import com.roomigo.dto.ListingResponse;
import com.roomigo.entity.*;
import com.roomigo.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final ListingVerificationRepository listingVerificationRepository;
    private final AvailabilityConfirmationRepository availabilityConfirmationRepository;
    private final NotificationService notificationService;
    private final AuditLogRepository auditLogRepository;
    private final LocalityRepository localityRepository;

    public ListingService(ListingRepository listingRepository,
                          ListingVerificationRepository listingVerificationRepository,
                          AvailabilityConfirmationRepository availabilityConfirmationRepository,
                          NotificationService notificationService,
                          AuditLogRepository auditLogRepository,
                          LocalityRepository localityRepository) {
        this.listingRepository = listingRepository;
        this.listingVerificationRepository = listingVerificationRepository;
        this.availabilityConfirmationRepository = availabilityConfirmationRepository;
        this.notificationService = notificationService;
        this.auditLogRepository = auditLogRepository;
        this.localityRepository = localityRepository;
    }

    @Transactional
    public ListingResponse createListing(ListingRequest req, User poster) {
        Listing listing = new Listing();
        listing.setPoster(poster);
        listing.setTitle(req.getTitle());
        listing.setDescription(req.getDescription());
        listing.setListingType(req.getListingType() != null ? req.getListingType() : ListingType.REPLACEMENT_FLATMATE);
        listing.setStatus(ListingStatus.PENDING_VERIFICATION); // Requires review to prevent fake/unauthorized replacement posts

        listing.setLocality(req.getLocality().trim());
        listing.setAddressApproximate(req.getAddressApproximate());
        listing.setLandmark(req.getLandmark());
        listing.setCity("Hyderabad");
        listing.setPinCode(req.getPinCode());
        listing.setLatitude(req.getLatitude());
        listing.setLongitude(req.getLongitude());

        listing.setRentAmount(req.getRentAmount());
        listing.setDepositAmount(req.getDepositAmount());
        listing.setMaintenanceAmount(req.getMaintenanceAmount() != null ? req.getMaintenanceAmount() : 0);
        listing.setUtilitiesIncluded(req.getUtilitiesIncluded() != null ? req.getUtilitiesIncluded() : false);
        listing.setUtilitiesEstimate(req.getUtilitiesEstimate() != null ? req.getUtilitiesEstimate() : 1200);
        listing.setFoodArrangement(req.getFoodArrangement());

        listing.setBhkType(req.getBhkType());
        listing.setRoomType(req.getRoomType());
        listing.setAttachedBathroom(req.getAttachedBathroom() != null ? req.getAttachedBathroom() : true);
        listing.setBalcony(req.getBalcony() != null ? req.getBalcony() : false);
        listing.setFurnishing(req.getFurnishing());
        listing.setPreferredGender(req.getPreferredGender());
        listing.setCurrentFlatmatesCount(req.getCurrentFlatmatesCount() != null ? req.getCurrentFlatmatesCount() : 2);
        listing.setTotalRooms(req.getTotalRooms() != null ? req.getTotalRooms() : 3);
        listing.setVacantRooms(req.getVacantRooms() != null ? req.getVacantRooms() : 1);
        listing.setMoveInDate(req.getMoveInDate());

        listing.setFlatmateVibe(req.getFlatmateVibe());
        listing.setAmenities(req.getAmenities());
        listing.setHouseRules(req.getHouseRules());
        listing.setPhotos(req.getPhotos());

        listing.setVerified(false);
        listing.setLastReconfirmedAt(LocalDateTime.now());
        listing.setExpiryDate(LocalDateTime.now().plusDays(7));
        listing.setViewsCount(0);

        listing = listingRepository.save(listing);

        // Create Listing Verification queue record
        ListingVerification verification = new ListingVerification();
        verification.setListing(listing);
        verification.setPosterRelationship(req.getPosterRelationship());
        verification.setAuthorityProofType(req.getAuthorityProofType());
        verification.setDocumentUrl(req.getAuthorityDocumentUrl());
        verification.setStatus(VerificationStatus.PENDING);
        verification.setApproxLocationVerified(false);
        verification.setRentVerified(false);
        verification.setPhotosVerified(false);
        verification.setRulesVerified(false);
        listingVerificationRepository.save(verification);

        // Audit Log
        auditLogRepository.save(new AuditLog(
                poster.getId(),
                poster.getEmail(),
                "CREATE_LISTING_SUBMITTED",
                "LISTING",
                listing.getId(),
                "Created vacancy in " + listing.getLocality() + " with authority proof: " + req.getAuthorityProofType()
        ));

        // Notify Poster
        notificationService.createNotification(
                poster,
                "Listing Submitted for Verification",
                "Your vacancy at " + listing.getLocality() + " has been submitted. Our team is verifying your tenancy details to keep Roomigo fake-free.",
                "LISTING_SUBMITTED",
                "/listings/" + listing.getId()
        );

        return enrichResponse(listing);
    }

    public Page<ListingResponse> search(
            String locality,
            ListingType listingType,
            String roomType,
            String furnishing,
            String preferredGender,
            Integer minRent,
            Integer maxRent,
            Boolean verifiedOnly,
            String sortOption,
            int page,
            int size) {

        // Auto expire listings before search
        expireOutdatedListingsInternal();

        Sort sort = Sort.by(Sort.Direction.DESC, "lastReconfirmedAt");
        if ("rent_asc".equalsIgnoreCase(sortOption)) {
            sort = Sort.by(Sort.Direction.ASC, "rentAmount");
        } else if ("rent_desc".equalsIgnoreCase(sortOption)) {
            sort = Sort.by(Sort.Direction.DESC, "rentAmount");
        } else if ("recent".equalsIgnoreCase(sortOption)) {
            sort = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Listing> pageResult = listingRepository.searchListings(
                ListingStatus.ACTIVE,
                (locality != null && !locality.trim().isEmpty()) ? locality.trim() : null,
                listingType,
                (roomType != null && !roomType.trim().isEmpty()) ? roomType.trim() : null,
                (furnishing != null && !furnishing.trim().isEmpty()) ? furnishing.trim() : null,
                (preferredGender != null && !preferredGender.trim().isEmpty()) ? preferredGender.trim() : null,
                minRent,
                maxRent,
                verifiedOnly,
                pageable
        );

        return pageResult.map(this::enrichResponse);
    }

    public List<ListingResponse> getRecentVacancies() {
        expireOutdatedListingsInternal();
        List<Listing> list = listingRepository.findActiveAndFreshListings(LocalDateTime.now());
        return list.stream().limit(8).map(this::enrichResponse).collect(Collectors.toList());
    }

    @Transactional
    public ListingResponse getListingById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + id));

        listing.setViewsCount(listing.getViewsCount() + 1);
        listingRepository.save(listing);

        return enrichResponse(listing);
    }

    @Transactional
    public ListingResponse reconfirmAvailability(Long listingId, User user) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + listingId));

        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;
        boolean isPoster = listing.getPoster().getId().equals(user.getId());

        if (!isAdmin && !isPoster) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized to reconfirm this listing");
        }

        LocalDateTime prevExpiry = listing.getExpiryDate();
        LocalDateTime newExpiry = LocalDateTime.now().plusDays(7);

        listing.setLastReconfirmedAt(LocalDateTime.now());
        listing.setExpiryDate(newExpiry);

        if (listing.getStatus() == ListingStatus.EXPIRED) {
            listing.setStatus(ListingStatus.ACTIVE);
        }

        listing = listingRepository.save(listing);

        availabilityConfirmationRepository.save(new AvailabilityConfirmation(
                listing,
                user,
                prevExpiry,
                newExpiry,
                "ONE_CLICK_MANUAL"
        ));

        auditLogRepository.save(new AuditLog(
                user.getId(),
                user.getEmail(),
                "RECONFIRM_AVAILABILITY",
                "LISTING",
                listing.getId(),
                "Extended vacancy validity for 7 days until " + newExpiry
        ));

        notificationService.createNotification(
                listing.getPoster(),
                "Vacancy Reconfirmed",
                "Your listing at " + listing.getLocality() + " has been reconfirmed and will remain active for 7 days.",
                "RECONFIRMED",
                "/listings/" + listing.getId()
        );

        return enrichResponse(listing);
    }

    public List<ListingResponse> getMyListings(User poster) {
        List<Listing> list = listingRepository.findByPosterIdOrderByCreatedAtDesc(poster.getId());
        return list.stream().map(this::enrichResponse).collect(Collectors.toList());
    }

    @Transactional
    public void markOccupied(Long listingId, User user) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));

        if (!listing.getPoster().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }

        listing.setStatus(ListingStatus.OCCUPIED);
        listingRepository.save(listing);

        auditLogRepository.save(new AuditLog(
                user.getId(),
                user.getEmail(),
                "MARK_OCCUPIED",
                "LISTING",
                listing.getId(),
                "Vacancy filled/occupied"
        ));
    }

    @Transactional
    public void deleteListing(Long listingId, User user) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + listingId));

        if (!listing.getPoster().getId().equals(user.getId()) && user.getRole() != Role.ROLE_ADMIN) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }

        listingRepository.delete(listing);
    }

    public void expireOutdatedListingsInternal() {
        List<Listing> expiredList = listingRepository.findExpiredListings(LocalDateTime.now());
        for (Listing l : expiredList) {
            l.setStatus(ListingStatus.EXPIRED);
            listingRepository.save(l);

            notificationService.createNotification(
                    l.getPoster(),
                    "Listing Expired: Please Reconfirm",
                    "Your listing at " + l.getLocality() + " has expired after 7 days. Reconfirm availability with one click to reactivate it.",
                    "LISTING_EXPIRED",
                    "/my-listings"
            );
        }
    }

    public ListingResponse enrichResponse(Listing listing) {
        ListingResponse res = ListingResponse.fromEntity(listing);
        listingVerificationRepository.findByListingId(listing.getId()).ifPresent(v -> {
            res.setPosterRelationship(v.getPosterRelationship());
            res.setLocationVerified(v.getApproxLocationVerified());
            res.setRentVerified(v.getRentVerified());
            res.setPhotosVerified(v.getPhotosVerified());
            res.setRulesVerified(v.getRulesVerified());
        });
        return res;
    }
}
