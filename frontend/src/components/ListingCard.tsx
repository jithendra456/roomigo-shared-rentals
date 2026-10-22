import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Heart, 
  Sparkles, 
  Users, 
  Bath, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Listing } from '../types';
import { listingService } from '../services/listingService';
import { useAuth } from '../context/AuthContext';

interface ListingCardProps {
  listing: Listing;
  initialFavourited?: boolean;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, initialFavourited = false }) => {
  const { user, openAuthModal } = useAuth();
  const [favourited, setFavourited] = useState<boolean>(initialFavourited);
  const [isFavLoading, setIsFavLoading] = useState<boolean>(false);

  const handleToggleFavourite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      openAuthModal('login');
      return;
    }

    try {
      setIsFavLoading(true);
      const res = await listingService.toggleFavourite(listing.id);
      setFavourited(res.favourited);
    } catch (err) {
      console.error('Failed to toggle favourite', err);
    } finally {
      setIsFavLoading(false);
    }
  };

  const photosList = listing.photos ? listing.photos.split(',') : [];
  const primaryPhoto = photosList[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80';

  // Format currency
  const formattedRent = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(listing.rentAmount);

  const formattedDeposit = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(listing.depositAmount);

  // Type badge styling
  const getTypeBadge = () => {
    if (listing.listingType === 'REPLACEMENT_FLATMATE') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
          <Sparkles className="w-3 h-3 text-amber-300" />
          Replacement Flatmate
        </span>
      );
    } else if (listing.listingType === 'AVAILABLE_ROOM') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
          Available Room
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-700 text-white text-[11px] font-bold tracking-wide uppercase shadow-sm">
          Shared Flat
        </span>
      );
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={primaryPhoto}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Priority Badge */}
        <div className="absolute top-3 left-3 z-10">
          {getTypeBadge()}
        </div>

        {/* Favourite Button */}
        <button
          onClick={handleToggleFavourite}
          disabled={isFavLoading}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            favourited 
              ? 'bg-rose-500 text-white shadow-md' 
              : 'bg-white/80 backdrop-blur-md text-slate-700 hover:bg-white hover:text-rose-500 shadow-sm'
          }`}
          title={favourited ? 'Remove from saved' : 'Save room'}
        >
          <Heart className={`w-4 h-4 ${favourited ? 'fill-white' : ''}`} />
        </button>

        {/* Reconfirmation / Freshness Badge */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium shadow-sm">
          <Clock className={`w-3.5 h-3.5 ${listing.expiringSoon ? 'text-amber-400' : 'text-emerald-400'}`} />
          <span>
            {listing.expiringSoon 
              ? `Reconfirm soon (${listing.daysRemaining}d left)`
              : `Reconfirmed ${listing.reconfirmedTimeAgo || 'recently'}`
            }
          </span>
        </div>

        {/* Gender Preference Tag */}
        <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-semibold">
          {listing.preferredGender}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          
          {/* Locality & Verification Tick */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <div className="flex items-center gap-1 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-bold text-slate-900">{listing.locality}</span>
              <span className="text-slate-400">•</span>
              <span className="truncate max-w-[140px]">{listing.addressApproximate}</span>
            </div>

            {listing.verified && (
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/listings/${listing.id}`}>
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
              {listing.title}
            </h3>
          </Link>

          {/* Key Specs Pills */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-600">
            <span className="px-2 py-1 rounded-md bg-slate-100 font-medium">
              {listing.bhkType}
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-100 font-medium">
              {listing.roomType}
            </span>
            <span className="px-2 py-1 rounded-md bg-slate-100 font-medium">
              {listing.furnishing}
            </span>
            {listing.attachedBathroom && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-medium">
                <Bath className="w-3 h-3" />
                Attached Bath
              </span>
            )}
          </div>

          {/* Flatmate Vibe Snippet */}
          {listing.flatmateVibe && (
            <p className="mt-3 text-xs text-slate-500 italic line-clamp-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
              "{listing.flatmateVibe}"
            </p>
          )}
        </div>

        {/* Financials & Action Footer */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {formattedRent}
              </span>
              <span className="text-xs text-slate-500 font-medium">/month</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Deposit: {formattedDeposit} {listing.maintenanceAmount > 0 && `• +₹${listing.maintenanceAmount} maint`}
            </div>
          </div>

          <Link
            to={`/listings/${listing.id}`}
            className="px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
          >
            <span>View Flat</span>
            <span className="text-sm">→</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
