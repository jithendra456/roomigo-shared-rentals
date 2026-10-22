package com.roomigo.repository;

import com.roomigo.entity.Favourite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavouriteRepository extends JpaRepository<Favourite, Long> {
    List<Favourite> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Favourite> findByUserIdAndListingId(Long userId, Long listingId);
    boolean existsByUserIdAndListingId(Long userId, Long listingId);
    void deleteByUserIdAndListingId(Long userId, Long listingId);
}
