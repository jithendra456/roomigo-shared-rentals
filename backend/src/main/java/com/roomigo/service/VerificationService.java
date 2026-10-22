package com.roomigo.service;

import com.roomigo.dto.RenterVerificationRequest;
import com.roomigo.entity.RenterVerification;
import com.roomigo.entity.User;
import com.roomigo.entity.VerificationStatus;
import com.roomigo.repository.RenterVerificationRepository;
import com.roomigo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class VerificationService {

    private final RenterVerificationRepository renterVerificationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public VerificationService(RenterVerificationRepository renterVerificationRepository,
                               UserRepository userRepository,
                               NotificationService notificationService) {
        this.renterVerificationRepository = renterVerificationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public RenterVerification submitRenterVerification(RenterVerificationRequest req, User user) {
        RenterVerification verification = renterVerificationRepository.findByUserId(user.getId())
                .orElse(new RenterVerification());

        verification.setUserId(user.getId());
        verification.setIdType(req.getIdType());
        verification.setIdNumberMasked(req.getIdNumberMasked());
        verification.setDocumentUrl(req.getDocumentUrl());
        verification.setCompanyOrCollege(req.getCompanyOrCollege());
        verification.setWorkEmail(req.getWorkEmail());
        verification.setLinkedinUrl(req.getLinkedinUrl());
        verification.setStatus(VerificationStatus.PENDING);
        verification.setSubmittedAt(LocalDateTime.now());

        verification = renterVerificationRepository.save(verification);

        user.setVerificationStatus(VerificationStatus.PENDING);
        userRepository.save(user);

        notificationService.createNotification(
                user,
                "Renter Verification Submitted",
                "Your identity/employment proof is under review. You will receive a verified renter badge once approved.",
                "VERIFICATION_PENDING",
                "/verification"
        );

        return verification;
    }

    public RenterVerification getMyVerification(User user) {
        return renterVerificationRepository.findByUserId(user.getId()).orElse(null);
    }

    public Map<String, Object> getVerificationInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("title", "Roomigo Verification System: Meaningful Trust for Shared Rentals");
        info.put("purpose", "When moving into a shared flat or replacing a flatmate, blind trust fails. Roomigo verifies both sides to prevent ghost listings, deposit scams, and unauthorized tenancies.");

        info.put("whatIsVerified", Map.of(
                "posterRelationship", "We confirm whether the poster is a current tenant, master leaseholder, or flat owner, ensuring they have the genuine authority or consent to offer a replacement.",
                "approximateLocation", "We cross-reference the building name, society gate, and landmark while shielding the exact flat number until a visit is accepted.",
                "transparentCosts", "We ensure rent, security deposit, maintenance, and utility splits are transparent with zero hidden brokerage.",
                "photoIntegrity", "We review authentic flat photos to reject stock photos and misrepresentations.",
                "renterProfiles", "For seekers, we verify phone numbers and optional employment/college credentials so existing tenants know who is coming to visit."
        ));

        info.put("sevenDayRule", "To prevent outdated listings, all vacancies auto-expire in 7 days unless reconfirmed with a single click. Every listing features a live timestamp like 'Reconfirmed 3 hours ago'.");

        info.put("reviewProcess", "Submissions are reviewed within 4 to 12 hours. If corrections are needed, you will receive an alert with specific feedback and can update your details immediately.");

        info.put("privacyGuarantee", "Government ID numbers are strictly masked (e.g. XXXX-XXXX-1234), and tenancy agreements or NOC documents are never exposed publicly—only verified badges are displayed.");

        return info;
    }
}
