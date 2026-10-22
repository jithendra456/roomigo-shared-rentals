package com.roomigo.dto;

import com.roomigo.entity.Listing;
import com.roomigo.entity.ListingStatus;
import com.roomigo.entity.ListingType;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ListingResponse {
    private Long id;
    private String title;
    private String description;
    private ListingType listingType;
    private ListingStatus status;

    private String locality;
    private String addressApproximate;
    private String landmark;
    private String city;
    private String pinCode;
    private Double latitude;
    private Double longitude;

    private Integer rentAmount;
    private Integer depositAmount;
    private Integer maintenanceAmount;
    private Boolean utilitiesIncluded;
    private Integer utilitiesEstimate;
    private String foodArrangement;

    private String bhkType;
    private String roomType;
    private Boolean attachedBathroom;
    private Boolean balcony;
    private String furnishing;
    private String preferredGender;
    private Integer currentFlatmatesCount;
    private Integer totalRooms;
    private Integer vacantRooms;
    private LocalDate moveInDate;

    private String flatmateVibe;
    private String amenities;
    private String houseRules;
    private String photos;

    private boolean verified;
    private LocalDateTime lastReconfirmedAt;
    private LocalDateTime expiryDate;
    private Integer viewsCount;
    private LocalDateTime createdAt;

    // Computed / Trust badges
    private String reconfirmedTimeAgo;
    private boolean fresh;
    private boolean expiringSoon;
    private boolean expired;
    private long daysRemaining;

    // Poster Info
    private Long posterId;
    private String posterName;
    private String posterEmail;
    private String posterPhone;
    private String posterOccupation;
    private String posterCompany;
    private String posterAvatarUrl;
    private boolean posterPhoneVerified;
    private boolean posterIdVerified;

    // Verification summary (if verified)
    private String posterRelationship;
    private Boolean locationVerified;
    private Boolean rentVerified;
    private Boolean photosVerified;
    private Boolean rulesVerified;

    public ListingResponse() {}

    public static ListingResponse fromEntity(Listing l) {
        ListingResponse res = new ListingResponse();
        res.setId(l.getId());
        res.setTitle(l.getTitle());
        res.setDescription(l.getDescription());
        res.setListingType(l.getListingType());
        res.setStatus(l.getStatus());

        res.setLocality(l.getLocality());
        res.setAddressApproximate(l.getAddressApproximate());
        res.setLandmark(l.getLandmark());
        res.setCity(l.getCity());
        res.setPinCode(l.getPinCode());
        res.setLatitude(l.getLatitude());
        res.setLongitude(l.getLongitude());

        res.setRentAmount(l.getRentAmount());
        res.setDepositAmount(l.getDepositAmount());
        res.setMaintenanceAmount(l.getMaintenanceAmount());
        res.setUtilitiesIncluded(l.getUtilitiesIncluded());
        res.setUtilitiesEstimate(l.getUtilitiesEstimate());
        res.setFoodArrangement(l.getFoodArrangement());

        res.setBhkType(l.getBhkType());
        res.setRoomType(l.getRoomType());
        res.setAttachedBathroom(l.getAttachedBathroom());
        res.setBalcony(l.getBalcony());
        res.setFurnishing(l.getFurnishing());
        res.setPreferredGender(l.getPreferredGender());
        res.setCurrentFlatmatesCount(l.getCurrentFlatmatesCount());
        res.setTotalRooms(l.getTotalRooms());
        res.setVacantRooms(l.getVacantRooms());
        res.setMoveInDate(l.getMoveInDate());

        res.setFlatmateVibe(l.getFlatmateVibe());
        res.setAmenities(l.getAmenities());
        res.setHouseRules(l.getHouseRules());
        res.setPhotos(l.getPhotos());

        res.setVerified(l.isVerified());
        res.setLastReconfirmedAt(l.getLastReconfirmedAt());
        res.setExpiryDate(l.getExpiryDate());
        res.setViewsCount(l.getViewsCount());
        res.setCreatedAt(l.getCreatedAt());

        // Relative time calculation
        LocalDateTime now = LocalDateTime.now();
        if (l.getLastReconfirmedAt() != null) {
            Duration diff = Duration.between(l.getLastReconfirmedAt(), now);
            long hours = diff.toHours();
            if (hours < 1) {
                res.setReconfirmedTimeAgo("Just now");
            } else if (hours < 24) {
                res.setReconfirmedTimeAgo(hours + " hours ago");
            } else {
                long days = diff.toDays();
                res.setReconfirmedTimeAgo(days == 1 ? "Yesterday" : days + " days ago");
            }
            res.setFresh(hours <= 48);
        } else {
            res.setReconfirmedTimeAgo("Recently");
            res.setFresh(true);
        }

        if (l.getExpiryDate() != null) {
            res.setExpired(now.isAfter(l.getExpiryDate()));
            Duration left = Duration.between(now, l.getExpiryDate());
            res.setDaysRemaining(Math.max(0, left.toDays()));
            res.setExpiringSoon(!res.isExpired() && left.toHours() <= 24);
        }

        if (l.getPoster() != null) {
            res.setPosterId(l.getPoster().getId());
            res.setPosterName(l.getPoster().getName());
            res.setPosterEmail(l.getPoster().getEmail());
            res.setPosterPhone(l.getPoster().getPhone());
            res.setPosterOccupation(l.getPoster().getOccupation());
            res.setPosterCompany(l.getPoster().getCompanyOrCollege());
            res.setPosterAvatarUrl(l.getPoster().getAvatarUrl());
            res.setPosterPhoneVerified(l.getPoster().isPhoneVerified());
            res.setPosterIdVerified(l.getPoster().isIdVerified());
        }

        return res;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getReconfirmedTimeAgo() { return reconfirmedTimeAgo; }
    public void setReconfirmedTimeAgo(String reconfirmedTimeAgo) { this.reconfirmedTimeAgo = reconfirmedTimeAgo; }

    public boolean isFresh() { return fresh; }
    public void setFresh(boolean fresh) { this.fresh = fresh; }

    public boolean isExpiringSoon() { return expiringSoon; }
    public void setExpiringSoon(boolean expiringSoon) { this.expiringSoon = expiringSoon; }

    public boolean isExpired() { return expired; }
    public void setExpired(boolean expired) { this.expired = expired; }

    public long getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(long daysRemaining) { this.daysRemaining = daysRemaining; }

    public Long getPosterId() { return posterId; }
    public void setPosterId(Long posterId) { this.posterId = posterId; }

    public String getPosterName() { return posterName; }
    public void setPosterName(String posterName) { this.posterName = posterName; }

    public String getPosterEmail() { return posterEmail; }
    public void setPosterEmail(String posterEmail) { this.posterEmail = posterEmail; }

    public String getPosterPhone() { return posterPhone; }
    public void setPosterPhone(String posterPhone) { this.posterPhone = posterPhone; }

    public String getPosterOccupation() { return posterOccupation; }
    public void setPosterOccupation(String posterOccupation) { this.posterOccupation = posterOccupation; }

    public String getPosterCompany() { return posterCompany; }
    public void setPosterCompany(String posterCompany) { this.posterCompany = posterCompany; }

    public String getPosterAvatarUrl() { return posterAvatarUrl; }
    public void setPosterAvatarUrl(String posterAvatarUrl) { this.posterAvatarUrl = posterAvatarUrl; }

    public boolean isPosterPhoneVerified() { return posterPhoneVerified; }
    public void setPosterPhoneVerified(boolean posterPhoneVerified) { this.posterPhoneVerified = posterPhoneVerified; }

    public boolean isPosterIdVerified() { return posterIdVerified; }
    public void setPosterIdVerified(boolean posterIdVerified) { this.posterIdVerified = posterIdVerified; }

    public String getPosterRelationship() { return posterRelationship; }
    public void setPosterRelationship(String posterRelationship) { this.posterRelationship = posterRelationship; }

    public Boolean getLocationVerified() { return locationVerified; }
    public void setLocationVerified(Boolean locationVerified) { this.locationVerified = locationVerified; }

    public Boolean getRentVerified() { return rentVerified; }
    public void setRentVerified(Boolean rentVerified) { this.rentVerified = rentVerified; }

    public Boolean getPhotosVerified() { return photosVerified; }
    public void setPhotosVerified(Boolean photosVerified) { this.photosVerified = photosVerified; }

    public Boolean getRulesVerified() { return rulesVerified; }
    public void setRulesVerified(Boolean rulesVerified) { this.rulesVerified = rulesVerified; }
}
