package com.roomigo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "listings")
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "poster_id", nullable = false)
    private User poster;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType = ListingType.REPLACEMENT_FLATMATE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status = ListingStatus.PENDING_VERIFICATION;

    // Location details (approximate for privacy)
    @Column(nullable = false)
    private String locality; // Madhapur, Gachibowli, Kondapur, HITEC City, Kukatpally, Financial District, Gowlidoddy

    @Column(nullable = false)
    private String addressApproximate; // e.g. "Near Inorbit Mall, Mindspace IT Park"

    private String landmark;

    @Column(nullable = false)
    private String city = "Hyderabad";

    private String pinCode;

    private Double latitude;

    private Double longitude;

    // Transparent Financials
    @Column(nullable = false)
    private Integer rentAmount; // Monthly rent per flatmate

    @Column(nullable = false)
    private Integer depositAmount; // Security deposit required

    private Integer maintenanceAmount = 0; // Monthly maintenance if separate

    private Boolean utilitiesIncluded = false;

    private Integer utilitiesEstimate = 1200; // Estimated electricity + water + internet per person

    private String foodArrangement; // "Cook Available (Shared Cost)", "Self-Cook", "Mess/Tiffin", "Flexible"

    // Accommodation specs
    @Column(nullable = false)
    private String bhkType; // 2 BHK, 3 BHK, 4 BHK

    @Column(nullable = false)
    private String roomType; // Private Room, Master Bedroom with Attached Bath, Shared Room (2 Sharing)

    private Boolean attachedBathroom = true;

    private Boolean balcony = false;

    @Column(nullable = false)
    private String furnishing; // Fully Furnished, Semi Furnished, Unfurnished

    @Column(nullable = false)
    private String preferredGender; // Male, Female, Any

    private Integer currentFlatmatesCount = 2;

    private Integer totalRooms = 3;

    private Integer vacantRooms = 1;

    private LocalDate moveInDate;

    // Culture, Vibe & Rules
    @Column(columnDefinition = "TEXT")
    private String flatmateVibe; // "Software engineers working hybrid in HITEC City. Quiet weekdays, chill weekend board games."

    @Column(columnDefinition = "TEXT")
    private String amenities; // "High-speed Wi-Fi, AC, Washing Machine, Refrigerator, Power Backup, RO Water, Lift, Gated Security, Covered Parking"

    @Column(columnDefinition = "TEXT")
    private String houseRules; // "Non-smoking inside, visitors allowed with mutual notice, quiet hours after 11 PM"

    @Column(columnDefinition = "TEXT")
    private String photos; // JSON array or comma separated URLs

    // Verification & Reconfirmation
    @Column(nullable = false)
    private boolean verified = false;

    private LocalDateTime lastReconfirmedAt;

    private LocalDateTime expiryDate; // 7 days from last reconfirmation

    private Integer viewsCount = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Listing() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.lastReconfirmedAt == null) {
            this.lastReconfirmedAt = LocalDateTime.now();
        }
        if (this.expiryDate == null) {
            this.expiryDate = LocalDateTime.now().plusDays(7);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Check if listing has expired
    public boolean isExpired() {
        return expiryDate != null && expiryDate.isBefore(LocalDateTime.now());
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getPoster() { return poster; }
    public void setPoster(User poster) { this.poster = poster; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }

    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getAddressApproximate() { return addressApproximate; }
    public void setAddressApproximate(String addressApproximate) { this.addressApproximate = addressApproximate; }

    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPinCode() { return pinCode; }
    public void setPinCode(String pinCode) { this.pinCode = pinCode; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public Integer getRentAmount() { return rentAmount; }
    public void setRentAmount(Integer rentAmount) { this.rentAmount = rentAmount; }

    public Integer getDepositAmount() { return depositAmount; }
    public void setDepositAmount(Integer depositAmount) { this.depositAmount = depositAmount; }

    public Integer getMaintenanceAmount() { return maintenanceAmount; }
    public void setMaintenanceAmount(Integer maintenanceAmount) { this.maintenanceAmount = maintenanceAmount; }

    public Boolean getUtilitiesIncluded() { return utilitiesIncluded; }
    public void setUtilitiesIncluded(Boolean utilitiesIncluded) { this.utilitiesIncluded = utilitiesIncluded; }

    public Integer getUtilitiesEstimate() { return utilitiesEstimate; }
    public void setUtilitiesEstimate(Integer utilitiesEstimate) { this.utilitiesEstimate = utilitiesEstimate; }

    public String getFoodArrangement() { return foodArrangement; }
    public void setFoodArrangement(String foodArrangement) { this.foodArrangement = foodArrangement; }

    public String getBhkType() { return bhkType; }
    public void setBhkType(String bhkType) { this.bhkType = bhkType; }

    public String getRoomType() { return roomType; }
    public void setRoomType(String roomType) { this.roomType = roomType; }

    public Boolean getAttachedBathroom() { return attachedBathroom; }
    public void setAttachedBathroom(Boolean attachedBathroom) { this.attachedBathroom = attachedBathroom; }

    public Boolean getBalcony() { return balcony; }
    public void setBalcony(Boolean balcony) { this.balcony = balcony; }

    public String getFurnishing() { return furnishing; }
    public void setFurnishing(String furnishing) { this.furnishing = furnishing; }

    public String getPreferredGender() { return preferredGender; }
    public void setPreferredGender(String preferredGender) { this.preferredGender = preferredGender; }

    public Integer getCurrentFlatmatesCount() { return currentFlatmatesCount; }
    public void setCurrentFlatmatesCount(Integer currentFlatmatesCount) { this.currentFlatmatesCount = currentFlatmatesCount; }

    public Integer getTotalRooms() { return totalRooms; }
    public void setTotalRooms(Integer totalRooms) { this.totalRooms = totalRooms; }

    public Integer getVacantRooms() { return vacantRooms; }
    public void setVacantRooms(Integer vacantRooms) { this.vacantRooms = vacantRooms; }

    public LocalDate getMoveInDate() { return moveInDate; }
    public void setMoveInDate(LocalDate moveInDate) { this.moveInDate = moveInDate; }

    public String getFlatmateVibe() { return flatmateVibe; }
    public void setFlatmateVibe(String flatmateVibe) { this.flatmateVibe = flatmateVibe; }

    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }

    public String getHouseRules() { return houseRules; }
    public void setHouseRules(String houseRules) { this.houseRules = houseRules; }

    public String getPhotos() { return photos; }
    public void setPhotos(String photos) { this.photos = photos; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public LocalDateTime getLastReconfirmedAt() { return lastReconfirmedAt; }
    public void setLastReconfirmedAt(LocalDateTime lastReconfirmedAt) { this.lastReconfirmedAt = lastReconfirmedAt; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public Integer getViewsCount() { return viewsCount; }
    public void setViewsCount(Integer viewsCount) { this.viewsCount = viewsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
