import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Search, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  ArrowRight, 
  AlertCircle,
  Home,
  Building,
  KeyRound,
  Shield,
  Layers
} from 'lucide-react';
import { Listing, Locality } from '../types';
import { listingService } from '../services/listingService';
import { ListingCard } from '../components/ListingCard';
import { SafetyBanner } from '../components/SafetyBanner';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search Bar State
  const [selectedLocality, setSelectedLocality] = useState<string>('');
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recent, locs] = await Promise.all([
          listingService.getRecentVacancies(),
          listingService.getPopularLocalities()
        ]);
        setRecentListings(recent);
        setLocalities(locs);
      } catch (err) {
        console.error('Failed to load landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (selectedLocality) query.append('locality', selectedLocality);
    if (selectedRoomType) query.append('roomType', selectedRoomType);
    if (selectedBudget) query.append('maxRent', selectedBudget);
    navigate(`/search?${query.toString()}`);
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-12 pb-8 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50/30 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Trust Banner Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Hyderabad's Verified Replacement Flatmate Network</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Find your next room <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 bg-clip-text text-transparent">
              without the guesswork.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            When a flatmate moves out, remaining tenants need a replacement quickly. 
            Roomigo connects you to recently reconfirmed vacancies with verified tenancy authority, transparent cost splits, and zero broker noise.
          </p>

          {/* Search Box Card */}
          <div className="max-w-4xl mx-auto mt-6 bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/90 text-left">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              
              {/* Locality Dropdown */}
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Locality
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                  <select
                    value={selectedLocality}
                    onChange={(e) => setSelectedLocality(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Hyderabad Areas</option>
                    <option value="Madhapur">Madhapur</option>
                    <option value="Gachibowli">Gachibowli</option>
                    <option value="Kondapur">Kondapur</option>
                    <option value="HITEC City">HITEC City</option>
                    <option value="Financial District">Financial District</option>
                    <option value="Kukatpally">Kukatpally</option>
                    <option value="Gowlidoddy">Gowlidoddy</option>
                  </select>
                </div>
              </div>

              {/* Room Type */}
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Vacancy Type
                </label>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-indigo-600 shrink-0" />
                  <select
                    value={selectedRoomType}
                    onChange={(e) => setSelectedRoomType(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any Room Type</option>
                    <option value="Private Room">Private Bedroom</option>
                    <option value="Master Bedroom">Master Bedroom (Attached Bath)</option>
                    <option value="Shared Room">Shared Room (2 Sharing)</option>
                  </select>
                </div>
              </div>

              {/* Budget Range */}
              <div className="p-2 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Max Rent
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-600">₹</span>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">Any Budget</option>
                    <option value="10000">Up to ₹10,000 / mo</option>
                    <option value="15000">Up to ₹15,000 / mo</option>
                    <option value="20000">Up to ₹20,000 / mo</option>
                    <option value="25000">Up to ₹25,000 / mo</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full h-full min-h-[52px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all group"
              >
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Search Rooms</span>
              </button>

            </form>

            {/* Quick Filter Tags */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Trending in Hyderabad:</span>
              <button 
                type="button" 
                onClick={() => navigate('/search?locality=Gachibowli&listingType=REPLACEMENT_FLATMATE')} 
                className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded text-slate-600 transition-colors"
              >
                Gachibowli Near DLF
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/search?locality=Madhapur&preferredGender=Female')} 
                className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded text-slate-600 transition-colors"
              >
                Madhapur Female Flatmates
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/search?locality=Kondapur')} 
                className="hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-2 py-0.5 rounded text-slate-600 transition-colors"
              >
                Kondapur Botanical Garden
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Core Differentiators (Why Roomigo is Different) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            The Roomigo Standard
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built specifically for replacement flatmates. Not just another ads portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">7-Day Reconfirmed Vacancies</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every vacancy automatically expires after 7 days unless the flatmate reconfirms with one click. No ghost postings from 3 months ago.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Replacement Authority Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never assume tenants have legal authority to sub-lease. We verify existing agreements, co-tenant clauses, or landlord NOCs before approval.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Two-Sided Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Both posters and seekers verify their phone and workplace/college identity, without exposing unnecessary private documents to strangers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Zero Brokerage, Pure Flatmates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect directly with genuine software engineers, consultants, and students. Rent, deposit, and utilities splits are 100% transparent.
            </p>
          </div>

        </div>
      </section>

      {/* Popular Localities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
              Top Hyderabad IT Corridors
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore vacancies near your workplace
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View all Hyderabad areas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {localities.map((loc) => (
            <Link
              key={loc.id}
              to={`/search?locality=${encodeURIComponent(loc.name)}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={loc.imageUrl || 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80'}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">
                  {loc.itHubZone}
                </span>
                <h3 className="text-base sm:text-lg font-bold group-hover:text-indigo-200 transition-colors">
                  {loc.name}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-300 mt-1">
                  <span>Avg ₹{(loc.avgRent / 1000).toFixed(1)}k/mo</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {loc.activeListingsCount} verified
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Verified Vacancies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Fresh & Recently Reconfirmed
              </h2>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Replacement flatmate vacancies in Hyderabad
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Browse all vacancies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading fresh vacancies...</div>
        ) : recentListings.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-8">
            <Home className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">No active vacancies at this moment.</p>
            <p className="text-xs text-slate-400 mt-1">Be the first to post a replacement flatmate vacancy!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* Safety Banner Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SafetyBanner />
      </section>

      {/* Two-Track "How It Works" Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-indigo-900 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden">
        <div className="relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
              Simple, Safe & Transparent
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              How Roomigo works for both sides
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Track 1: Poster */}
            <div className="bg-indigo-950/60 p-6 sm:p-8 rounded-2xl border border-indigo-700/50 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-xs font-bold">
                <Users className="w-3.5 h-3.5" />
                <span>If You Have a Vacancy / Leaving a Flat</span>
              </div>
              <h3 className="text-xl font-bold text-white">Find a Replacement Tenant</h3>
              
              <ul className="space-y-4 text-xs text-indigo-100">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center font-bold text-white shrink-0">1</span>
                  <span><strong>Post your flatmate vacancy</strong> with real room photos, rent, deposit, flatmate vibe, and house rules.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center font-bold text-white shrink-0">2</span>
                  <span><strong>Submit authority verification:</strong> Upload your co-tenant agreement or landlord written NOC so seekers know it’s legitimate.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/30 border border-indigo-400/50 flex items-center justify-center font-bold text-white shrink-0">3</span>
                  <span><strong>Reconfirm with 1 click every 7 days:</strong> Keep your post on top of search results. If filled, mark it occupied instantly.</span>
                </li>
              </ul>

              <Link
                to="/post-vacancy"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-sm"
              >
                <span>Post Your Vacancy Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Track 2: Renter */}
            <div className="bg-indigo-950/60 p-6 sm:p-8 rounded-2xl border border-indigo-700/50 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold">
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>If You Are Looking for a Room</span>
              </div>
              <h3 className="text-xl font-bold text-white">Move In with Confidence</h3>
              
              <ul className="space-y-4 text-xs text-indigo-100">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center font-bold text-white shrink-0">1</span>
                  <span><strong>Search verified active rooms:</strong> Filter by Hyderabad IT corridor, rent range, room type, and gender preference.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center font-bold text-white shrink-0">2</span>
                  <span><strong>Verify your profile:</strong> Quick work/college badge verification gives you a verified trust badge when contacting flatmates.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/30 border border-emerald-400/50 flex items-center justify-center font-bold text-white shrink-0">3</span>
                  <span><strong>Schedule an in-person or video visit:</strong> Meet the existing flatmates, verify the vibe, and inspect the flat before paying.</span>
                </li>
              </ul>

              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow-sm"
              >
                <span>Discover Verified Rooms</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Ready to solve your flatmate replacement?
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Join thousands of techies and professionals in Madhapur, Gachibowli, Kondapur, and HITEC City finding replacement flatmates without brokerage.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/post-vacancy"
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
          >
            Post a Replacement Vacancy
          </Link>
          <Link
            to="/verification"
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
          >
            Learn About Verification
          </Link>
        </div>
      </section>

    </div>
  );
};
