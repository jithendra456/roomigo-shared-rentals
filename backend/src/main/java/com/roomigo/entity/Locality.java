package com.roomigo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "localities")
public class Locality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String city = "Hyderabad";

    private String itHubZone; // e.g. "HITEC City & Madhapur IT Corridor", "Gachibowli Financial Hub"

    private Integer avgRent = 15000;

    private Integer activeListingsCount = 0;

    private Boolean popular = true;

    private String imageUrl;

    private String description;

    public Locality() {}

    public Locality(String name, String itHubZone, Integer avgRent, Boolean popular, String imageUrl, String description) {
        this.name = name;
        this.city = "Hyderabad";
        this.itHubZone = itHubZone;
        this.avgRent = avgRent;
        this.popular = popular;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getItHubZone() { return itHubZone; }
    public void setItHubZone(String itHubZone) { this.itHubZone = itHubZone; }

    public Integer getAvgRent() { return avgRent; }
    public void setAvgRent(Integer avgRent) { this.avgRent = avgRent; }

    public Integer getActiveListingsCount() { return activeListingsCount; }
    public void setActiveListingsCount(Integer activeListingsCount) { this.activeListingsCount = activeListingsCount; }

    public Boolean getPopular() { return popular; }
    public void setPopular(Boolean popular) { this.popular = popular; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
