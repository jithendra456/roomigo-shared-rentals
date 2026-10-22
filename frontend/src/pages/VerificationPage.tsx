import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Lock, 
  Users, 
  Building2, 
  Upload, 
  ArrowRight,
  HelpCircle,
  RefreshCw,
  Mail,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { verificationService } from '../services/verificationService';
import { authService } from '../services/authService';
import { listingService } from '../services/listingService';
import { RenterVerification, VerificationStatus } from '../types';

export const VerificationPage: React.FC = () => {
  const { user, refreshUser, openAuthModal } = useAuth();
  const [verificationInfo, setVerificationInfo] = useState<any>(null);
  const [myVerification, setMyVerification] = useState<RenterVerification | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Form State for Renter Verification
  const [idType, setIdType] = useState<string>('EMPLOYEE_ID');
  const [idNumberMasked, setIdNumberMasked] = useState<string>('ORCL-XXXX-8921');
  const [companyOrCollege, setCompanyOrCollege] = useState<string>(user?.companyOrCollege || 'Oracle Financial Services');
  const [workEmail, setWorkEmail] = useState<string>('ananya.sen@oracle.com');
  const [linkedinUrl, setLinkedinUrl] = useState<string>('https://linkedin.com/in/ananya-sen-dev');
  const [documentUrl, setDocumentUrl] = useState<string>('https://roomigo-docs.s3.ap-south-1.amazonaws.com/renters/ananya_oracle_badge.png');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // Phone OTP Verification State
  const [showOtpInput, setShowOtpInput] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [otpSending, setOtpSending] = useState<boolean>(false);
  const [otpVerifying, setOtpVerifying] = useState<boolean>(false);
  const [otpFeedback, setOtpFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSendPhoneOtp = async () => {
    if (!user?.phone) return;
    setOtpSending(true);
    setOtpFeedback(null);
    try {
      await authService.requestPhoneOtp(user.phone);
      setShowOtpInput(true);
      setOtpFeedback({ message: 'OTP sent! Use demo code: 123456', type: 'success' });
    } catch (err: any) {
      setOtpFeedback({ message: 'Failed to send OTP. Please try again.', type: 'error' });
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (!user?.phone || !otpCode) return;
    setOtpVerifying(true);
    setOtpFeedback(null);
    try {
      await authService.verifyPhoneOtp(user.phone, otpCode);
      await refreshUser();
      setShowOtpInput(false);
      setOtpFeedback({ message: 'Phone verified successfully!', type: 'success' });
    } catch (err: any) {
      setOtpFeedback({ message: 'Invalid or expired OTP code (try 123456).', type: 'error' });
    } finally {
      setOtpVerifying(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await verificationService.getVerificationInfo();
        setVerificationInfo(info);
        if (user) {
          const myVer = await verificationService.getMyVerification();
          setMyVerification(myVer);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSubmitRenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);
    try {
      const res = await verificationService.submitRenterVerification({
        idType,
        idNumberMasked,
        companyOrCollege,
        workEmail,
        linkedinUrl,
        documentUrl
      });
      setMyVerification(res);
      await refreshUser();
      setSubmitMessage('Verification submitted successfully! Our verification team will review your credentials within 6 hours.');
    } catch (err: any) {
      setSubmitMessage('Submission failed. Please check the fields.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: VerificationStatus | undefined) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified Profile
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under Review (Pending)
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Corrections Needed / Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-300">
            Not Started
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Roomigo Trust & Verification Hub
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Meaningful verification for both renters and posters. We verify tenancy rights, approximate location, and genuine identities without exposing sensitive private documents.
        </p>
      </div>

      {/* User's Verification Status Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Your Verification Status</h2>
            <p className="text-xs text-slate-500">
              {user ? `Account: ${user.email}` : 'Sign in to check and manage your verification badges.'}
            </p>
          </div>
          <div>{getStatusBadge(user?.verificationStatus)}</div>
        </div>

        {user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Phone Verification</span>
                {!user.phoneVerified && !showOtpInput && (
                  <button
                    type="button"
                    onClick={handleSendPhoneOtp}
                    disabled={otpSending}
                    className="px-2.5 py-0.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition shadow-xs"
                  >
                    {otpSending ? 'Sending...' : 'Verify Phone (OTP)'}
                  </button>
                )}
              </div>

              <div>
                {user.phoneVerified ? (
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified ({user.phone})</span>
                  </p>
                ) : (
                  <p className="font-bold text-slate-800 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Pending OTP Verification</span>
                  </p>
                )}
              </div>

              {!user.phoneVerified && showOtpInput && (
                <div className="pt-2 border-t border-slate-200/80 space-y-2">
                  <p className="text-[11px] text-slate-600 leading-tight">
                    Enter code sent to <span className="font-bold">{user.phone}</span>
                    <span className="block text-[10px] text-indigo-600 font-semibold mt-0.5">Demo OTP: 123456</span>
                  </p>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-24 px-2 py-1 text-center font-mono tracking-widest text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyPhoneOtp}
                      disabled={otpVerifying || otpCode.length !== 6}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      {otpVerifying ? 'Checking...' : 'Verify'}
                    </button>
                  </div>
                </div>
              )}

              {otpFeedback && !user.phoneVerified && (
                <p className={`text-[10px] font-medium ${otpFeedback.type === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {otpFeedback.message}
                </p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Work / Student ID</span>
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                {user.idVerified ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Credentials</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>{myVerification?.status || 'Not Submitted'}</span>
                  </>
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 font-medium">Role on Roomigo</span>
              <p className="font-bold text-slate-800">
                {user.role === 'ROLE_ADMIN' ? 'Platform Administrator' : user.role === 'ROLE_POSTER' ? 'Listing Poster (Flatmate)' : 'Verified Renter'}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              Sign In to View or Submit Verification
            </button>
          </div>
        )}
      </div>

      {/* Renter Verification Submission Form */}
      {user && user.verificationStatus !== 'VERIFIED' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Submit Renter Identity Verification</h2>
            <p className="text-xs text-slate-500">
              Get verified so flatmates know you are a genuine professional or student. Your documents remain confidential.
            </p>
          </div>

          {submitMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium">
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmitRenter} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ID / Proof Type</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="EMPLOYEE_ID">Corporate Employee ID Badge</option>
                  <option value="COLLEGE_ID">Student ID / University Card</option>
                  <option value="AADHAAR">Masked Aadhaar Card (Last 4 digits)</option>
                  <option value="PAN">PAN Card</option>
                  <option value="PASSPORT">Passport</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Masked ID Number</label>
                <input
                  type="text"
                  required
                  value={idNumberMasked}
                  onChange={(e) => setIdNumberMasked(e.target.value)}
                  placeholder="e.g. XXXX-XXXX-4921 or EMP-XXXX-123"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Institution Name</label>
                <input
                  type="text"
                  required
                  value={companyOrCollege}
                  onChange={(e) => setCompanyOrCollege(e.target.value)}
                  placeholder="e.g. Oracle / Microsoft / ISB"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Work / College Email</label>
                <input
                  type="email"
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile URL (Optional)</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Document Evidence URL</label>
              <input
                type="text"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="URL of uploaded ID badge / certificate"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                🔒 Security Guarantee: Your document is strictly reviewed by Roomigo administrators only and is never publicly accessible.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md"
            >
              {submitting ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        </div>
      )}

      {/* Explanatory Grid: What's Being Verified, Why, What Happens Next */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">1. What We Verify</h3>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li><strong>Tenancy Authority:</strong> We check lease contracts or landlord written NOCs so no one sub-leases without permission.</li>
            <li><strong>Approximate Location:</strong> We cross-reference society gates & landmarks.</li>
            <li><strong>Cost Fairness:</strong> Rent and deposit amounts are verified to ensure zero hidden brokerage.</li>
            <li><strong>Photo Authenticity:</strong> Room photos are checked to prevent stock image scams.</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">2. What Happens Next</h3>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li><strong>4-12 Hour Review:</strong> Our review team inspects submitted tenancy and identity proofs.</li>
            <li><strong>Correction Feedback:</strong> If a document is blurred or incomplete, you receive a direct notification with instructions.</li>
            <li><strong>Verified Badge:</strong> Once approved, the post or profile receives a live badge.</li>
            <li><strong>7-Day Expiry Timer:</strong> Active listings get 7 days of prime visibility.</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">3. Requesting a Review</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            If your listing or renter profile verification was rejected or changes were requested:
          </p>
          <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <li>Review the admin feedback message in your Notifications center.</li>
            <li>Re-upload a clearer copy of your tenancy agreement or ID badge.</li>
            <li>You can also contact our integrity team directly at <strong>support@roomigo.in</strong>.</li>
          </ul>
        </div>

      </div>

    </div>
  );
};
