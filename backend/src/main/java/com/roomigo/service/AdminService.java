package com.roomigo.service;

import com.roomigo.dto.AdminStatsResponse;
import com.roomigo.dto.ListingVerificationReviewRequest;
import com.roomigo.entity.*;
import com.roomigo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    private final ListingRepository listingRepository;
    private final ListingVerificationRepository listingVerificationRepository;
    private final RenterVerificationRepository renterVerificationRepository;
    private final UserRepository userRepository;
    private final EnquiryRepository enquiryRepository;
    private final VisitRequestRepository visitRequestRepository;
    private final UserReportRepository userReportRepository;
    private final LocalityRepository localityRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    public AdminService(ListingRepository listingRepository,
                        ListingVerificationRepository listingVerificationRepository,
                        RenterVerificationRepository renterVerificationRepository,
                        UserRepository userRepository,
                        EnquiryRepository enquiryRepository,
                        VisitRequestRepository visitRequestRepository,
                        UserReportRepository userReportRepository,
                        LocalityRepository localityRepository,
                        AuditLogRepository auditLogRepository,
                        NotificationService notificationService) {
        this.listingRepository = listingRepository;
        this.listingVerificationRepository = listingVerificationRepository;
        this.renterVerificationRepository = renterVerificationRepository;
        this.userRepository = userRepository;
        this.enquiryRepository = enquiryRepository;
        this.visitRequestRepository = visitRequestRepository;
        this.userReportRepository = userReportRepository;
        this.localityRepository = localityRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
    }

    public AdminStatsResponse getStats() {
        long totalListings = listingRepository.count();
        long activeListings = listingRepository.countByStatus(ListingStatus.ACTIVE);
        long pendingVerifications = listingVerificationRepository.countByStatus(VerificationStatus.PENDING);
        long expiredListings = listingRepository.countByStatus(ListingStatus.EXPIRED);
        long totalUsers = userRepository.count();
        long totalEnquiries = enquiryRepository.count();
        long totalVisits = visitRequestRepository.count();
        long pendingReports = userReportRepository.countByStatus("PENDING");
        long verifiedRentersCount = userRepository.findAll().stream()
                .filter(u -> u.getVerificationStatus() == VerificationStatus.VERIFIED).count();

        return new AdminStatsResponse(
                totalListings,
                activeListings,
                pendingVerifications,
                expiredListings,
                totalUsers,
                totalEnquiries,
                totalVisits,
                pendingReports,
                verifiedRentersCount
        );
    }

    public List<ListingVerification> getPendingListingVerifications() {
        return listingVerificationRepository.findByStatusOrderByCreatedAtDesc(VerificationStatus.PENDING);
    }

    @Transactional
    public ListingVerification reviewListingVerification(Long verificationId, ListingVerificationReviewRequest review, User admin) {
        ListingVerification verification = listingVerificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Verification record not found: " + verificationId));

        Listing listing = verification.getListing();

        verification.setStatus(review.getStatus());
        verification.setApproxLocationVerified(review.getApproxLocationVerified() != null ? review.getApproxLocationVerified() : true);
        verification.setRentVerified(review.getRentVerified() != null ? review.getRentVerified() : true);
        verification.setPhotosVerified(review.getPhotosVerified() != null ? review.getPhotosVerified() : true);
        verification.setRulesVerified(review.getRulesVerified() != null ? review.getRulesVerified() : true);
        verification.setAdminNotes(review.getAdminNotes());
        verification.setRejectionReason(review.getRejectionReason());
        verification.setReviewer(admin);
        verification.setReviewedAt(LocalDateTime.now());

        if (review.getStatus() == VerificationStatus.APPROVED) {
            listing.setVerified(true);
            listing.setStatus(ListingStatus.ACTIVE);
            listing.setLastReconfirmedAt(LocalDateTime.now());
            listing.setExpiryDate(LocalDateTime.now().plusDays(7));
            listingRepository.save(listing);

            notificationService.createNotification(
                    listing.getPoster(),
                    "Listing Verified & Published!",
                    "Your shared vacancy at " + listing.getLocality() + " has been verified and is now live for seekers.",
                    "LISTING_APPROVED",
                    "/listings/" + listing.getId()
            );
        } else if (review.getStatus() == VerificationStatus.REJECTED) {
            listing.setStatus(ListingStatus.REJECTED);
            listingRepository.save(listing);

            notificationService.createNotification(
                    listing.getPoster(),
                    "Listing Needs Attention / Rejected",
                    "Your listing at " + listing.getLocality() + " was rejected: " +
                            (review.getRejectionReason() != null ? review.getRejectionReason() : "Please update verification documents."),
                    "LISTING_REJECTED",
                    "/my-listings"
            );
        }

        auditLogRepository.save(new AuditLog(
                admin.getId(),
                admin.getEmail(),
                "REVIEW_LISTING_" + review.getStatus().name(),
                "LISTING",
                listing.getId(),
                "Admin reviewed verification: " + review.getStatus() + ". Notes: " + review.getAdminNotes()
        ));

        return listingVerificationRepository.save(verification);
    }

    public List<RenterVerification> getPendingRenterVerifications() {
        return renterVerificationRepository.findByStatusOrderBySubmittedAtDesc(VerificationStatus.PENDING);
    }

    @Transactional
    public RenterVerification reviewRenterVerification(Long verificationId, VerificationStatus status, String adminNotes, String rejectionReason, User admin) {
        RenterVerification verification = renterVerificationRepository.findById(verificationId)
                .orElseThrow(() -> new IllegalArgumentException("Renter verification not found: " + verificationId));

        verification.setStatus(status);
        verification.setAdminNotes(adminNotes);
        verification.setRejectionReason(rejectionReason);
        verification.setReviewedByUserId(admin.getId());
        verification.setReviewedAt(LocalDateTime.now());

        userRepository.findById(verification.getUserId()).ifPresent(u -> {
            u.setVerificationStatus(status);
            if (status == VerificationStatus.VERIFIED) {
                u.setIdVerified(true);
                notificationService.createNotification(
                        u,
                        "Profile Verified!",
                        "Your renter profile has been verified! You now carry a verified trust badge on all flatmate enquiries.",
                        "RENTER_VERIFIED",
                        "/profile"
                );
            } else if (status == VerificationStatus.REJECTED) {
                notificationService.createNotification(
                        u,
                        "Verification Rejected",
                        "Your verification was not approved: " + rejectionReason,
                        "RENTER_REJECTED",
                        "/verification"
                );
            }
            userRepository.save(u);
        });

        auditLogRepository.save(new AuditLog(
                admin.getId(),
                admin.getEmail(),
                "REVIEW_RENTER_VERIFICATION_" + status.name(),
                "USER",
                verification.getUserId(),
                "Admin reviewed renter verification with status: " + status
        ));

        return renterVerificationRepository.save(verification);
    }

    public List<UserReport> getAllReports() {
        return userReportRepository.findAll();
    }

    @Transactional
    public UserReport resolveReport(Long reportId, String action, String notes, User admin) {
        UserReport report = userReportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found: " + reportId));

        report.setStatus("RESOLVED");
        report.setAdminAction(action + " - Notes: " + notes);
        report.setResolvedBy(admin);
        report.setResolvedAt(LocalDateTime.now());

        if ("TAKE_DOWN_LISTING".equalsIgnoreCase(action)) {
            Listing listing = report.getListing();
            listing.setStatus(ListingStatus.REJECTED);
            listingRepository.save(listing);

            notificationService.createNotification(
                    listing.getPoster(),
                    "Listing Taken Down",
                    "Your vacancy at " + listing.getLocality() + " has been unlisted following a user dispute / policy report: " + notes,
                    "LISTING_REJECTED",
                    "/my-listings"
            );
        }

        auditLogRepository.save(new AuditLog(
                admin.getId(),
                admin.getEmail(),
                "RESOLVE_REPORT",
                "USER_REPORT",
                report.getId(),
                "Resolved report on listing #" + report.getListing().getId() + " with action: " + action
        ));

        return userReportRepository.save(report);
    }

    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findTop50ByOrderByCreatedAtDesc();
    }

    public List<Locality> getLocalities() {
        return localityRepository.findByCityOrderByActiveListingsCountDesc("Hyderabad");
    }

    @Transactional
    public Locality saveLocality(Locality locality, User admin) {
        Locality saved = localityRepository.save(locality);
        auditLogRepository.save(new AuditLog(
                admin.getId(),
                admin.getEmail(),
                "SAVE_LOCALITY",
                "LOCALITY",
                saved.getId(),
                "Saved locality: " + saved.getName()
        ));
        return saved;
    }
}
