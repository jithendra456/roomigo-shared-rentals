import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Inbox
} from 'lucide-react';
import { Enquiry } from '../types';
import { enquiryVisitService } from '../services/enquiryVisitService';
import { useAuth } from '../context/AuthContext';

export const EnquiriesPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [receivedEnquiries, setReceivedEnquiries] = useState<Enquiry[]>([]);
  const [sentEnquiries, setSentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Replying state
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [sendingReply, setSendingReply] = useState<boolean>(false);

  const fetchEnquiries = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [rec, sent] = await Promise.all([
        enquiryVisitService.getReceivedEnquiries(),
        enquiryVisitService.getSentEnquiries()
      ]);
      setReceivedEnquiries(rec);
      setSentEnquiries(sent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [user]);

  const handleSendReply = async (enquiryId: number) => {
    if (!replyText.trim()) return;
    try {
      setSendingReply(true);
      const updated = await enquiryVisitService.replyEnquiry(enquiryId, replyText);
      setReceivedEnquiries(prev => prev.map(e => e.id === enquiryId ? updated : e));
      setReplyingId(null);
      setReplyText('');
    } catch (err) {
      console.error(err);
    } finally {
      setSendingReply(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <MessageSquare className="w-12 h-12 text-indigo-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign in to View Enquiries</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const activeList = tab === 'received' ? receivedEnquiries : sentEnquiries;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Flatmate Enquiries & Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct communication between replacement flatmates and seekers.
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
          <span>Received ({receivedEnquiries.length})</span>
        </button>
        <button
          onClick={() => setTab('sent')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
            tab === 'sent' 
              ? 'border-indigo-600 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Sent Enquiries ({sentEnquiries.length})</span>
        </button>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading enquiries...</div>
      ) : activeList.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <Inbox className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No {tab} enquiries yet</p>
          <p className="text-xs text-slate-400">
            {tab === 'received' 
              ? 'When seekers reach out about your room, their messages will appear here.'
              : 'When you enquire about a vacancy, you can track responses here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeList.map((enq) => {
            const isReceived = tab === 'received';
            const otherParty = isReceived ? enq.sender : enq.recipient;

            return (
              <div
                key={enq.id}
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
                        {isReceived ? `From: ${otherParty.name}` : `To: ${otherParty.name}`}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {enq.senderOccupation || otherParty.occupation || 'Working Professional'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/listings/${enq.listing.id}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{enq.listing.locality} Flat</span>
                    </Link>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(enq.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Message body */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-800 leading-relaxed">
                  "{enq.message}"
                </div>

                {/* Move in & Phone details */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {enq.moveInDate && (
                    <span>Expected Move-in: <strong>{new Date(enq.moveInDate).toLocaleDateString('en-IN')}</strong></span>
                  )}
                  {enq.senderPhone && (
                    <span>Phone: <strong>{enq.senderPhone}</strong></span>
                  )}
                </div>

                {/* Reply section */}
                {enq.reply ? (
                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Reply from Flatmate:</span>
                    </div>
                    <p className="text-xs text-indigo-950 italic">"{enq.reply}"</p>
                  </div>
                ) : isReceived ? (
                  replyingId === enq.id ? (
                    <div className="pt-2 space-y-2">
                      <textarea
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your response to the seeker..."
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSendReply(enq.id)}
                          disabled={sendingReply}
                          className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{sendingReply ? 'Sending...' : 'Send Reply'}</span>
                        </button>
                        <button
                          onClick={() => setReplyingId(null)}
                          className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setReplyingId(enq.id); setReplyText(''); }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply to Seeker</span>
                    </button>
                  )
                ) : (
                  <div className="text-[11px] text-amber-600 font-medium">
                    Awaiting flatmate response. You will receive an alert once they reply.
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
