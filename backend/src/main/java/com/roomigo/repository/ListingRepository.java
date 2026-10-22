package com.roomigo.repository;

import com.roomigo.entity.Listing;
import com.roomigo.entity.ListingStatus;
import com.roomigo.entity.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    List<Listing> findByPosterIdOrderByCreatedAtDesc(Long posterId);

    List<Listing> findByStatusOrderByCreatedAtDesc(ListingStatus status);

    @Query("SELECT l FROM Listing l WHERE l.status = 'ACTIVE' AND l.expiryDate > :now ORDER BY l.lastReconfirmedAt DESC")
    List<Listing> findActiveAndFreshListings(@Param("now") LocalDateTime now);

    @Query("SELECT l FROM Listing l WHERE l.status = 'ACTIVE' AND l.expiryDate <= :now")
    List<Listing> findExpiredListings(@Param("now") LocalDateTime now);

    @Query("SELECT l FROM Listing l WHERE " +
           "(:status IS NULL OR l.status = :status) AND " +
           "(:locality IS NULL OR LOWER(l.locality) = LOWER(:locality)) AND " +
           "(:listingType IS NULL OR l.listingType = :listingType) AND " +
           "(:roomType IS NULL OR LOWER(l.roomType) LIKE LOWER(CONCAT('%', :roomType, '%'))) AND " +
           "(:furnishing IS NULL OR LOWER(l.furnishing) LIKE LOWER(CONCAT('%', :furnishing, '%'))) AND " +
           "(:preferredGender IS NULL OR LOWER(l.preferredGender) = LOWER(:preferredGender) OR l.preferredGender = 'Any') AND " +
           "(:minRent IS NULL OR l.rentAmount >= :minRent) AND " +
           "(:maxRent IS NULL OR l.rentAmount <= :maxRent) AND " +
           "(:verifiedOnly IS NULL OR :verifiedOnly = false OR l.verified = true)")
    Page<Listing> searchListings(
            @Param("status") ListingStatus status,
            @Param("locality") String locality,
            @Param("listingType") ListingType listingType,
            @Param("roomType") String roomType,
            @Param("furnishing") String furnishing,
            @Param("preferredGender") String preferredGender,
            @Param("minRent") Integer minRent,
            @Param("maxRent") Integer maxRent,
            @Param("verifiedOnly") Boolean verifiedOnly,
            Pageable pageable
    );

    long countByStatus(ListingStatus status);

    long countByLocalityAndStatus(String locality, ListingStatus status);
}
