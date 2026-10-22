package com.roomigo.repository;

import com.roomigo.entity.ListingVerification;
import com.roomigo.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ListingVerificationRepository extends JpaRepository<ListingVerification, Long> {
    Optional<ListingVerification> findByListingId(Long listingId);
    List<ListingVerification> findByStatusOrderByCreatedAtDesc(VerificationStatus status);
    long countByStatus(VerificationStatus status);
}
