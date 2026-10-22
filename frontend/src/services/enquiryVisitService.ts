import api from './api';
import { Enquiry, VisitRequest } from '../types';

export const enquiryVisitService = {
  // Enquiries
  sendEnquiry: async (data: { listingId: number; message: string; senderOccupation?: string; moveInDate?: string; senderPhone?: string }): Promise<Enquiry> => {
    const res = await api.post('/enquiries', data);
    return res.data;
  },

  getReceivedEnquiries: async (): Promise<Enquiry[]> => {
    const res = await api.get('/enquiries/received');
    return res.data;
  },

  getSentEnquiries: async (): Promise<Enquiry[]> => {
    const res = await api.get('/enquiries/sent');
    return res.data;
  },

  replyEnquiry: async (enquiryId: number, reply: string): Promise<Enquiry> => {
    const res = await api.post(`/enquiries/${enquiryId}/reply`, { reply });
    return res.data;
  },

  // Visits
  scheduleVisit: async (data: { listingId: number; preferredDate: string; timeSlot: string; visitType?: string; notes?: string }): Promise<VisitRequest> => {
    const res = await api.post('/visits', data);
    return res.data;
  },

  getReceivedVisits: async (): Promise<VisitRequest[]> => {
    const res = await api.get('/visits/received');
    return res.data;
  },

  getSentVisits: async (): Promise<VisitRequest[]> => {
    const res = await api.get('/visits/sent');
    return res.data;
  },

  updateVisitStatus: async (visitId: number, status: string, posterResponseNote?: string): Promise<VisitRequest> => {
    const res = await api.patch(`/visits/${visitId}/status`, { status, posterResponseNote });
    return res.data;
  },

  // Reports
  submitReport: async (data: { listingId: number; reasonCategory: string; description: string }): Promise<any> => {
    const res = await api.post('/reports', data);
    return res.data;
  }
};
