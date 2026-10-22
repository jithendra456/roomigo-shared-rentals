import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (userData: any): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  requestPhoneOtp: async (phone: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/auth/phone/otp', { phone });
    return res.data;
  },

  verifyPhoneOtp: async (phone: string, otp: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post('/auth/phone/verify', { phone, otp });
    return res.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const res = await api.put('/auth/profile', userData);
    return res.data;
  }
};
