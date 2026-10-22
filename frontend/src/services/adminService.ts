import api from './api';
import { AdminStats, AuditLog, ListingVerification, Locality, RenterVerification, UserReport } from '../types';

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  getPendingListings: async (): Promise<ListingVerification[]> => {
    const res = await api.get('/admin/verifications/listings');
    return res.data;
  },

  reviewListing: async (verificationId: number, data: {
    status: string;
    approxLocationVerified?: boolean;
    rentVerified?: boolean;
    photosVerified?: boolean;
    rulesVerified?: boolean;
    adminNotes?: string;
    rejectionReason?: string;
  }): Promise<ListingVerification> => {
    const res = await api.post(`/admin/verifications/listings/${verificationId}/review`, data);
    return res.data;
  },

  getPendingRenters: async (): Promise<RenterVerification[]> => {
    const res = await api.get('/admin/verifications/renters');
    return res.data;
  },

  reviewRenter: async (verificationId: number, data: {
    status: string;
    adminNotes?: string;
    rejectionReason?: string;
  }): Promise<RenterVerification> => {
    const res = await api.post(`/admin/verifications/renters/${verificationId}/review`, data);
    return res.data;
  },

  getReports: async (): Promise<UserReport[]> => {
    const res = await api.get('/admin/reports');
    return res.data;
  },

  resolveReport: async (reportId: number, data: { action: string; notes?: string }): Promise<UserReport> => {
    const res = await api.post(`/admin/reports/${reportId}/resolve`, data);
    return res.data;
  },

  getAuditLogs: async (): Promise<AuditLog[]> => {
    const res = await api.get('/admin/audit-logs');
    return res.data;
  },

  getLocalities: async (): Promise<Locality[]> => {
    const res = await api.get('/admin/localities');
    return res.data;
  },

  saveLocality: async (locality: Partial<Locality>): Promise<Locality> => {
    const res = await api.post('/admin/localities', locality);
    return res.data;
  }
};
