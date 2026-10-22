package com.roomigo.controller;

import com.roomigo.entity.Locality;
import com.roomigo.repository.LocalityRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/localities")
public class LocalityController {

    private final LocalityRepository localityRepository;

    public LocalityController(LocalityRepository localityRepository) {
        this.localityRepository = localityRepository;
    }

    @GetMapping
    public ResponseEntity<List<Locality>> getAll() {
        return ResponseEntity.ok(localityRepository.findByCityOrderByActiveListingsCountDesc("Hyderabad"));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Locality>> getPopular() {
        return ResponseEntity.ok(localityRepository.findByPopularTrue());
    }
}
