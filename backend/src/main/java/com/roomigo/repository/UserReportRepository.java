package com.roomigo.repository;

import com.roomigo.entity.UserReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserReportRepository extends JpaRepository<UserReport, Long> {
    List<UserReport> findByStatusOrderByCreatedAtDesc(String status);
    List<UserReport> findByListingIdOrderByCreatedAtDesc(Long listingId);
    long countByStatus(String status);
}
