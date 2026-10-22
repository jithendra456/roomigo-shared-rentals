package com.roomigo.repository;

import com.roomigo.entity.Locality;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalityRepository extends JpaRepository<Locality, Long> {
    Optional<Locality> findByNameIgnoreCase(String name);
    List<Locality> findByCityOrderByActiveListingsCountDesc(String city);
    List<Locality> findByPopularTrue();
}
