import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Video, 
  UserCheck, 
  Building,
  KeyRound,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { VisitRequest } from '../types';
import { enquiryVisitService } from '../services/enquiryVisitService';
import { useAuth } from '../context/AuthContext';

export const VisitsPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [receivedVisits, setReceivedVisits] = useState<VisitRequest[]>([]);
  const [sentVisits, setSentVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchVisits = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [rec, sent] = await Promise.all([
        enquiryVisitService.getReceivedVisits(),
        enquiryVisitService.getSentVisits()
      ]);
      setReceivedVisits(rec);
      setSentVisits(sent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [user]);

  const handleUpdateStatus = async (visitId: number, status: string, note?: string) => {
    try {
      setUpdatingId(visitId);
      const updated = await enquiryVisitService.updateVisitStatus(visitId, status, note);
      setReceivedVisits(prev => prev.map(v => v.id === visitId ? updated : v));
      setSentVisits(prev => prev.map(v => v.id === visitId ? updated : v));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Calendar className="w-12 h-12 text-indigo-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign in to View Scheduled Visits</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const activeList = tab === 'received' ? receivedVisits : sentVisits;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Flat Visits & Walkthroughs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Coordinate in-person visits and video tours before confirming your flatmate replacement.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setTab('received')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            tab === 'received' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Received Visit Requests ({receivedVisits.length})</span>
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            tab === 'sent' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Requested Visits ({sentVisits.length})</span>
        </button>
      </div>

      {/* Visits List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading scheduled visits...</div>
      ) : activeList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No {tab} visits at this time</p>
          <p className="text-xs text-slate-400">
            {tab === 'received' 
              ? 'When seekers request physical or video visits, review them here.'
              : 'You can request a visit from any listing page to inspect the room.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeList.map((visit) => {
            const isReceived = tab === 'received';
            const otherParty = isReceived ? visit.requester : visit.poster;

            return (
              <div
                key={visit.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={otherParty.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {isReceived ? `Visitor: ${otherParty.name}` : `Flatmate: ${otherParty.name}`}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {otherParty.occupation || 'Software Professional'}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      visit.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      visit.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                      visit.status === 'DECLINED' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {visit.status === 'ACCEPTED' ? '✓ Visit Confirmed' : visit.status}
                    </span>
                  </div>
                </div>

                {/* Visit details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Date & Time Slot</span>
                    <span className="font-bold text-slate-900">
                      {new Date(visit.preferredDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                    </span>
                    <span className="text-slate-500 block text-[11px]">{visit.timeSlot}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Format</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                      {visit.visitType === 'VIDEO_CALL' ? (
                        <>
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Video Call Walkthrough</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                          <span>In-Person Flat Visit</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Listing</span>
                    <Link
                      to={`/listings/${visit.listing.id}`}
                      className="font-bold text-indigo-600 hover:text-indigo-800 truncate block mt-0.5"
                    >
                      {visit.listing.locality} ({visit.listing.roomType})
                    </Link>
                  </div>
                </div>

                {/* Notes from Requester */}
                {visit.notes && (
                  <div className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{visit.notes}"
                  </div>
                )}

                {/* Poster Response / Address Unlock */}
                {visit.status === 'ACCEPTED' && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Visit Confirmed - Address Unlocked:</span>
                    </div>
                    <p className="font-medium text-emerald-900 leading-relaxed">
                      {visit.posterResponseNote || `Flat address: ${visit.listing.addressApproximate}. Gate entry pass is registered. Call ${visit.poster.phone} upon arrival.`}
                    </p>
                  </div>
                )}

                {/* Actions for Poster */}
                {isReceived && visit.status === 'PENDING' && (
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() => {
                        const note = prompt('Add gate pass / society tower details for visitor:', 'Flat 402, Tower B. Gate pass registered.');
                        handleUpdateStatus(visit.id, 'ACCEPTED', note || undefined);
                      }}
                      disabled={updatingId === visit.id}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Visit Slot</span>
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(visit.id, 'DECLINED')}
                      disabled={updatingId === visit.id}
                      className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                )}

                {/* Mark as Completed */}
                {visit.status === 'ACCEPTED' && isReceived && (
                  <div className="pt-1">
                    <button
                      onClick={() => handleUpdateStatus(visit.id, 'COMPLETED')}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                    >
                      Mark Visit Completed ✓
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
