package com.roomigo.service;

import com.roomigo.dto.UserReportRequest;
import com.roomigo.entity.AuditLog;
import com.roomigo.entity.Listing;
import com.roomigo.entity.User;
import com.roomigo.entity.UserReport;
import com.roomigo.repository.AuditLogRepository;
import com.roomigo.repository.ListingRepository;
import com.roomigo.repository.UserReportRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserReportService {

    private final UserReportRepository userReportRepository;
    private final ListingRepository listingRepository;
    private final AuditLogRepository auditLogRepository;

    public UserReportService(UserReportRepository userReportRepository,
                             ListingRepository listingRepository,
                             AuditLogRepository auditLogRepository) {
        this.userReportRepository = userReportRepository;
        this.listingRepository = listingRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public UserReport submitReport(UserReportRequest req, User reporter) {
        Listing listing = listingRepository.findById(req.getListingId())
                .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + req.getListingId()));

        UserReport report = new UserReport();
        report.setListing(listing);
        report.setReporter(reporter);
        report.setReasonCategory(req.getReasonCategory());
        report.setDescription(req.getDescription());
        report.setStatus("PENDING");

        report = userReportRepository.save(report);

        auditLogRepository.save(new AuditLog(
                reporter.getId(),
                reporter.getEmail(),
                "REPORT_LISTING",
                "LISTING",
                listing.getId(),
                "Reported listing for: " + req.getReasonCategory() + " (" + req.getDescription() + ")"
        ));

        return report;
    }

    public List<UserReport> getAllPendingReports() {
        return userReportRepository.findByStatusOrderByCreatedAtDesc("PENDING");
    }
}
