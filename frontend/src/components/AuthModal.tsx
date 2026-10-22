import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register, quickLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode);
  const [role, setRole] = useState<'ROLE_RENTER' | 'ROLE_POSTER'>('ROLE_RENTER');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [companyOrCollege, setCompanyOrCollege] = useState('');
  const [gender, setGender] = useState('Male');

  // OTP flow for phone verification
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    setMode(authModalMode);
    setError(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number first');
      return;
    }
    setError(null);
    try {
      const res = await authService.requestPhoneOtp(phone);
      setOtpSent(true);
      setOtpMessage(res.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setError(null);
    try {
      const res = await authService.verifyPhoneOtp(phone, otp);
      if (res.success) {
        setOtpVerified(true);
        setOtpMessage('Phone number verified successfully!');
      } else {
        setError(res.message || 'Invalid OTP code');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify OTP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({
          name,
          email,
          phone,
          password,
          role,
          occupation,
          companyOrCollege,
          gender,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {mode === 'login' ? 'Welcome Back to Roomigo' : 'Create Your Roomigo Account'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login' ? 'Access verified vacancies & flatmate chats' : 'Join Hyderabad’s verified shared rental community'}
              </p>
            </div>
          </div>

          <button 
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Quick Demo Logins Banner */}
          <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Quick Demo 1-Click Logins:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="py-1.5 px-2 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg border border-indigo-200 text-xs font-semibold shadow-xs transition-colors flex flex-col items-center"
              >
                <span>🛡️ Admin</span>
                <span className="text-[10px] opacity-75">Platform Mod</span>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('poster')}
                className="py-1.5 px-2 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg border border-indigo-200 text-xs font-semibold shadow-xs transition-colors flex flex-col items-center"
              >
                <span>🏠 Poster</span>
                <span className="text-[10px] opacity-75">Rahul (Microsoft)</span>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('renter')}
                className="py-1.5 px-2 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg border border-indigo-200 text-xs font-semibold shadow-xs transition-colors flex flex-col items-center"
              >
                <span>🔍 Renter</span>
                <span className="text-[10px] opacity-75">Ananya (Oracle)</span>
              </button>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 rounded-md transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 py-2 rounded-md transition-all ${mode === 'register' ? 'bg-white text-indigo-600 shadow-sm' : 'hover:text-slate-900'}`}
            >
              New Account
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration Fields */}
            {mode === 'register' && (
              <>
                {/* Role Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    I want to:
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setRole('ROLE_RENTER')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === 'ROLE_RENTER' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <p className="font-bold">Find a Room / Flatmate</p>
                      <p className="text-[10px] text-slate-500 font-normal">I need replacement accommodation</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('ROLE_POSTER')}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        role === 'ROLE_POSTER' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <p className="font-bold">Post a Vacancy</p>
                      <p className="text-[10px] text-slate-500 font-normal">Flatmate moving out / replacement</p>
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Phone & OTP Verification */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Mobile Phone</label>
                    <span className="text-[10px] text-slate-500">Provider-independent OTP</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold whitespace-nowrap"
                      >
                        {otpSent ? 'Resend' : 'Send Code'}
                      </button>
                    )}
                  </div>

                  {otpSent && !otpVerified && (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                      <p className="text-[11px] text-slate-600">
                        {otpMessage || 'Verification code sent (use demo code: 123456)'}
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          placeholder="Enter 6-digit code"
                          className="flex-1 px-3 py-1.5 text-xs rounded border border-slate-300 tracking-widest text-center font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  {otpVerified && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Phone number verified</span>
                    </div>
                  )}
                </div>

                {/* Profession / College */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Occupation</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="e.g. SDE-2"
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company / College</label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={companyOrCollege}
                        onChange={(e) => setCompanyOrCollege(e.target.value)}
                        placeholder="e.g. Google / IIT"
                        className="w-full pl-8 pr-2 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Roomigo' : 'Create Account & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
