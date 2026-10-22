package com.roomigo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "listing_verifications")
public class ListingVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "listing_id", nullable = false, unique = true)
    private Listing listing;

    @Column(nullable = false)
    private String posterRelationship; // Current Tenant Moving Out, Remaining Flatmate, Master Tenant on Lease, Owner

    @Column(nullable = false)
    private String authorityProofType; // Rental Agreement / Co-tenant clause, Landlord Written NOC, Society Maintenance Bill

    private String documentUrl; // Uploaded tenancy proof / NOC (kept confidential for admin only)

    @Column(nullable = false)
    private Boolean approxLocationVerified = false;

    @Column(nullable = false)
    private Boolean rentVerified = false;

    @Column(nullable = false)
    private Boolean photosVerified = false;

    @Column(nullable = false)
    private Boolean rulesVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status = VerificationStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String adminNotes;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    private LocalDateTime reviewedAt;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public ListingVerification() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }

    public String getPosterRelationship() { return posterRelationship; }
    public void setPosterRelationship(String posterRelationship) { this.posterRelationship = posterRelationship; }

    public String getAuthorityProofType() { return authorityProofType; }
    public void setAuthorityProofType(String authorityProofType) { this.authorityProofType = authorityProofType; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public Boolean getApproxLocationVerified() { return approxLocationVerified; }
    public void setApproxLocationVerified(Boolean approxLocationVerified) { this.approxLocationVerified = approxLocationVerified; }

    public Boolean getRentVerified() { return rentVerified; }
    public void setRentVerified(Boolean rentVerified) { this.rentVerified = rentVerified; }

    public Boolean getPhotosVerified() { return photosVerified; }
    public void setPhotosVerified(Boolean photosVerified) { this.photosVerified = photosVerified; }

    public Boolean getRulesVerified() { return rulesVerified; }
    public void setRulesVerified(Boolean rulesVerified) { this.rulesVerified = rulesVerified; }

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
