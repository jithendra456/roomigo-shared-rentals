package com.roomigo.dto;

import com.roomigo.entity.ListingType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class ListingRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Listing type is required")
    private ListingType listingType = ListingType.REPLACEMENT_FLATMATE;

    @NotBlank(message = "Locality is required")
    private String locality; // Madhapur, Gachibowli, Kondapur, HITEC City, Kukatpally, etc.

    @NotBlank(message = "Approximate address is required")
    private String addressApproximate;

    private String landmark;
    private String city = "Hyderabad";
    private String pinCode;
    private Double latitude;
    private Double longitude;

    @NotNull(message = "Rent amount is required")
    @Min(value = 1000, message = "Rent must be at least ₹1000")
    private Integer rentAmount;

    @NotNull(message = "Deposit amount is required")
    @Min(value = 0, message = "Deposit cannot be negative")
    private Integer depositAmount;

    private Integer maintenanceAmount = 0;
    private Boolean utilitiesIncluded = false;
    private Integer utilitiesEstimate = 1200;
    private String foodArrangement;

    @NotBlank(message = "BHK type is required")
    private String bhkType;

    @NotBlank(message = "Room type is required")
    private String roomType;

    private Boolean attachedBathroom = true;
    private Boolean balcony = false;

    @NotBlank(message = "Furnishing status is required")
    private String furnishing;

    @NotBlank(message = "Preferred gender is required")
    private String preferredGender;

    private Integer currentFlatmatesCount = 2;
    private Integer totalRooms = 3;
    private Integer vacantRooms = 1;
    private LocalDate moveInDate;

    private String flatmateVibe;
    private String amenities;
    private String houseRules;
    private String photos;

    // Verification evidence for replacement flatmate authority
    @NotBlank(message = "Poster relationship to flat is required")
    private String posterRelationship; // Current Tenant Moving Out, Remaining Flatmate Seeking Replacement, Master Tenant on Lease, Owner

    @NotBlank(message = "Authority proof type is required")
    private String authorityProofType; // Rental Agreement / Co-tenant, Landlord NOC / Written Consent, Society Maintenance Bill

    private String authorityDocumentUrl;

    public ListingRequest() {}

    // Getters and Setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }

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

    public String getPosterRelationship() { return posterRelationship; }
    public void setPosterRelationship(String posterRelationship) { this.posterRelationship = posterRelationship; }

    public String getAuthorityProofType() { return authorityProofType; }
    public void setAuthorityProofType(String authorityProofType) { this.authorityProofType = authorityProofType; }

    public String getAuthorityDocumentUrl() { return authorityDocumentUrl; }
    public void setAuthorityDocumentUrl(String authorityDocumentUrl) { this.authorityDocumentUrl = authorityDocumentUrl; }
}
