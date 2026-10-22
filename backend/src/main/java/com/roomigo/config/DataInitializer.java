package com.roomigo.config;

import com.roomigo.entity.*;
import com.roomigo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final LocalityRepository localityRepository;
    private final ListingRepository listingRepository;
    private final ListingVerificationRepository listingVerificationRepository;
    private final AvailabilityConfirmationRepository availabilityConfirmationRepository;
    private final RenterVerificationRepository renterVerificationRepository;
    private final EnquiryRepository enquiryRepository;
    private final VisitRequestRepository visitRequestRepository;
    private final UserReportRepository userReportRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           LocalityRepository localityRepository,
                           ListingRepository listingRepository,
                           ListingVerificationRepository listingVerificationRepository,
                           AvailabilityConfirmationRepository availabilityConfirmationRepository,
                           RenterVerificationRepository renterVerificationRepository,
                           EnquiryRepository enquiryRepository,
                           VisitRequestRepository visitRequestRepository,
                           UserReportRepository userReportRepository,
                           NotificationRepository notificationRepository,
                           AuditLogRepository auditLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.localityRepository = localityRepository;
        this.listingRepository = listingRepository;
        this.listingVerificationRepository = listingVerificationRepository;
        this.availabilityConfirmationRepository = availabilityConfirmationRepository;
        this.renterVerificationRepository = renterVerificationRepository;
        this.enquiryRepository = enquiryRepository;
        this.visitRequestRepository = visitRequestRepository;
        this.userReportRepository = userReportRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        System.out.println(">>> SEEDING ROOMIGO HYDERABAD DEMO DATA <<<");

        // 1. Seed Users
        User admin = new User("Roomigo Admin", "admin@roomigo.in", "+91 90000 00001", passwordEncoder.encode("admin123"), Role.ROLE_ADMIN);
        admin.setOccupation("Platform Integrity Lead");
        admin.setCompanyOrCollege("Roomigo Operations");
        admin.setPhoneVerified(true);
        admin.setIdVerified(true);
        admin.setVerificationStatus(VerificationStatus.VERIFIED);
        admin.setAvatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80");
        userRepository.save(admin);

        User posterRahul = new User("Rahul Sharma", "rahul.sharma@roomigo.in", "+91 98480 12345", passwordEncoder.encode("poster123"), Role.ROLE_POSTER);
        posterRahul.setOccupation("SDE-2");
        posterRahul.setCompanyOrCollege("Microsoft IDC, Gachibowli");
        posterRahul.setGender("Male");
        posterRahul.setPhoneVerified(true);
        posterRahul.setIdVerified(true);
        posterRahul.setVerificationStatus(VerificationStatus.VERIFIED);
        posterRahul.setAvatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80");
        posterRahul.setBio("Living in Gachibowli for 2 years. Chill, tech enthusiast, weekend badminton player.");
        userRepository.save(posterRahul);

        User posterPriya = new User("Priya Nair", "priya.nair@roomigo.in", "+91 98480 23456", passwordEncoder.encode("poster123"), Role.ROLE_POSTER);
        posterPriya.setOccupation("Product Designer");
        posterPriya.setCompanyOrCollege("Deloitte Digital, HITEC City");
        posterPriya.setGender("Female");
        posterPriya.setPhoneVerified(true);
        posterPriya.setIdVerified(true);
        posterPriya.setVerificationStatus(VerificationStatus.VERIFIED);
        posterPriya.setAvatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80");
        posterPriya.setBio("Design nerd, plant mom, loves quiet evenings and organized flats.");
        userRepository.save(posterPriya);

        User posterKiran = new User("Kiran Reddy", "kiran.reddy@roomigo.in", "+91 98480 34567", passwordEncoder.encode("poster123"), Role.ROLE_POSTER);
        posterKiran.setOccupation("Staff Software Engineer");
        posterKiran.setCompanyOrCollege("Google Hyderabad, Kondapur");
        posterKiran.setGender("Male");
        posterKiran.setPhoneVerified(true);
        posterKiran.setIdVerified(true);
        posterKiran.setVerificationStatus(VerificationStatus.VERIFIED);
        posterKiran.setAvatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80");
        userRepository.save(posterKiran);

        User posterSneha = new User("Sneha Patel", "sneha.patel@roomigo.in", "+91 98480 45678", passwordEncoder.encode("poster123"), Role.ROLE_POSTER);
        posterSneha.setOccupation("Senior Consultant");
        posterSneha.setCompanyOrCollege("PwC India, Madhapur");
        posterSneha.setGender("Female");
        posterSneha.setPhoneVerified(true);
        posterSneha.setIdVerified(true);
        posterSneha.setVerificationStatus(VerificationStatus.VERIFIED);
        posterSneha.setAvatarUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80");
        userRepository.save(posterSneha);

        User posterVikram = new User("Vikram Verma", "vikram.verma@roomigo.in", "+91 98480 56789", passwordEncoder.encode("poster123"), Role.ROLE_POSTER);
        posterVikram.setOccupation("DevOps Architect");
        posterVikram.setCompanyOrCollege("Qualcomm, HITEC City");
        posterVikram.setGender("Male");
        posterVikram.setPhoneVerified(true);
        posterVikram.setIdVerified(false);
        posterVikram.setVerificationStatus(VerificationStatus.PENDING);
        posterVikram.setAvatarUrl("https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80");
        userRepository.save(posterVikram);

        User renterAnanya = new User("Ananya Sen", "ananya.sen@roomigo.in", "+91 98480 67890", passwordEncoder.encode("renter123"), Role.ROLE_RENTER);
        renterAnanya.setOccupation("Frontend Engineer");
        renterAnanya.setCompanyOrCollege("Oracle Financial Services");
        renterAnanya.setGender("Female");
        renterAnanya.setPhoneVerified(true);
        renterAnanya.setIdVerified(true);
        renterAnanya.setVerificationStatus(VerificationStatus.VERIFIED);
        renterAnanya.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");
        userRepository.save(renterAnanya);

        User renterArjun = new User("Arjun Mehta", "arjun.mehta@roomigo.in", "+91 98480 78901", passwordEncoder.encode("renter123"), Role.ROLE_RENTER);
        renterArjun.setOccupation("Business Analyst");
        renterArjun.setCompanyOrCollege("Capgemini Hyderabad");
        renterArjun.setGender("Male");
        renterArjun.setPhoneVerified(true);
        renterArjun.setIdVerified(false);
        renterArjun.setVerificationStatus(VerificationStatus.PENDING);
        renterArjun.setAvatarUrl("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80");
        userRepository.save(renterArjun);

        // 2. Seed Localities
        Locality l1 = new Locality("Madhapur", "Cyber Towers & Mindspace IT Corridor", 16500, true, "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80", "Epicenter of Hyderabad tech life, walking distance to Mindspace, Metro station, and top eateries.");
        Locality l2 = new Locality("Gachibowli", "DLF & Financial District Corridor", 15000, true, "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80", "Top choice for Microsoft, Amazon & TCS employees with premium gated societies and DLF food street.");
        Locality l3 = new Locality("Kondapur", "Botanical Garden & HITEC Link Hub", 14500, true, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80", "Green surroundings near Botanical Garden, seamless connectivity to both HITEC City and Gachibowli.");
        Locality l4 = new Locality("HITEC City", "Knowledge City & Cyber Gateway", 17500, true, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80", "Walk-to-work luxury shared flats near Knowledge City, Inorbit Mall, and Durgam Cheruvu cable bridge.");
        Locality l5 = new Locality("Kukatpally", "KPHB Colony & JNTU Tech Zone", 12000, true, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80", "Budget-friendly shared flats with direct Metro connectivity to HITEC City and bustling markets.");
        Locality l6 = new Locality("Financial District", "Nanakramguda SEZ & WaveRock", 18000, true, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", "Modern high-rise towers near Apple, Amazon, and US Consulate. Luxury amenities and high security.");
        Locality l7 = new Locality("Gowlidoddy", "Q City & Wipro Circle Corridor", 11500, true, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80", "Great value flatmate options near Q City, Wipro Circle, and ISB with quick commute to Financial District.");

        localityRepository.saveAll(List.of(l1, l2, l3, l4, l5, l6, l7));

        // 3. Seed Replacement Flatmate Vacancies (Priority 1)
        Listing listing1 = new Listing();
        listing1.setPoster(posterRahul);
        listing1.setTitle("Urgent Replacement Flatmate: Private AC Room in 3BHK Gated Society");
        listing1.setDescription("My flatmate is relocating to Microsoft Seattle office on Nov 1st, so we need a replacement flatmate for his private master bedroom. The flat is fully set up with sofa, 55-inch TV, modular kitchen, and double door fridge. We have a shared cook and daily maid.");
        listing1.setListingType(ListingType.REPLACEMENT_FLATMATE);
        listing1.setStatus(ListingStatus.ACTIVE);
        listing1.setLocality("Gachibowli");
        listing1.setAddressApproximate("Opposite DLF Cyber City, Gachibowli");
        listing1.setLandmark("Near DLF Gate 2 & Radisson Hotel");
        listing1.setPinCode("500032");
        listing1.setLatitude(17.4435);
        listing1.setLongitude(78.3512);
        listing1.setRentAmount(15500);
        listing1.setDepositAmount(31000); // 2 months deposit
        listing1.setMaintenanceAmount(1500);
        listing1.setUtilitiesIncluded(false);
        listing1.setUtilitiesEstimate(1100);
        listing1.setFoodArrangement("Cook Available (Shared Cost ₹2,500/mo)");
        listing1.setBhkType("3 BHK");
        listing1.setRoomType("Private Room with Attached Bath");
        listing1.setAttachedBathroom(true);
        listing1.setBalcony(true);
        listing1.setFurnishing("Fully Furnished");
        listing1.setPreferredGender("Male");
        listing1.setCurrentFlatmatesCount(2);
        listing1.setTotalRooms(3);
        listing1.setVacantRooms(1);
        listing1.setMoveInDate(LocalDate.now().plusDays(10));
        listing1.setFlatmateVibe("We are 2 techies (Microsoft & Oracle). Weekday focus, weekend gaming/badminton. Chill, clean, and respectful of personal space.");
        listing1.setAmenities("High-speed Wi-Fi (300 Mbps), AC, Washing Machine, Geyser, Power Backup, RO Water, Gym, Swimming Pool, Gated Security 24/7, Covered Car Parking");
        listing1.setHouseRules("Non-smoking indoors (balcony okay). Friends/family allowed with advance notice. Quiet hours after 11 PM on weekdays.");
        listing1.setPhotos("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80");
        listing1.setVerified(true);
        listing1.setLastReconfirmedAt(LocalDateTime.now().minusHours(3)); // Reconfirmed 3 hours ago!
        listing1.setExpiryDate(LocalDateTime.now().plusDays(7));
        listing1.setViewsCount(142);
        listing1 = listingRepository.save(listing1);

        ListingVerification lv1 = new ListingVerification();
        lv1.setListing(listing1);
        lv1.setPosterRelationship("Current Tenant Moving Out (Co-tenant replacing)");
        lv1.setAuthorityProofType("Registered Rental Agreement with Co-Tenant Clause");
        lv1.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/leases/lease_sample_gachibowli.pdf");
        lv1.setApproxLocationVerified(true);
        lv1.setRentVerified(true);
        lv1.setPhotosVerified(true);
        lv1.setRulesVerified(true);
        lv1.setStatus(VerificationStatus.APPROVED);
        lv1.setReviewer(admin);
        lv1.setReviewedAt(LocalDateTime.now().minusDays(1));
        lv1.setAdminNotes("Verified co-tenant agreement and building society pass. Rent matches agreement ₹46,500 split into 3.");
        listingVerificationRepository.save(lv1);

        availabilityConfirmationRepository.save(new AvailabilityConfirmation(listing1, posterRahul, LocalDateTime.now().minusDays(7), listing1.getExpiryDate(), "ONE_CLICK_MANUAL"));

        // Listing 2: Replacement flatmate (Priya in Kondapur)
        Listing listing2 = new Listing();
        listing2.setPoster(posterPriya);
        listing2.setTitle("Female Replacement Flatmate: Spacious Room with Balcony in Kondapur");
        listing2.setDescription("Looking for a female replacement flatmate in our 3BHK flat near Botanical Garden. Previous flatmate got transferred to Bangalore. The room has large French windows, private attached bath, and queen bed with mattress.");
        listing2.setListingType(ListingType.REPLACEMENT_FLATMATE);
        listing2.setStatus(ListingStatus.ACTIVE);
        listing2.setLocality("Kondapur");
        listing2.setAddressApproximate("Near Botanical Garden Road, Kondapur");
        listing2.setLandmark("Opposite Heritage Fresh & Sarath City Mall link");
        listing2.setPinCode("500084");
        listing2.setLatitude(17.4623);
        listing2.setLongitude(78.3582);
        listing2.setRentAmount(14000);
        listing2.setDepositAmount(28000);
        listing2.setMaintenanceAmount(1200);
        listing2.setUtilitiesIncluded(false);
        listing2.setUtilitiesEstimate(900);
        listing2.setFoodArrangement("Cook Available (North & South Indian, ₹2,000/mo)");
        listing2.setBhkType("3 BHK");
        listing2.setRoomType("Private Room with Attached Bath");
        listing2.setAttachedBathroom(true);
        listing2.setBalcony(true);
        listing2.setFurnishing("Fully Furnished");
        listing2.setPreferredGender("Female");
        listing2.setCurrentFlatmatesCount(2);
        listing2.setTotalRooms(3);
        listing2.setVacantRooms(1);
        listing2.setMoveInDate(LocalDate.now().plusDays(5));
        listing2.setFlatmateVibe("2 working women in tech and consulting (Deloitte & Cognizant). Very neat, non-interfering, movie marathon buddies on weekends.");
        listing2.setAmenities("High-speed Wi-Fi, Split AC, Washing Machine, Refrigerator, Microwave, Sofa, Dining Table, Power Backup, Lift, Security Guard");
        listing2.setHouseRules("Non-smoking indoors. Female guests welcome anytime; male guests with prior heads-up.");
        listing2.setPhotos("https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80");
        listing2.setVerified(true);
        listing2.setLastReconfirmedAt(LocalDateTime.now().minusHours(18)); // Reconfirmed yesterday
        listing2.setExpiryDate(LocalDateTime.now().plusDays(6));
        listing2.setViewsCount(98);
        listing2 = listingRepository.save(listing2);

        ListingVerification lv2 = new ListingVerification();
        lv2.setListing(listing2);
        lv2.setPosterRelationship("Remaining Flatmate Seeking Replacement");
        lv2.setAuthorityProofType("Owner Written Consent / Landlord NOC");
        lv2.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/noc/landlord_consent_kondapur.pdf");
        lv2.setApproxLocationVerified(true);
        lv2.setRentVerified(true);
        lv2.setPhotosVerified(true);
        lv2.setRulesVerified(true);
        lv2.setStatus(VerificationStatus.APPROVED);
        lv2.setReviewer(admin);
        lv2.setReviewedAt(LocalDateTime.now().minusDays(2));
        lv2.setAdminNotes("Verified landlord email confirmation permitting co-tenant replacement.");
        listingVerificationRepository.save(lv2);

        // Listing 3: Replacement flatmate (Sneha in Madhapur)
        Listing listing3 = new Listing();
        listing3.setPoster(posterSneha);
        listing3.setTitle("Immediate Replacement: Master Bedroom in Luxury Madhapur Flat");
        listing3.setDescription("Replacing our co-tenant in a premium society 500m from Durgam Cheruvu Metro Station. Walking distance to Inorbit Mall. Massive room with king bed, 4-door wardrobe, private bath with bathtub.");
        listing3.setListingType(ListingType.REPLACEMENT_FLATMATE);
        listing3.setStatus(ListingStatus.ACTIVE);
        listing3.setLocality("Madhapur");
        listing3.setAddressApproximate("Near Durgam Cheruvu Metro & Inorbit Mall");
        listing3.setLandmark("Near ITC Kohenur");
        listing3.setPinCode("500081");
        listing3.setLatitude(17.4375);
        listing3.setLongitude(78.3842);
        listing3.setRentAmount(19000);
        listing3.setDepositAmount(38000);
        listing3.setMaintenanceAmount(2000);
        listing3.setUtilitiesIncluded(false);
        listing3.setUtilitiesEstimate(1500);
        listing3.setFoodArrangement("Self-Cook or Shared Tiffin");
        listing3.setBhkType("3 BHK");
        listing3.setRoomType("Master Bedroom with Attached Bath");
        listing3.setAttachedBathroom(true);
        listing3.setBalcony(true);
        listing3.setFurnishing("Fully Furnished");
        listing3.setPreferredGender("Female");
        listing3.setCurrentFlatmatesCount(2);
        listing3.setTotalRooms(3);
        listing3.setVacantRooms(1);
        listing3.setMoveInDate(LocalDate.now().plusDays(2));
        listing3.setFlatmateVibe("Professional consultants with busy workdays. Cleanliness is top priority. Peace and quiet after work.");
        listing3.setAmenities("Air Conditioning in all rooms, High-Speed Fiber Net, Smart TV, Fully functional kitchen with chimney, Washing Machine, Rooftop Infinity Pool, Gym, Club House");
        listing3.setHouseRules("Strictly non-smoking. Overnight female guests allowed. Please maintain common area cleanliness.");
        listing3.setPhotos("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80");
        listing3.setVerified(true);
        listing3.setLastReconfirmedAt(LocalDateTime.now().minusHours(1)); // Reconfirmed 1 hour ago!
        listing3.setExpiryDate(LocalDateTime.now().plusDays(7));
        listing3.setViewsCount(210);
        listing3 = listingRepository.save(listing3);

        ListingVerification lv3 = new ListingVerification();
        lv3.setListing(listing3);
        lv3.setPosterRelationship("Current Tenant Moving Out");
        lv3.setAuthorityProofType("Rental Agreement & Society Maintenance Receipt");
        lv3.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/bills/maintenance_receipt_madhapur.pdf");
        lv3.setApproxLocationVerified(true);
        lv3.setRentVerified(true);
        lv3.setPhotosVerified(true);
        lv3.setRulesVerified(true);
        lv3.setStatus(VerificationStatus.APPROVED);
        lv3.setReviewer(admin);
        lv3.setReviewedAt(LocalDateTime.now().minusHours(12));
        lv3.setAdminNotes("Society maintenance slip and tenant agreement verified.");
        listingVerificationRepository.save(lv3);

        // Listing 4: Available Room in Shared Flat (Priority 2) (Kiran in Financial District)
        Listing listing4 = new Listing();
        listing4.setPoster(posterKiran);
        listing4.setTitle("Available Room in 3BHK: High-Rise Gated Community near US Consulate");
        listing4.setDescription("Available private room in high-rise tower (18th floor) with scenic city views in Financial District. Walkable to Apple, Amazon, and Microsoft campus.");
        listing4.setListingType(ListingType.AVAILABLE_ROOM);
        listing4.setStatus(ListingStatus.ACTIVE);
        listing4.setLocality("Financial District");
        listing4.setAddressApproximate("Nanakramguda Financial District, Near WaveRock");
        listing4.setLandmark("Beside Sheraton Hotel & US Consulate");
        listing4.setPinCode("500032");
        listing4.setLatitude(17.4192);
        listing4.setLongitude(78.3475);
        listing4.setRentAmount(17000);
        listing4.setDepositAmount(34000);
        listing4.setMaintenanceAmount(2200);
        listing4.setUtilitiesIncluded(true);
        listing4.setUtilitiesEstimate(0);
        listing4.setFoodArrangement("Cook Available (Full meals, ₹3,000/mo)");
        listing4.setBhkType("3 BHK");
        listing4.setRoomType("Private Room");
        listing4.setAttachedBathroom(true);
        listing4.setBalcony(true);
        listing4.setFurnishing("Fully Furnished");
        listing4.setPreferredGender("Any");
        listing4.setCurrentFlatmatesCount(2);
        listing4.setTotalRooms(3);
        listing4.setVacantRooms(1);
        listing4.setMoveInDate(LocalDate.now().plusDays(15));
        listing4.setFlatmateVibe("Tech leads at Google and Salesforce. Friendly, cosmopolitan atmosphere, weekend cooking experiments.");
        listing4.setAmenities("Central AC, 500 Mbps Wi-Fi, Gym, Tennis Court, Olympic Pool, 24/7 Power Backup, Piped Gas, Covered Parking, Supermarket inside society");
        listing4.setHouseRules("Respectful environment. Drinking allowed in moderation. No loud parties after midnight.");
        listing4.setPhotos("https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80");
        listing4.setVerified(true);
        listing4.setLastReconfirmedAt(LocalDateTime.now().minusDays(2)); // Reconfirmed 2 days ago
        listing4.setExpiryDate(LocalDateTime.now().plusDays(5));
        listing4.setViewsCount(175);
        listing4 = listingRepository.save(listing4);

        ListingVerification lv4 = new ListingVerification();
        lv4.setListing(listing4);
        lv4.setPosterRelationship("Master Tenant on Lease");
        lv4.setAuthorityProofType("Primary Lease Agreement with Subletting / Flatmate Addendum");
        lv4.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/leases/lease_financial_dist.pdf");
        lv4.setApproxLocationVerified(true);
        lv4.setRentVerified(true);
        lv4.setPhotosVerified(true);
        lv4.setRulesVerified(true);
        lv4.setStatus(VerificationStatus.APPROVED);
        lv4.setReviewer(admin);
        lv4.setReviewedAt(LocalDateTime.now().minusDays(3));
        listingVerificationRepository.save(lv4);

        // Listing 5: Other Shared Accommodation (Priority 3) (Kukatpally)
        Listing listing5 = new Listing();
        listing5.setPoster(posterRahul);
        listing5.setTitle("Shared Accommodation: Twin Sharing Room in KPHB Phase 1 near Metro");
        listing5.setDescription("Looking for 1 flatmate for twin sharing bedroom in a spacious 2BHK flat. 3 minutes walk to KPHB Colony Metro station. Very affordable and ideal for students or junior IT professionals.");
        listing5.setListingType(ListingType.SHARED_ACCOMMODATION);
        listing5.setStatus(ListingStatus.ACTIVE);
        listing5.setLocality("Kukatpally");
        listing5.setAddressApproximate("KPHB 1st Phase, Near Metro Station");
        listing5.setLandmark("Opposite Forum Sujana Mall road");
        listing5.setPinCode("500072");
        listing5.setLatitude(17.4942);
        listing5.setLongitude(78.3995);
        listing5.setRentAmount(7500);
        listing5.setDepositAmount(15000);
        listing5.setMaintenanceAmount(800);
        listing5.setUtilitiesIncluded(false);
        listing5.setUtilitiesEstimate(600);
        listing5.setFoodArrangement("Mess / Tiffin Service Available nearby");
        listing5.setBhkType("2 BHK");
        listing5.setRoomType("Shared Room (2 Sharing)");
        listing5.setAttachedBathroom(false);
        listing5.setBalcony(false);
        listing5.setFurnishing("Semi Furnished");
        listing5.setPreferredGender("Male");
        listing5.setCurrentFlatmatesCount(3);
        listing5.setTotalRooms(2);
        listing5.setVacantRooms(1);
        listing5.setMoveInDate(LocalDate.now().plusDays(1));
        listing5.setFlatmateVibe("Young software engineers preparing for tech interviews. Serious study environment on weekdays.");
        listing5.setAmenities("Wi-Fi, Washing Machine, Geyser, RO Water Purifier, Bike Parking, Lift");
        listing5.setHouseRules("No smoking, no drinking. Maintain quiet during study hours.");
        listing5.setPhotos("https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80");
        listing5.setVerified(true);
        listing5.setLastReconfirmedAt(LocalDateTime.now().minusDays(5)); // Expiring soon in 2 days!
        listing5.setExpiryDate(LocalDateTime.now().plusDays(2));
        listing5.setViewsCount(85);
        listing5 = listingRepository.save(listing5);

        ListingVerification lv5 = new ListingVerification();
        lv5.setListing(listing5);
        lv5.setPosterRelationship("Remaining Flatmate Seeking Replacement");
        lv5.setAuthorityProofType("Owner Consent WhatsApp & Utility Bill");
        lv5.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/bills/electricity_bill_kukatpally.pdf");
        lv5.setApproxLocationVerified(true);
        lv5.setRentVerified(true);
        lv5.setPhotosVerified(true);
        lv5.setRulesVerified(true);
        lv5.setStatus(VerificationStatus.APPROVED);
        lv5.setReviewer(admin);
        lv5.setReviewedAt(LocalDateTime.now().minusDays(5));
        listingVerificationRepository.save(lv5);

        // Listing 6: PENDING Verification Listing (Vikram in HITEC City) - Perfect for Admin Dashboard Demo!
        Listing listing6 = new Listing();
        listing6.setPoster(posterVikram);
        listing6.setTitle("Replacement Flatmate Wanted: Master Bedroom in Cyber Gateway Enclave");
        listing6.setDescription("Current flatmate is vacating next week. Need replacement urgently. 3BHK flat right next to HITEC City Cyber Gateway. Fully furnished with study table, AC, and attached washroom.");
        listing6.setListingType(ListingType.REPLACEMENT_FLATMATE);
        listing6.setStatus(ListingStatus.PENDING_VERIFICATION);
        listing6.setLocality("HITEC City");
        listing6.setAddressApproximate("Opposite Cyber Gateway, HITEC City Main Rd");
        listing6.setLandmark("Near Cyber Towers");
        listing6.setPinCode("500081");
        listing6.setLatitude(17.4504);
        listing6.setLongitude(78.3808);
        listing6.setRentAmount(16000);
        listing6.setDepositAmount(32000);
        listing6.setMaintenanceAmount(1500);
        listing6.setUtilitiesIncluded(false);
        listing6.setUtilitiesEstimate(1200);
        listing6.setFoodArrangement("Cook Available (Shared ₹2,200)");
        listing6.setBhkType("3 BHK");
        listing6.setRoomType("Master Bedroom with Attached Bath");
        listing6.setAttachedBathroom(true);
        listing6.setBalcony(true);
        listing6.setFurnishing("Fully Furnished");
        listing6.setPreferredGender("Male");
        listing6.setCurrentFlatmatesCount(2);
        listing6.setTotalRooms(3);
        listing6.setVacantRooms(1);
        listing6.setMoveInDate(LocalDate.now().plusDays(7));
        listing6.setFlatmateVibe("Qualcomm engineer. Quiet, keeps common areas spotless.");
        listing6.setAmenities("AC, High-speed Wi-Fi, Smart TV, Modular Kitchen, Geyser, Power Backup, Gated Security");
        listing6.setHouseRules("Non-smoking flat. Cleanliness essential.");
        listing6.setPhotos("https://images.unsplash.com/photo-1502005229762-ee1b2da97306?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80");
        listing6.setVerified(false);
        listing6.setLastReconfirmedAt(LocalDateTime.now());
        listing6.setExpiryDate(LocalDateTime.now().plusDays(7));
        listing6.setViewsCount(12);
        listing6 = listingRepository.save(listing6);

        ListingVerification lv6 = new ListingVerification();
        lv6.setListing(listing6);
        lv6.setPosterRelationship("Current Tenant Moving Out");
        lv6.setAuthorityProofType("Rental Agreement & Gate Pass Slip");
        lv6.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/leases/hitec_lease_pending.pdf");
        lv6.setStatus(VerificationStatus.PENDING);
        lv6.setApproxLocationVerified(false);
        lv6.setRentVerified(false);
        lv6.setPhotosVerified(false);
        lv6.setRulesVerified(false);
        listingVerificationRepository.save(lv6);

        // 4. Seed Renter Verifications (One verified, one pending for admin demo)
        RenterVerification rv1 = new RenterVerification();
        rv1.setUserId(renterAnanya.getId());
        rv1.setIdType("EMPLOYEE_ID");
        rv1.setIdNumberMasked("ORCL-XXXX-8921");
        rv1.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/renters/ananya_oracle_badge.png");
        rv1.setCompanyOrCollege("Oracle Financial Services Software");
        rv1.setWorkEmail("ananya.sen@oracle.com");
        rv1.setLinkedinUrl("https://linkedin.com/in/ananya-sen-dev");
        rv1.setStatus(VerificationStatus.VERIFIED);
        rv1.setAdminNotes("Corporate work email and employee ID badge verified.");
        rv1.setReviewedByUserId(admin.getId());
        rv1.setSubmittedAt(LocalDateTime.now().minusDays(4));
        rv1.setReviewedAt(LocalDateTime.now().minusDays(3));
        renterVerificationRepository.save(rv1);

        RenterVerification rv2 = new RenterVerification();
        rv2.setUserId(renterArjun.getId());
        rv2.setIdType("AADHAAR");
        rv2.setIdNumberMasked("XXXX-XXXX-4819");
        rv2.setDocumentUrl("https://roomigo-docs.s3.ap-south-1.amazonaws.com/renters/arjun_aadhaar_masked.pdf");
        rv2.setCompanyOrCollege("Capgemini Hyderabad");
        rv2.setWorkEmail("arjun.mehta@capgemini.com");
        rv2.setStatus(VerificationStatus.PENDING);
        rv2.setSubmittedAt(LocalDateTime.now().minusHours(4));
        renterVerificationRepository.save(rv2);

        // 5. Seed Enquiries
        Enquiry e1 = new Enquiry();
        e1.setListing(listing1);
        e1.setSender(renterArjun);
        e1.setRecipient(posterRahul);
        e1.setMessage("Hi Rahul, I saw your replacement vacancy in Gachibowli. I work at Capgemini near DLF and am looking to move in around Nov 5th. Is the room still available?");
        e1.setSenderOccupation("Business Analyst at Capgemini");
        e1.setMoveInDate(LocalDate.now().plusDays(15));
        e1.setSenderPhone("+91 98480 78901");
        e1.setSenderEmail("arjun.mehta@roomigo.in");
        e1.setStatus("REPLIED");
        e1.setReply("Hi Arjun, yes it is! The room is ready. Would you like to schedule a visit this weekend?");
        e1.setRepliedAt(LocalDateTime.now().minusHours(2));
        enquiryRepository.save(e1);

        Enquiry e2 = new Enquiry();
        e2.setListing(listing2);
        e2.setSender(renterAnanya);
        e2.setRecipient(posterPriya);
        e2.setMessage("Hello Priya! I work at Oracle in HITEC City and love the flat in Kondapur. What are the timings for the cook?");
        e2.setSenderOccupation("Frontend Engineer at Oracle");
        e2.setMoveInDate(LocalDate.now().plusDays(7));
        e2.setSenderPhone("+91 98480 67890");
        e2.setSenderEmail("ananya.sen@roomigo.in");
        e2.setStatus("NEW");
        enquiryRepository.save(e2);

        // 6. Seed Visit Request
        VisitRequest vr1 = new VisitRequest();
        vr1.setListing(listing1);
        vr1.setRequester(renterArjun);
        vr1.setPoster(posterRahul);
        vr1.setPreferredDate(LocalDate.now().plusDays(2));
        vr1.setTimeSlot("Evening (4 PM - 8 PM)");
        vr1.setVisitType("IN_PERSON");
        vr1.setNotes("Can come around 6:30 PM after office to check the room and meet the flatmates.");
        vr1.setStatus("ACCEPTED");
        vr1.setPosterResponseNote("Sounds great Arjun! See you on Saturday around 6:30 PM. Flat 402, Tower B, My Home Bhooja (opposite DLF). Gate pass will be registered.");
        visitRequestRepository.save(vr1);

        // 7. Seed User Report for Admin Dashboard Demo
        UserReport rep = new UserReport();
        rep.setListing(listing5);
        rep.setReporter(renterArjun);
        rep.setReasonCategory("INACCURATE_RENT_OR_DEPOSIT");
        rep.setDescription("Poster mentioned deposit as 2 months in ad, but on call stated landlord requires 3 months deposit. Please re-verify.");
        rep.setStatus("PENDING");
        userReportRepository.save(rep);

        // 8. Seed Notifications
        notificationRepository.save(new Notification(
                posterRahul,
                "Listing Verified & Published",
                "Your vacancy at Gachibowli has been verified and is now live for seekers.",
                "LISTING_APPROVED",
                "/listings/" + listing1.getId()
        ));
        notificationRepository.save(new Notification(
                posterRahul,
                "New Enquiry Received",
                "Arjun Mehta sent an enquiry for your Gachibowli listing.",
                "ENQUIRY_RECEIVED",
                "/enquiries"
        ));
        notificationRepository.save(new Notification(
                renterArjun,
                "Visit Request Accepted!",
                "Rahul accepted your visit request for Gachibowli on " + vr1.getPreferredDate() + ". Check details for society address.",
                "VISIT_UPDATED",
                "/visits"
        ));

        // 9. Audit Logs
        auditLogRepository.save(new AuditLog(admin.getId(), admin.getEmail(), "SYSTEM_INITIALIZED", "SYSTEM", 1L, "Roomigo initialized with Hyderabad localities and sample verified data."));
        auditLogRepository.save(new AuditLog(admin.getId(), admin.getEmail(), "VERIFY_LISTING_APPROVED", "LISTING", listing1.getId(), "Approved listing in Gachibowli after reviewing co-tenant lease agreement."));

        // Update locality counts
        l1.setActiveListingsCount((int) listingRepository.countByLocalityAndStatus("Madhapur", ListingStatus.ACTIVE));
        l2.setActiveListingsCount((int) listingRepository.countByLocalityAndStatus("Gachibowli", ListingStatus.ACTIVE));
        l3.setActiveListingsCount((int) listingRepository.countByLocalityAndStatus("Kondapur", ListingStatus.ACTIVE));
        l4.setActiveListingsCount((int) listingRepository.countByLocalityAndStatus("HITEC City", ListingStatus.ACTIVE));
        l5.setActiveListingsCount((int) listingRepository.countByLocalityAndStatus("Kukatpally", ListingStatus.ACTIVE));
        l6.setActiveListingsCount((int) listingRepository.countByLocalityAndStatus("Financial District", ListingStatus.ACTIVE));
        l7.setActiveListingsCount((int) listingRepository.countByLocalityAndStatus("Gowlidoddy", ListingStatus.ACTIVE));
        localityRepository.saveAll(List.of(l1, l2, l3, l4, l5, l6, l7));

        System.out.println(">>> SEEDING COMPLETE: Roomigo Hyderabad MVP is ready <<<");
    }
}
