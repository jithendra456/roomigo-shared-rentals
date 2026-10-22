package com.roomigo.service;

import com.roomigo.dto.EnquiryRequest;
import com.roomigo.entity.Enquiry;
import com.roomigo.entity.Listing;
import com.roomigo.entity.User;
import com.roomigo.repository.EnquiryRepository;
import com.roomigo.repository.ListingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final ListingRepository listingRepository;
    private final NotificationService notificationService;

    public EnquiryService(EnquiryRepository enquiryRepository,
                          ListingRepository listingRepository,
                          NotificationService notificationService) {
        this.enquiryRepository = enquiryRepository;
        this.listingRepository = listingRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Enquiry sendEnquiry(EnquiryRequest req, User sender) {
        Listing listing = listingRepository.findById(req.getListingId())
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + req.getListingId()));

        Enquiry enquiry = new Enquiry();
        enquiry.setListing(listing);
        enquiry.setSender(sender);
        enquiry.setRecipient(listing.getPoster());
        enquiry.setMessage(req.getMessage());
        enquiry.setSenderOccupation(req.getSenderOccupation() != null ? req.getSenderOccupation() : sender.getOccupation());
        enquiry.setMoveInDate(req.getMoveInDate());
        enquiry.setSenderPhone(req.getSenderPhone() != null ? req.getSenderPhone() : sender.getPhone());
        enquiry.setSenderEmail(sender.getEmail());
        enquiry.setStatus("NEW");

        enquiry = enquiryRepository.save(enquiry);

        // Notify poster
        notificationService.createNotification(
                listing.getPoster(),
                "New Enquiry for " + listing.getLocality(),
                sender.getName() + " sent an enquiry: \"" + req.getMessage() + "\"",
                "ENQUIRY_RECEIVED",
                "/enquiries"
        );

        return enquiry;
    }

    public List<Enquiry> getReceivedEnquiries(User user) {
        return enquiryRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
    }

    public List<Enquiry> getSentEnquiries(User user) {
        return enquiryRepository.findBySenderIdOrderByCreatedAtDesc(user.getId());
    }

    @Transactional
    public Enquiry replyEnquiry(Long enquiryId, String replyMessage, User user) {
        Enquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new IllegalArgumentException("Enquiry not found: " + enquiryId));

        if (!enquiry.getRecipient().getId().equals(user.getId())) {
            throw new org.springframework.security.access.AccessDeniedException("Unauthorized");
        }

        enquiry.setReply(replyMessage);
        enquiry.setStatus("REPLIED");
        enquiry.setRepliedAt(LocalDateTime.now());
        enquiry = enquiryRepository.save(enquiry);

        // Notify seeker
        notificationService.createNotification(
                enquiry.getSender(),
                "Reply to your Enquiry",
                user.getName() + " replied to your enquiry for " + enquiry.getListing().getLocality() + ": \"" + replyMessage + "\"",
                "ENQUIRY_REPLIED",
                "/enquiries"
        );

        return enquiry;
    }
}
