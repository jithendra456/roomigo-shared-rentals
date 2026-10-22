package com.roomigo.repository;

import com.roomigo.entity.AvailabilityConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AvailabilityConfirmationRepository extends JpaRepository<AvailabilityConfirmation, Long> {
    List<AvailabilityConfirmation> findByListingIdOrderByConfirmedAtDesc(Long listingId);
}
