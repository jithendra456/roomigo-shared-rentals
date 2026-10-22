package com.roomigo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "renter_verifications")
public class RenterVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    private String idType; // AADHAAR, PAN, PASSPORT, EMPLOYEE_ID, STUDENT_ID

    private String idNumberMasked; // e.g. "XXXX-XXXX-4921"

    private String documentUrl; // Stored securely for admin review only

    private String companyOrCollege;

    private String workEmail;

    private String linkedinUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status = VerificationStatus.NOT_STARTED;

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    private Long reviewedByUserId;

    private LocalDateTime submittedAt;

    private LocalDateTime reviewedAt;

    public RenterVerification() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getIdType() { return idType; }
    public void setIdType(String idType) { this.idType = idType; }

    public String getIdNumberMasked() { return idNumberMasked; }
    public void setIdNumberMasked(String idNumberMasked) { this.idNumberMasked = idNumberMasked; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getCompanyOrCollege() { return companyOrCollege; }
    public void setCompanyOrCollege(String companyOrCollege) { this.companyOrCollege = companyOrCollege; }

    public String getWorkEmail() { return workEmail; }
    public void setWorkEmail(String workEmail) { this.workEmail = workEmail; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public Long getReviewedByUserId() { return reviewedByUserId; }
    public void setReviewedByUserId(Long reviewedByUserId) { this.reviewedByUserId = reviewedByUserId; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
}
