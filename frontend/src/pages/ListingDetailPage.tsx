import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Heart, 
  Calendar, 
  MessageSquare, 
  AlertTriangle, 
  Share2, 
  CheckCircle2, 
  Users, 
  Bath, 
  Home, 
  Wifi, 
  Wind, 
  Tv, 
  Car, 
  Dumbbell, 
  Lock, 
  Check, 
  AlertCircle,
  Copy,
  ChevronLeft,
  X
} from 'lucide-react';
import { Listing } from '../types';
import { listingService } from '../services/listingService';
import { enquiryVisitService } from '../services/enquiryVisitService';
import { useAuth } from '../context/AuthContext';
import { SafetyBanner } from '../components/SafetyBanner';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favourited, setFavourited] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Modals state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryMessage, setEnquiryMessage] = useState<string>('');
  const [enquiryOccupation, setEnquiryOccupation] = useState<string>('');
  const [enquiryMoveInDate, setEnquiryMoveInDate] = useState<string>('');
  const [enquiryPhone, setEnquiryPhone] = useState<string>('');
  const [enquiryStatus, setEnquiryStatus] = useState<string | null>(null);

  const [visitModalOpen, setVisitModalOpen] = useState<boolean>(false);
  const [visitDate, setVisitDate] = useState<string>('');
  const [visitTimeSlot, setVisitTimeSlot] = useState<string>('Evening (4 PM - 8 PM)');
  const [visitType, setVisitType] = useState<string>('IN_PERSON');
  const [visitNotes, setVisitNotes] = useState<string>('');
  const [visitStatus, setVisitStatus] = useState<string | null>(null);

  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [reportCategory, setReportCategory] = useState<string>('INACCURATE_RENT_OR_DEPOSIT');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  // Owner management state
  const isOwner = Boolean(
    user &&
    listing &&
    (
      (user.id != null && listing.posterId != null && String(user.id) === String(listing.posterId)) ||
      (user.email && listing.posterEmail && user.email.trim().toLowerCase() === listing.posterEmail.trim().toLowerCase()) ||
      (user.name && listing.posterName && (
        user.name.trim().toLowerCase() === listing.posterName.trim().toLowerCase() ||
        listing.posterName.toLowerCase().includes(user.name.toLowerCase()) ||
        user.name.toLowerCase().includes(listing.posterName.toLowerCase())
      ))
    )
  );
  const [reconfirming, setReconfirming] = useState<boolean>(false);
  const [reconfirmSuccess, setReconfirmSuccess] = useState<string | null>(null);

  const handleReconfirm = async () => {
    if (!listing) return;
    setReconfirming(true);
    try {
      const updated = await listingService.reconfirmAvailability(listing.id);
      setListing(updated);
      setReconfirmSuccess('Availability reconfirmed for another 7 days!');
      setTimeout(() => setReconfirmSuccess(null), 4000);
    } catch (e: any) {
      console.error(e);
    } finally {
      setReconfirming(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await listingService.getListingById(parseInt(id));
        setListing(data);
        if (user) {
          const favCheck = await listingService.checkFavourite(data.id);
          setFavourited(favCheck.favourited);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Listing not found');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, user]);

  const handleToggleFavourite = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!listing) return;
    try {
      const res = await listingService.toggleFavourite(listing.id);
      setFavourited(res.favourited);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSendEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!listing) return;

    try {
      await enquiryVisitService.sendEnquiry({
        listingId: listing.id,
        message: enquiryMessage,
        senderOccupation: enquiryOccupation || user.occupation,
        moveInDate: enquiryMoveInDate || undefined,
        senderPhone: enquiryPhone || user.phone,
      });
      setEnquiryStatus('Enquiry sent successfully! The poster has been notified.');
      setTimeout(() => {
        setEnquiryModalOpen(false);
        setEnquiryStatus(null);
        setEnquiryMessage('');
      }, 2000);
    } catch (err: any) {
      setEnquiryStatus('Failed to send enquiry. Please try again.');
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!listing) return;

    try {
      await enquiryVisitService.scheduleVisit({
        listingId: listing.id,
        preferredDate: visitDate,
        timeSlot: visitTimeSlot,
        visitType: visitType,
        notes: visitNotes,
      });
      setVisitStatus('Visit scheduled! The flatmates will confirm your slot.');
      setTimeout(() => {
        setVisitModalOpen(false);
        setVisitStatus(null);
        setVisitNotes('');
      }, 2000);
    } catch (err: any) {
      setVisitStatus('Failed to schedule visit. Please check the date.');
    }
  };

  const handleReportListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!listing) return;

    try {
      await enquiryVisitService.submitReport({
        listingId: listing.id,
        reasonCategory: reportCategory,
        description: reportDescription,
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSuccess(false);
        setReportDescription('');
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-600">Loading verified flat vacancy details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Vacancy Not Available</h2>
        <p className="text-xs text-slate-500">{error || 'This listing might have expired or been filled.'}</p>
        <Link
          to="/search"
          className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
        >
          Browse Other Hyderabad Vacancies
        </Link>
      </div>
    );
  }

  const photosList = listing.photos ? listing.photos.split(',') : [];
  const amenitiesList = listing.amenities ? listing.amenities.split(',').map(s => s.trim()) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Back button & Breadcrumbs */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 hover:text-indigo-600 font-semibold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to results</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-all"
            title="Share vacancy"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handleToggleFavourite}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
              favourited 
                ? 'border-rose-300 bg-rose-50 text-rose-700 font-bold' 
                : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favourited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{favourited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Freshness & 7-Day Reconfirmation Guarantee Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-indigo-900/40">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Verified Fresh Vacancy
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">
                Reconfirmed {listing.reconfirmedTimeAgo || 'recently'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Roomigo 7-Day Rule: This post is guaranteed active and valid for the next {listing.daysRemaining} days.
            </p>
          </div>
        </div>

        {listing.verified && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Tenancy Authority Verified</span>
          </div>
        )}
      </div>

      {/* Photo Gallery Grid */}
      <div className="space-y-3">
        <div className="aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-900 shadow-md relative">
          <img
            src={photosList[selectedPhotoIndex] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow">
            {listing.listingType.replace('_', ' ')}
          </div>
          <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium">
            Photo {selectedPhotoIndex + 1} of {photosList.length || 1}
          </div>
        </div>

        {/* Thumbnails */}
        {photosList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {photosList.map((photo, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  selectedPhotoIndex === idx ? 'border-indigo-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Title & Locality Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-900 font-bold">{listing.locality}</span>
              <span>•</span>
              <span>{listing.addressApproximate}</span>
              {listing.landmark && <span>(Near {listing.landmark})</span>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {listing.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="px-3 py-1 rounded-lg bg-slate-100 font-semibold">{listing.bhkType}</span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 font-semibold">{listing.roomType}</span>
              <span className="px-3 py-1 rounded-lg bg-slate-100 font-semibold">{listing.furnishing}</span>
              <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold">
                Looking for: {listing.preferredGender} flatmate
              </span>
            </div>
          </div>

          {/* Meaningful Verification Checklist Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Roomigo Two-Sided Trust Checklist</h3>
              </div>
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Post
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Authority to Offer Replacement</p>
                  <p className="text-slate-500 text-[11px]">
                    {listing.posterRelationship || 'Current Tenant on agreement'} verified via lease contract / landlord written consent.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Approximate Location Confirmed</p>
                  <p className="text-slate-500 text-[11px]">
                    Building and society gate verified. Exact flat number shielded for safety.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Zero Brokerage & Fair Split</p>
                  <p className="text-slate-500 text-[11px]">
                    Rent of ₹{listing.rentAmount.toLocaleString('en-IN')} matches actual flatmate split with zero hidden fees.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Authentic Photos & Rules</p>
                  <p className="text-slate-500 text-[11px]">
                    Photos reviewed against stock imagery. House rules transparently listed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">About the Vacancy</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Flatmate Culture & Vibe */}
          {listing.flatmateVibe && (
            <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span>Existing Flatmates & Vibe</span>
              </h3>
              <p className="text-sm text-indigo-950 font-medium italic">
                "{listing.flatmateVibe}"
              </p>
              <div className="text-xs text-indigo-700/80 pt-1">
                Currently living here: <strong>{listing.currentFlatmatesCount} flatmates</strong> in a {listing.totalRooms}-room flat.
              </div>
            </div>
          )}

          {/* House Rules & Move-in details */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">House Rules & Move-in</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block mb-0.5">Move-in Date:</span>
                <span className="font-bold text-slate-900">
                  {listing.moveInDate ? new Date(listing.moveInDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) : 'Immediate / Flexible'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Food Arrangement:</span>
                <span className="font-bold text-slate-900">{listing.foodArrangement || 'Self-cook / Flexible'}</span>
              </div>
            </div>
            {listing.houseRules && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-slate-500 text-xs block mb-1">House Guidelines:</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {listing.houseRules}
                </p>
              </div>
            )}
          </div>

          {/* Amenities Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Amenities & Flat Features</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenitiesList.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Approximate Location Notice */}
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 text-sm font-bold">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Location: {listing.locality}, Hyderabad</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Approximate Location: <strong>{listing.addressApproximate}</strong>.
              For resident privacy and safety, the precise flat and floor number is shared automatically once your visit request is accepted by the flatmate.
            </p>
          </div>

          {/* Safety Advisory Banner */}
          <SafetyBanner />

          {/* Report Button or Owner Manage */}
          {!isOwner ? (
            <div className="pt-2">
              <button
                onClick={() => {
                  if (!user) openAuthModal('login');
                  else setReportModalOpen(true);
                }}
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Report this vacancy (Fake ad, broker, or inaccurate rent)</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 flex items-center gap-2">
              <Link
                to="/my-listings"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Edit or manage this post in My Listings →</span>
              </Link>
            </div>
          )}

        </div>

        {/* Right Column: Pricing Breakdown & Contact Actions */}
        <div className="space-y-6 lg:sticky lg:top-24">
          
          {/* Financial Breakdown Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg space-y-6">
            
            {/* Price Header */}
            <div className="space-y-1 pb-4 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Monthly Rent
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  ₹{listing.rentAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ flatmate</span>
              </div>
            </div>

            {/* Cost Breakdown Table */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Security Deposit</span>
                <span className="font-bold text-slate-900">
                  ₹{listing.depositAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Monthly Maintenance</span>
                <span className="font-bold text-slate-900">
                  {listing.maintenanceAmount > 0 ? `₹${listing.maintenanceAmount.toLocaleString('en-IN')}` : 'Included in rent'}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Utilities (Wi-Fi, Power, Maid)</span>
                <span className="font-bold text-slate-900">
                  {listing.utilitiesIncluded ? 'Included' : `~₹${listing.utilitiesEstimate}/mo per person`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Brokerage</span>
                <span className="font-bold text-emerald-600">₹0 (Zero Brokerage)</span>
              </div>
            </div>

            {/* Action Buttons: Host vs Seeker view */}
            {isOwner ? (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>You posted this flatmate vacancy</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Seekers reach out to you using visit requests and direct messages. You can reconfirm availability or view incoming requests below.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReconfirm}
                  disabled={reconfirming}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>{reconfirming ? 'Reconfirming...' : 'Reconfirm Availability (7 Days)'}</span>
                </button>

                {reconfirmSuccess && (
                  <p className="text-[11px] text-center font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg border border-emerald-200">
                    ✓ {reconfirmSuccess}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/enquiries"
                    className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Messages</span>
                  </Link>

                  <Link
                    to="/visits"
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs text-center flex items-center justify-center gap-1.5 transition border border-slate-200"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Visits</span>
                  </Link>
                </div>

                <Link
                  to="/my-listings"
                  className="block w-full py-1 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                >
                  Manage all my vacancies →
                </Link>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    if (!user) openAuthModal('login');
                    else setVisitModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule a Visit (Physical / Video)</span>
                </button>

                <button
                  onClick={() => {
                    if (!user) openAuthModal('login');
                    else setEnquiryModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct Enquiry</span>
                </button>
              </div>
            )}

            {/* Poster Profile */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src={listing.posterAvatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={listing.posterName}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{listing.posterName}</p>
                <p className="text-[11px] text-slate-500 truncate">{listing.posterOccupation || 'Tech Professional'}</p>
                <p className="text-[11px] text-slate-400 truncate">{listing.posterCompany || 'Hyderabad'}</p>
                
                <div className="flex items-center gap-2 mt-1">
                  {listing.posterPhoneVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <Check className="w-2.5 h-2.5" /> Phone Verified
                    </span>
                  )}
                  {listing.posterIdVerified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                      <Check className="w-2.5 h-2.5" /> ID Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Modal: Schedule Visit */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Schedule a Flat Visit</h3>
              </div>
              <button onClick={() => setVisitModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {visitStatus ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-900">{visitStatus}</p>
              </div>
            ) : (
              <form onSubmit={handleScheduleVisit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                  <select
                    value={visitTimeSlot}
                    onChange={(e) => setVisitTimeSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                    <option value="Evening (4 PM - 8 PM)">Evening (4 PM - 8 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visit Format</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVisitType('IN_PERSON')}
                      className={`p-2 rounded-lg border text-center font-bold ${
                        visitType === 'IN_PERSON' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      In-Person Visit
                    </button>
                    <button
                      type="button"
                      onClick={() => setVisitType('VIDEO_CALL')}
                      className={`p-2 rounded-lg border text-center font-bold ${
                        visitType === 'VIDEO_CALL' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      Video Call Tour
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Note to Flatmates (Optional)</label>
                  <textarea
                    rows={2}
                    value={visitNotes}
                    onChange={(e) => setVisitNotes(e.target.value)}
                    placeholder="e.g. Coming after office around 6:30 PM."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Send Visit Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Send Enquiry */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Direct Flatmate Enquiry</h3>
              </div>
              <button onClick={() => setEnquiryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {enquiryStatus ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-900">{enquiryStatus}</p>
              </div>
            ) : (
              <form onSubmit={handleSendEnquiry} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={enquiryMessage}
                    onChange={(e) => setEnquiryMessage(e.target.value)}
                    placeholder="Hi! I am interested in the room. I work at Oracle in HITEC City and am looking to move in next month..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Occupation</label>
                    <input
                      type="text"
                      value={enquiryOccupation}
                      onChange={(e) => setEnquiryOccupation(e.target.value)}
                      placeholder="e.g. SDE at Microsoft"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Expected Move-in</label>
                    <input
                      type="date"
                      value={enquiryMoveInDate}
                      onChange={(e) => setEnquiryMoveInDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Report Listing */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-sm">Report Suspicious Vacancy</h3>
              </div>
              <button onClick={() => setReportModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {reportSuccess ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-slate-900">
                  Report submitted. Our moderation team reviews flagged listings within 4 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportListing} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Report</label>
                  <select
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  >
                    <option value="ALREADY_OCCUPIED">Already Occupied / Not Available</option>
                    <option value="INACCURATE_RENT_OR_DEPOSIT">Inaccurate Rent or Deposit (Demanded more offline)</option>
                    <option value="BROKER_OR_COMMERCIAL_SCAM">Broker / Agent Posing as Flatmate</option>
                    <option value="FAKE_OR_MISLEADING_PHOTOS">Fake or Misleading Photos</option>
                    <option value="NO_REPLACEMENT_AUTHORITY">No Replacement Authority / Landlord Dispute</option>
                    <option value="OTHER">Other Violation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Explanation</label>
                  <textarea
                    required
                    rows={3}
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Provide details so our admin team can investigate..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Submit Report
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
