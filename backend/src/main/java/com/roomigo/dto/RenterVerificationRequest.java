package com.roomigo.dto;

import jakarta.validation.constraints.NotBlank;

public class RenterVerificationRequest {
    @NotBlank(message = "ID Type is required")
    private String idType; // AADHAAR, PAN, PASSPORT, EMPLOYEE_ID, STUDENT_ID

    @NotBlank(message = "Masked ID number is required")
    private String idNumberMasked;

    private String documentUrl;
    private String companyOrCollege;
    private String workEmail;
    private String linkedinUrl;

    public RenterVerificationRequest() {}

    public String getIdType() { return idType; }
    public void setIdType(String idType) { this.idType = idType; }

    public String getIdNumberMasked() { return idNumberMasked; }
    public void setIdNumberMasked(String idNumberMasked) { this.idNumberMasked = idNumberMasked; }

    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public String getCompanyOrCollege() { return companyOrCollege; }
    public void setCompanyOrCollege(String companyOrCollege) { this.companyOrCollege = companyOrCollege; }

    public String getWorkEmail() { return workEmail; }
    public void setWorkEmail(String workEmail) { this.workEmail = workEmail; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
}
