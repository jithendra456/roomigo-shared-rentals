package com.roomigo.repository;

import com.roomigo.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    List<Enquiry> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);
    List<Enquiry> findBySenderIdOrderByCreatedAtDesc(Long senderId);
    List<Enquiry> findByListingIdOrderByCreatedAtDesc(Long listingId);
}
