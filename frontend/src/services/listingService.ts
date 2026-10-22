import api from './api';
import { Listing, Locality } from '../types';

export interface SearchParams {
  locality?: string;
  listingType?: string;
  roomType?: string;
  furnishing?: string;
  preferredGender?: string;
  minRent?: number;
  maxRent?: number;
  verifiedOnly?: boolean;
  sort?: string;
  page?: number;
  size?: number;
}

export const listingService = {
  searchListings: async (params: SearchParams): Promise<{ content: Listing[]; totalPages: number; totalElements: number }> => {
    const res = await api.get('/listings/search', { params });
    return res.data;
  },

  getRecentVacancies: async (): Promise<Listing[]> => {
    const res = await api.get('/listings/recent');
    return res.data;
  },

  getListingById: async (id: number): Promise<Listing> => {
    const res = await api.get(`/listings/${id}`);
    return res.data;
  },

  createListing: async (listingData: any): Promise<Listing> => {
    const res = await api.post('/listings', listingData);
    return res.data;
  },

  reconfirmAvailability: async (id: number): Promise<Listing> => {
    const res = await api.post(`/listings/${id}/reconfirm`);
    return res.data;
  },

  markOccupied: async (id: number): Promise<void> => {
    await api.post(`/listings/${id}/occupied`);
  },

  deleteListing: async (id: number): Promise<void> => {
    await api.delete(`/listings/${id}`);
  },

  getMyListings: async (): Promise<Listing[]> => {
    const res = await api.get('/listings/my');
    return res.data;
  },

  getLocalities: async (): Promise<Locality[]> => {
    const res = await api.get('/localities');
    return res.data;
  },

  getPopularLocalities: async (): Promise<Locality[]> => {
    const res = await api.get('/localities/popular');
    return res.data;
  },

  toggleFavourite: async (listingId: number): Promise<{ favourited: boolean }> => {
    const res = await api.post(`/favourites/${listingId}/toggle`);
    return res.data;
  },

  getMyFavourites: async (): Promise<Listing[]> => {
    const res = await api.get('/favourites/my');
    return res.data;
  },

  checkFavourite: async (listingId: number): Promise<{ favourited: boolean }> => {
    const res = await api.get(`/favourites/${listingId}/check`);
    return res.data;
  },

  uploadFile: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
};
