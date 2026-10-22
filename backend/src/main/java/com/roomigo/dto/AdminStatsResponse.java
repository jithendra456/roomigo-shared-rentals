package com.roomigo.dto;

public class AdminStatsResponse {
    private long totalListings;
    private long activeListings;
    private long pendingVerifications;
    private long expiredListings;
    private long totalUsers;
    private long totalEnquiries;
    private long totalVisits;
    private long pendingReports;
    private long verifiedRentersCount;

    public AdminStatsResponse() {}

    public AdminStatsResponse(long totalListings, long activeListings, long pendingVerifications,
                              long expiredListings, long totalUsers, long totalEnquiries,
                              long totalVisits, long pendingReports, long verifiedRentersCount) {
        this.totalListings = totalListings;
        this.activeListings = activeListings;
        this.pendingVerifications = pendingVerifications;
        this.expiredListings = expiredListings;
        this.totalUsers = totalUsers;
        this.totalEnquiries = totalEnquiries;
        this.totalVisits = totalVisits;
        this.pendingReports = pendingReports;
        this.verifiedRentersCount = verifiedRentersCount;
    }

    public long getTotalListings() { return totalListings; }
    public void setTotalListings(long totalListings) { this.totalListings = totalListings; }

    public long getActiveListings() { return activeListings; }
    public void setActiveListings(long activeListings) { this.activeListings = activeListings; }

    public long getPendingVerifications() { return pendingVerifications; }
    public void setPendingVerifications(long pendingVerifications) { this.pendingVerifications = pendingVerifications; }

    public long getExpiredListings() { return expiredListings; }
    public void setExpiredListings(long expiredListings) { this.expiredListings = expiredListings; }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalEnquiries() { return totalEnquiries; }
    public void setTotalEnquiries(long totalEnquiries) { this.totalEnquiries = totalEnquiries; }

    public long getTotalVisits() { return totalVisits; }
    public void setTotalVisits(long totalVisits) { this.totalVisits = totalVisits; }

    public long getPendingReports() { return pendingReports; }
    public void setPendingReports(long pendingReports) { this.pendingReports = pendingReports; }

    public long getVerifiedRentersCount() { return verifiedRentersCount; }
    public void setVerifiedRentersCount(long verifiedRentersCount) { this.verifiedRentersCount = verifiedRentersCount; }
}
