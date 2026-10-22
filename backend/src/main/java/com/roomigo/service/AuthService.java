package com.roomigo.service;

import com.roomigo.dto.AuthRequest;
import com.roomigo.dto.AuthResponse;
import com.roomigo.dto.RegisterRequest;
import com.roomigo.entity.Role;
import com.roomigo.entity.User;
import com.roomigo.entity.VerificationStatus;
import com.roomigo.repository.UserRepository;
import com.roomigo.security.JwtTokenProvider;
import com.roomigo.security.SecurityUtils;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final SmsService smsService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       SmsService smsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.smsService = smsService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + req.getEmail());
        }
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new IllegalArgumentException("Phone number already registered: " + req.getPhone());
        }

        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail().toLowerCase().trim());
        user.setPhone(req.getPhone().trim());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(req.getRole() != null ? req.getRole() : Role.ROLE_RENTER);
        user.setOccupation(req.getOccupation());
        user.setCompanyOrCollege(req.getCompanyOrCollege());
        user.setGender(req.getGender() != null ? req.getGender() : "Not Specified");
        user.setPhoneVerified(false);
        user.setIdVerified(false);
        user.setVerificationStatus(VerificationStatus.NOT_STARTED);
        user.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80");

        user = userRepository.save(user);

        // Auto trigger phone verification OTP
        smsService.generateAndSendOtp(user.getPhone());

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());

        return toAuthResponse(user, token);
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return toAuthResponse(user, token);
    }

    public boolean sendPhoneOtp(String phone) {
        return smsService.generateAndSendOtp(phone) != null;
    }

    @Transactional
    public boolean verifyPhoneOtp(String phone, String otp) {
        boolean valid = smsService.verifyOtp(phone, otp);
        if (valid) {
            userRepository.findByPhone(phone.trim()).ifPresent(user -> {
                user.setPhoneVerified(true);
                userRepository.save(user);
            });
        }
        return valid;
    }

    public User getCurrentAuthenticatedUser() {
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null) return null;
        return userRepository.findByEmail(email).orElse(null);
    }

    @Transactional
    public User updateProfile(User updated) {
        User current = getCurrentAuthenticatedUser();
        if (current == null) {
            throw new IllegalStateException("User not authenticated");
        }
        if (updated.getName() != null) current.setName(updated.getName());
        if (updated.getBio() != null) current.setBio(updated.getBio());
        if (updated.getOccupation() != null) current.setOccupation(updated.getOccupation());
        if (updated.getCompanyOrCollege() != null) current.setCompanyOrCollege(updated.getCompanyOrCollege());
        if (updated.getGender() != null) current.setGender(updated.getGender());
        if (updated.getAvatarUrl() != null) current.setAvatarUrl(updated.getAvatarUrl());

        return userRepository.save(current);
    }

    public AuthResponse toAuthResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getOccupation(),
                user.getCompanyOrCollege(),
                user.getAvatarUrl(),
                user.isPhoneVerified(),
                user.isIdVerified(),
                user.getVerificationStatus()
        );
    }
}
