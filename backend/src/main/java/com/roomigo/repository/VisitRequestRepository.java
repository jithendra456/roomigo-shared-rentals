package com.roomigo.repository;

import com.roomigo.entity.VisitRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitRequestRepository extends JpaRepository<VisitRequest, Long> {
    List<VisitRequest> findByPosterIdOrderByCreatedAtDesc(Long posterId);
    List<VisitRequest> findByRequesterIdOrderByCreatedAtDesc(Long requesterId);
    List<VisitRequest> findByListingIdOrderByCreatedAtDesc(Long listingId);
}
