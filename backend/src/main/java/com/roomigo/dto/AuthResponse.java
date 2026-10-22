package com.roomigo.dto;

import com.roomigo.entity.Role;
import com.roomigo.entity.VerificationStatus;

public class AuthResponse {
    private String token;
    private Long id;
    private String name;
    private String email;
    private String phone;
    private Role role;
    private String occupation;
    private String companyOrCollege;
    private String avatarUrl;
    private boolean phoneVerified;
    private boolean idVerified;
    private VerificationStatus verificationStatus;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String name, String email, String phone, Role role,
                        String occupation, String companyOrCollege, String avatarUrl,
                        boolean phoneVerified, boolean idVerified, VerificationStatus verificationStatus) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.occupation = occupation;
        this.companyOrCollege = companyOrCollege;
        this.avatarUrl = avatarUrl;
        this.phoneVerified = phoneVerified;
        this.idVerified = idVerified;
        this.verificationStatus = verificationStatus;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getCompanyOrCollege() { return companyOrCollege; }
    public void setCompanyOrCollege(String companyOrCollege) { this.companyOrCollege = companyOrCollege; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public boolean isPhoneVerified() { return phoneVerified; }
    public void setPhoneVerified(boolean phoneVerified) { this.phoneVerified = phoneVerified; }

    public boolean isIdVerified() { return idVerified; }
    public void setIdVerified(boolean idVerified) { this.idVerified = idVerified; }

    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus verificationStatus) { this.verificationStatus = verificationStatus; }
}
