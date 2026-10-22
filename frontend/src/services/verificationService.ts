import api from './api';
import { RenterVerification } from '../types';

export const verificationService = {
  getVerificationInfo: async (): Promise<any> => {
    const res = await api.get('/verification/info');
    return res.data;
  },

  submitRenterVerification: async (data: any): Promise<RenterVerification> => {
    const res = await api.post('/verification/renter', data);
    return res.data;
  },

  getMyVerification: async (): Promise<RenterVerification> => {
    const res = await api.get('/verification/renter/my');
    return res.data;
  }
};
