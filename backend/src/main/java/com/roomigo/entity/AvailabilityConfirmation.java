package com.roomigo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "availability_confirmations")
public class AvailabilityConfirmation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "confirmed_by_user_id", nullable = false)
    private User confirmedByUser;

    @Column(nullable = false)
    private LocalDateTime confirmedAt;

    private LocalDateTime previousExpiryDate;

    @Column(nullable = false)
    private LocalDateTime newExpiryDate;

    @Column(nullable = false)
    private String method = "ONE_CLICK_MANUAL";

    public AvailabilityConfirmation() {}

    public AvailabilityConfirmation(Listing listing, User user, LocalDateTime prevExpiry, LocalDateTime newExpiry, String method) {
        this.listing = listing;
        this.confirmedByUser = user;
        this.confirmedAt = LocalDateTime.now();
        this.previousExpiryDate = prevExpiry;
        this.newExpiryDate = newExpiry;
        this.method = method;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }

    public User getConfirmedByUser() { return confirmedByUser; }
    public void setConfirmedByUser(User confirmedByUser) { this.confirmedByUser = confirmedByUser; }

    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }

    public LocalDateTime getPreviousExpiryDate() { return previousExpiryDate; }
    public void setPreviousExpiryDate(LocalDateTime previousExpiryDate) { this.previousExpiryDate = previousExpiryDate; }

    public LocalDateTime getNewExpiryDate() { return newExpiryDate; }
    public void setNewExpiryDate(LocalDateTime newExpiryDate) { this.newExpiryDate = newExpiryDate; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }
}
