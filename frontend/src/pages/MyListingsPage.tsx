import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  ShieldCheck, 
  RotateCw, 
  CheckCircle2, 
  Trash2, 
  PlusCircle, 
  ExternalLink,
  AlertCircle,
  Eye,
  Check
} from 'lucide-react';
import { Listing } from '../types';
import { listingService } from '../services/listingService';
import { useAuth } from '../context/AuthContext';

export const MyListingsPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reconfirmingId, setReconfirmingId] = useState<number | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchMyListings = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await listingService.getMyListings();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  const handleReconfirm = async (listingId: number) => {
    try {
      setReconfirmingId(listingId);
      const updated = await listingService.reconfirmAvailability(listingId);
      setListings(prev => prev.map(l => l.id === listingId ? updated : l));
      setActionSuccess('Vacancy reconfirmed! Your listing is renewed for 7 days.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setReconfirmingId(null);
    }
  };

  const handleMarkOccupied = async (listingId: number) => {
    if (!window.confirm('Mark this vacancy as occupied / filled? It will no longer appear in search results.')) return;
    try {
      await listingService.markOccupied(listingId);
      setListings(prev => prev.map(l => l.id === listingId ? { ...l, status: 'OCCUPIED' } : l));
      setActionSuccess('Listing marked as occupied.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (listingId: number) => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      await listingService.deleteListing(listingId);
      setListings(prev => prev.filter(l => l.id !== listingId));
      setActionSuccess('Listing deleted.');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Home className="w-12 h-12 text-indigo-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign in to Manage Vacancies</h2>
        <p className="text-xs text-slate-500">View your posted replacement flatmate vacancies, expiry dates, and reconfirm availability.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Vacancies & Availability
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your shared flat vacancies, reconfirm active status, or mark rooms as filled.
          </p>
        </div>

        <Link
          to="/post-vacancy"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Vacancy</span>
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Explanatory 7-day Card */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
          <Clock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
            Roomigo 7-Day Availability Guarantee
          </h3>
          <p className="text-xs text-indigo-800 leading-relaxed">
            To prevent expired and fake ads, every listing stays active for 7 days. 
            Click the <strong>"Reconfirm Availability"</strong> button anytime to extend its validity by another 7 days and push your vacancy to the top of search results.
          </p>
        </div>
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading your vacancies...</div>
      ) : listings.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Home className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">You haven't posted any vacancies yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Moving out or seeking a replacement flatmate? Post your room to connect with verified seekers.
          </p>
          <Link
            to="/post-vacancy"
            className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow"
          >
            Post a Vacancy Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map((l) => (
            <div
              key={l.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="flex items-start gap-4 flex-1">
                <img
                  src={l.photos?.split(',')[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80'}
                  alt={l.title}
                  className="w-24 h-24 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                      {l.listingType.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      l.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                      l.status === 'PENDING_VERIFICATION' ? 'bg-amber-100 text-amber-800' :
                      l.status === 'EXPIRED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {l.status}
                    </span>
                    {l.verified && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> Verified Authority
                      </span>
                    )}
                  </div>

                  <Link to={`/listings/${l.id}`} className="hover:text-indigo-600 transition-colors">
                    <h3 className="font-bold text-slate-900 text-sm truncate">{l.title}</h3>
                  </Link>

                  <p className="text-xs text-slate-500">
                    {l.locality} • ₹{l.rentAmount.toLocaleString('en-IN')}/mo • {l.roomType}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      Reconfirmed: {l.reconfirmedTimeAgo || 'Recently'}
                    </span>
                    <span>•</span>
                    <span className={l.expiringSoon ? 'text-amber-600 font-bold' : ''}>
                      {l.expired ? 'Expired' : `${l.daysRemaining} days remaining`}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {l.viewsCount} views
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                
                {/* 1-Click Reconfirm Button */}
                <button
                  onClick={() => handleReconfirm(l.id)}
                  disabled={reconfirmingId === l.id || l.status === 'OCCUPIED'}
                  className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                  title="Reconfirm vacancy is still available for another 7 days"
                >
                  <RotateCw className={`w-3.5 h-3.5 text-emerald-600 ${reconfirmingId === l.id ? 'animate-spin' : ''}`} />
                  <span>{reconfirmingId === l.id ? 'Reconfirming...' : 'Reconfirm Availability (7 Days)'}</span>
                </button>

                {/* Mark as Occupied */}
                {l.status !== 'OCCUPIED' && (
                  <button
                    onClick={() => handleMarkOccupied(l.id)}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all"
                  >
                    Mark Occupied
                  </button>
                )}

                {/* View Details Link */}
                <Link
                  to={`/listings/${l.id}`}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                  title="View Public Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(l.id)}
                  className="p-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600"
                  title="Delete listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
