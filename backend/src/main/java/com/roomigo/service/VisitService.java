package com.roomigo.service;

import com.roomigo.dto.VisitRequestDto;
import com.roomigo.dto.VisitStatusUpdateRequest;
import com.roomigo.entity.Listing;
import com.roomigo.entity.User;
import com.roomigo.entity.VisitRequest;
import com.roomigo.repository.ListingRepository;
import com.roomigo.repository.VisitRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VisitService {

    private final VisitRequestRepository visitRequestRepository;
    private final ListingRepository listingRepository;
    private final NotificationService notificationService;

    public VisitService(VisitRequestRepository visitRequestRepository,
                        ListingRepository listingRepository,
                        NotificationService notificationService) {
        this.visitRequestRepository = visitRequestRepository;
        this.listingRepository = listingRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public VisitRequest requestVisit(VisitRequestDto dto, User requester) {
        Listing listing = listingRepository.findById(dto.getListingId())
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + dto.getListingId()));

        VisitRequest visit = new VisitRequest();
        visit.setListing(listing);
        visit.setRequester(requester);
        visit.setPoster(listing.getPoster());
        visit.setPreferredDate(dto.getPreferredDate());
        visit.setTimeSlot(dto.getTimeSlot());
        visit.setVisitType(dto.getVisitType() != null ? dto.getVisitType() : "IN_PERSON");
        visit.setNotes(dto.getNotes());
        visit.setStatus("PENDING");

        visit = visitRequestRepository.save(visit);

        // Notify poster
        notificationService.createNotification(
                listing.getPoster(),
                "New Visit Request: " + listing.getLocality(),
                requester.getName() + " requested a " + visit.getVisitType().toLowerCase().replace('_', ' ') +
                        " visit on " + dto.getPreferredDate() + " (" + dto.getTimeSlot() + ").",
                "VISIT_REQUESTED",
                "/visits"
        );

        return visit;
    }

    public List<VisitRequest> getPosterVisits(User poster) {
        return visitRequestRepository.findByPosterIdOrderByCreatedAtDesc(poster.getId());
    }

    public List<VisitRequest> getRequesterVisits(User requester) {
        return visitRequestRepository.findByRequesterIdOrderByCreatedAtDesc(requester.getId());
    }

    @Transactional
    public VisitRequest updateVisitStatus(Long visitId, VisitStatusUpdateRequest update, User user) {
        VisitRequest visit = visitRequestRepository.findById(visitId)
                .orElseThrow(() -> new IllegalArgumentException("Visit request not found: " + visitId));

        boolean isPoster = visit.getPoster().getId().equals(user.getId());
        boolean isRequester = visit.getRequester().getId().equals(user.getId());

        if (!isPoster && !isRequester) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }

        visit.setStatus(update.getStatus().toUpperCase());
        if (update.getPosterResponseNote() != null) {
            visit.setPosterResponseNote(update.getPosterResponseNote());
        }

        visit = visitRequestRepository.save(visit);

        // Notify opposite party
        User recipient = isPoster ? visit.getRequester() : visit.getPoster();
        String statusText = visit.getStatus().toLowerCase();
        notificationService.createNotification(
                recipient,
                "Visit Request " + visit.getStatus(),
                "Your visit request for " + visit.getListing().getLocality() + " on " +
                        visit.getPreferredDate() + " was " + statusText + (visit.getPosterResponseNote() != null ? ": \"" + visit.getPosterResponseNote() + "\"" : "."),
                "VISIT_UPDATED",
                "/visits"
        );

        return visit;
    }
}
