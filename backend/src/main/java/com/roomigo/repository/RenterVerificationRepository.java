package com.roomigo.repository;

import com.roomigo.entity.RenterVerification;
import com.roomigo.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RenterVerificationRepository extends JpaRepository<RenterVerification, Long> {
    Optional<RenterVerification> findByUserId(Long userId);
    List<RenterVerification> findByStatusOrderBySubmittedAtDesc(VerificationStatus status);
}
