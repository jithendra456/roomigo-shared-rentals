export type Role = 'ROLE_RENTER' | 'ROLE_POSTER' | 'ROLE_ADMIN';

export type VerificationStatus = 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED' | 'EXPIRED';

export type ListingType = 'REPLACEMENT_FLATMATE' | 'AVAILABLE_ROOM' | 'SHARED_ACCOMMODATION';

export type ListingStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'REJECTED' | 'EXPIRED' | 'OCCUPIED';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  bio?: string;
  occupation?: string;
  companyOrCollege?: string;
  gender?: string;
  phoneVerified: boolean;
  idVerified: boolean;
  verificationStatus: VerificationStatus;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
  occupation?: string;
  companyOrCollege?: string;
  avatarUrl?: string;
  phoneVerified: boolean;
  idVerified: boolean;
  verificationStatus: VerificationStatus;
}

export interface Listing {
  id: number;
  title: string;
  description: string;
  listingType: ListingType;
  status: ListingStatus;
  locality: string;
  addressApproximate: string;
  landmark?: string;
  city: string;
  pinCode?: string;
  latitude?: number;
  longitude?: number;
  rentAmount: number;
  depositAmount: number;
  maintenanceAmount: number;
  utilitiesIncluded: boolean;
  utilitiesEstimate: number;
  foodArrangement?: string;
  bhkType: string;
  roomType: string;
  attachedBathroom: boolean;
  balcony: boolean;
  furnishing: string;
  preferredGender: string;
  currentFlatmatesCount: number;
  totalRooms: number;
  vacantRooms: number;
  moveInDate?: string;
  flatmateVibe?: string;
  amenities?: string;
  houseRules?: string;
  photos?: string;
  verified: boolean;
  lastReconfirmedAt?: string;
  expiryDate?: string;
  viewsCount: number;
  createdAt?: string;
  reconfirmedTimeAgo?: string;
  fresh: boolean;
  expiringSoon: boolean;
  expired: boolean;
  daysRemaining: number;
  posterId: number;
  posterName: string;
  posterEmail?: string;
  posterPhone?: string;
  posterOccupation?: string;
  posterCompany?: string;
  posterAvatarUrl?: string;
  posterPhoneVerified: boolean;
  posterIdVerified: boolean;
  posterRelationship?: string;
  locationVerified?: boolean;
  rentVerified?: boolean;
  photosVerified?: boolean;
  rulesVerified?: boolean;
}

export interface ListingVerification {
  id: number;
  listing: Listing;
  posterRelationship: string;
  authorityProofType: string;
  documentUrl?: string;
  approxLocationVerified: boolean;
  rentVerified: boolean;
  photosVerified: boolean;
  rulesVerified: boolean;
  status: VerificationStatus;
  adminNotes?: string;
  rejectionReason?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface RenterVerification {
  id: number;
  userId: number;
  idType: string;
  idNumberMasked: string;
  documentUrl?: string;
  companyOrCollege?: string;
  workEmail?: string;
  linkedinUrl?: string;
  status: VerificationStatus;
  adminNotes?: string;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface Enquiry {
  id: number;
  listing: Listing;
  sender: User;
  recipient: User;
  message: string;
  senderOccupation?: string;
  moveInDate?: string;
  senderPhone?: string;
  senderEmail?: string;
  reply?: string;
  status: string;
  createdAt: string;
  repliedAt?: string;
}

export interface VisitRequest {
  id: number;
  listing: Listing;
  requester: User;
  poster: User;
  preferredDate: string;
  timeSlot: string;
  visitType: string;
  notes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
  posterResponseNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Locality {
  id: number;
  name: string;
  city: string;
  itHubZone: string;
  avgRent: number;
  activeListingsCount: number;
  popular: boolean;
  imageUrl?: string;
  description?: string;
}

export interface UserReport {
  id: number;
  listing: Listing;
  reporter: User;
  reasonCategory: string;
  description: string;
  status: string;
  adminAction?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  actorId?: number;
  actorEmail?: string;
  action: string;
  targetType: string;
  targetId?: number;
  details?: string;
  createdAt: string;
}

export interface AdminStats {
  totalListings: number;
  activeListings: number;
  pendingVerifications: number;
  expiredListings: number;
  totalUsers: number;
  totalEnquiries: number;
  totalVisits: number;
  pendingReports: number;
  verifiedRentersCount: number;
}
