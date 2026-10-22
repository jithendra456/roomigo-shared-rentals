import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  Check, 
  Sparkles, 
  ShieldCheck,
  Home
} from 'lucide-react';
import { Listing, ListingType } from '../types';
import { listingService, SearchParams } from '../services/listingService';
import { ListingCard } from '../components/ListingCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state from URL or defaults
  const [locality, setLocality] = useState<string>(searchParams.get('locality') || '');
  const [listingType, setListingType] = useState<string>(searchParams.get('listingType') || '');
  const [roomType, setRoomType] = useState<string>(searchParams.get('roomType') || '');
  const [furnishing, setFurnishing] = useState<string>(searchParams.get('furnishing') || '');
  const [preferredGender, setPreferredGender] = useState<string>(searchParams.get('preferredGender') || '');
  const [maxRent, setMaxRent] = useState<number>(
    searchParams.get('maxRent') ? parseInt(searchParams.get('maxRent')!) : 35000
  );
  const [minRent, setMinRent] = useState<number>(
    searchParams.get('minRent') ? parseInt(searchParams.get('minRent')!) : 5000
  );
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(
    searchParams.get('verifiedOnly') === 'true'
  );
  const [sort, setSort] = useState<string>(searchParams.get('sort') || 'reconfirmed');

  // Listings results & pagination
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params: SearchParams = {
        locality: locality || undefined,
        listingType: listingType ? (listingType as ListingType) : undefined,
        roomType: roomType || undefined,
        furnishing: furnishing || undefined,
        preferredGender: preferredGender || undefined,
        minRent: minRent > 5000 ? minRent : undefined,
        maxRent: maxRent < 35000 ? maxRent : undefined,
        verifiedOnly: verifiedOnly || undefined,
        sort: sort,
        page: page,
        size: 12
      };

      const res = await listingService.searchListings(params);
      setListings(res.content);
      setTotalPages(res.totalPages);
      setTotalElements(res.totalElements);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [locality, listingType, roomType, furnishing, preferredGender, minRent, maxRent, verifiedOnly, sort, page]);

  const resetFilters = () => {
    setLocality('');
    setListingType('');
    setRoomType('');
    setFurnishing('');
    setPreferredGender('');
    setMinRent(5000);
    setMaxRent(35000);
    setVerifiedOnly(false);
    setSort('reconfirmed');
    setPage(0);
    setSearchParams({});
  };

  const hasActiveFilters = locality || listingType || roomType || furnishing || preferredGender || minRent > 5000 || maxRent < 35000 || verifiedOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Mobile Filter Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shared Flats & Flatmate Vacancies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {loading ? 'Searching vacancies...' : `${totalElements} verified vacancies found in Hyderabad IT Corridors`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 shadow-xs"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(0); }}
              className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="reconfirmed">Recently Reconfirmed (7d Rule)</option>
              <option value="rent_asc">Rent: Low to High</option>
              <option value="rent_desc">Rent: High to Low</option>
              <option value="recent">Newest Listings</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Listings Results */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden md:block bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Search Filters</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Priority / Listing Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Listing Category
            </label>
            <div className="space-y-1.5">
              {[
                { label: 'All Categories', val: '' },
                { label: 'Replacement Flatmate (P1)', val: 'REPLACEMENT_FLATMATE' },
                { label: 'Available Room in Flat (P2)', val: 'AVAILABLE_ROOM' },
                { label: 'Shared Flat (P3)', val: 'SHARED_ACCOMMODATION' }
              ].map((item) => (
                <label key={item.val} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-indigo-600">
                  <input
                    type="radio"
                    name="listingType"
                    checked={listingType === item.val}
                    onChange={() => { setListingType(item.val); setPage(0); }}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Locality */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Locality
            </label>
            <select
              value={locality}
              onChange={(e) => { setLocality(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Hyderabad IT Areas</option>
              <option value="Madhapur">Madhapur (Mindspace)</option>
              <option value="Gachibowli">Gachibowli (DLF Cyber)</option>
              <option value="Kondapur">Kondapur (Botanical)</option>
              <option value="HITEC City">HITEC City (Knowledge City)</option>
              <option value="Financial District">Financial District</option>
              <option value="Kukatpally">Kukatpally (KPHB)</option>
              <option value="Gowlidoddy">Gowlidoddy (Q City)</option>
            </select>
          </div>

          {/* Rent Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider">Max Rent</span>
              <span className="font-extrabold text-indigo-600">₹{maxRent.toLocaleString('en-IN')}/mo</span>
            </div>
            <input
              type="range"
              min="5000"
              max="35000"
              step="1000"
              value={maxRent}
              onChange={(e) => { setMaxRent(parseInt(e.target.value)); setPage(0); }}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹5k</span>
              <span>₹20k</span>
              <span>₹35k+</span>
            </div>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Room Type
            </label>
            <select
              value={roomType}
              onChange={(e) => { setRoomType(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Room Type</option>
              <option value="Private Room">Private Room</option>
              <option value="Master Bedroom">Master Bedroom with Attached Bath</option>
              <option value="Shared Room">Shared Room (2 Sharing)</option>
            </select>
          </div>

          {/* Furnishing */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Furnishing
            </label>
            <select
              value={furnishing}
              onChange={(e) => { setFurnishing(e.target.value); setPage(0); }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Furnishing</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi Furnished">Semi Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Preferred Gender */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Gender Preference
            </label>
            <div className="grid grid-cols-3 gap-1 text-xs">
              {['Any', 'Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => { setPreferredGender(preferredGender === g ? '' : g); setPage(0); }}
                  className={`py-1.5 rounded-lg border text-center transition-all ${
                    preferredGender === g 
                      ? 'bg-indigo-600 text-white font-bold border-indigo-600' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Only Filter */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => { setVerifiedOnly(e.target.checked); setPage(0); }}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1 text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Vacancies Only
              </span>
            </label>
          </div>

        </aside>

        {/* Results Column */}
        <main className="md:col-span-3 space-y-6">
          
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 bg-slate-100/70 p-3 rounded-xl border border-slate-200/60">
              <span className="text-xs font-semibold text-slate-500">Active:</span>
              {locality && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800">
                  Area: {locality}
                  <button onClick={() => setLocality('')}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}
              {listingType && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800">
                  Type: {listingType.replace('_', ' ')}
                  <button onClick={() => setListingType('')}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}
              {preferredGender && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-800">
                  Gender: {preferredGender}
                  <button onClick={() => setPreferredGender('')}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                  Verified Only
                  <button onClick={() => setVerifiedOnly(false)}><X className="w-3 h-3 hover:text-rose-500" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold ml-auto"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-sm font-semibold text-slate-600">Loading verified Hyderabad vacancies...</p>
            </div>
          ) : listings.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                <Home className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No vacancies match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try widening your budget, clearing locality filters, or looking in nearby IT corridors like Gachibowli or Kondapur.
                </p>
              </div>
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Listings Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => (
                <ListingCard key={item.id} listing={item} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-semibold">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                ← Previous
              </button>
              <span className="text-slate-500">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                Next →
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end md:hidden">
          <div className="w-full max-w-xs bg-white h-full p-5 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm">Filter Vacancies</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Locality */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Locality
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
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

              {/* Listing Category */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={listingType}
                  onChange={(e) => setListingType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                >
                  <option value="">All Categories</option>
                  <option value="REPLACEMENT_FLATMATE">Replacement Flatmate</option>
                  <option value="AVAILABLE_ROOM">Available Room in Flat</option>
                  <option value="SHARED_ACCOMMODATION">Shared Accommodation</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                  Gender Preference
                </label>
                <div className="grid grid-cols-3 gap-1 text-xs">
                  {['Any', 'Male', 'Female'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setPreferredGender(preferredGender === g ? '' : g)}
                      className={`py-1.5 rounded-lg border text-center ${preferredGender === g ? 'bg-indigo-600 text-white font-bold' : 'border-slate-200'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verified Only */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Verified Vacancies Only</span>
              </label>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => { resetFilters(); setMobileFilterOpen(false); }}
                className="flex-1 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => { setMobileFilterOpen(false); }}
                className="flex-1 py-2 rounded-lg bg-indigo-600 text-white text-xs font-bold"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
