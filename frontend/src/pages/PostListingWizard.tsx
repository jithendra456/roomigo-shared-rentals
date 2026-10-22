import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  IndianRupee, 
  Home, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Upload,
  AlertCircle
} from 'lucide-react';
import { listingService } from '../services/listingService';
import { useAuth } from '../context/AuthContext';

export const PostListingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [listingType, setListingType] = useState<string>('REPLACEMENT_FLATMATE');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Location
  const [locality, setLocality] = useState<string>('Gachibowli');
  const [addressApproximate, setAddressApproximate] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('500032');

  // Financials
  const [rentAmount, setRentAmount] = useState<number>(15000);
  const [depositAmount, setDepositAmount] = useState<number>(30000);
  const [maintenanceAmount, setMaintenanceAmount] = useState<number>(1500);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState<boolean>(false);
  const [utilitiesEstimate, setUtilitiesEstimate] = useState<number>(1200);
  const [foodArrangement, setFoodArrangement] = useState<string>('Cook Available (Shared Cost)');

  // Room & Flat Specs
  const [bhkType, setBhkType] = useState<string>('3 BHK');
  const [roomType, setRoomType] = useState<string>('Private Room with Attached Bath');
  const [attachedBathroom, setAttachedBathroom] = useState<boolean>(true);
  const [balcony, setBalcony] = useState<boolean>(true);
  const [furnishing, setFurnishing] = useState<string>('Fully Furnished');
  const [preferredGender, setPreferredGender] = useState<string>('Male');
  const [currentFlatmatesCount, setCurrentFlatmatesCount] = useState<number>(2);
  const [totalRooms, setTotalRooms] = useState<number>(3);
  const [vacantRooms, setVacantRooms] = useState<number>(1);
  const [moveInDate, setMoveInDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Culture & House Rules
  const [flatmateVibe, setFlatmateVibe] = useState<string>(
    'Software engineers working hybrid at IT corridor. Calm weekdays, chill weekend movies/badminton.'
  );
  const [houseRules, setHouseRules] = useState<string>(
    'Non-smoking indoors (balcony okay). Guests welcome with advance heads-up. Quiet hours after 11 PM.'
  );
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-speed Wi-Fi', 'Split AC', 'Washing Machine', 'Refrigerator', 'Power Backup', 'RO Water', 'Gated Security 24/7'
  ]);

  // Photos
  const [photos, setPhotos] = useState<string>(
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80,https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
  );
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);

  // Replacement Authority & Tenancy Verification (Core Workflow)
  const [posterRelationship, setPosterRelationship] = useState<string>(
    'Current Tenant Moving Out (Co-tenant replacement)'
  );
  const [authorityProofType, setAuthorityProofType] = useState<string>(
    'Rental Agreement with Co-Tenant Clause'
  );
  const [authorityDocumentUrl, setAuthorityDocumentUrl] = useState<string>(
    'https://roomigo-docs.s3.ap-south-1.amazonaws.com/leases/lease_sample_verified.pdf'
  );

  // Quick preset sample photos for convenient demo creation
  const photoPresets = [
    { name: 'Spacious Gated Society Room', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Modern Living & Balcony', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Cozy Bedroom with French Window', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80' },
    { name: 'Clean Modular Kitchen', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80' }
  ];

  const amenityOptions = [
    'High-speed Wi-Fi', 'Split AC', 'Washing Machine', 'Refrigerator',
    'Power Backup', 'RO Water', 'Gym', 'Swimming Pool',
    'Gated Security 24/7', 'Covered Car Parking', 'Maid Service', 'Lift'
  ];

  const toggleAmenity = (item: string) => {
    setSelectedAmenities(prev => 
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'photo' | 'proof') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploadingPhoto(true);
      const res = await listingService.uploadFile(file);
      if (target === 'photo') {
        setPhotos(prev => prev ? `${prev},${res.url}` : res.url);
      } else {
        setAuthorityDocumentUrl(res.url);
      }
    } catch (err) {
      console.error(err);
      setError('File upload failed. You can also use image URLs.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleNext = () => {
    setError(null);
    if (currentStep === 1) {
      if (!title || !description || !addressApproximate) {
        setError('Please fill in title, description, and approximate address.');
        return;
      }
    }
    setCurrentStep(prev => Math.min(7, prev + 1));
  };

  const handleBack = () => {
    setError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      openAuthModal('login');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        listingType,
        locality,
        addressApproximate,
        landmark,
        pinCode,
        rentAmount,
        depositAmount,
        maintenanceAmount,
        utilitiesIncluded,
        utilitiesEstimate,
        foodArrangement,
        bhkType,
        roomType,
        attachedBathroom,
        balcony,
        furnishing,
        preferredGender,
        currentFlatmatesCount,
        totalRooms,
        vacantRooms,
        moveInDate,
        flatmateVibe,
        amenities: selectedAmenities.join(', '),
        houseRules,
        photos,
        posterRelationship,
        authorityProofType,
        authorityDocumentUrl
      };

      const created = await listingService.createListing(payload);
      navigate(`/listings/${created.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit listing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Wizard Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Replacement Flatmate Listing Wizard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Post Your Shared Vacancy in Hyderabad
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Every post is verified for tenancy authority and active availability with a 7-day auto-expiry guarantee.
        </p>
      </div>

      {/* Progress Steps Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Step {currentStep} of 7</span>
          <span className="text-indigo-600 font-extrabold">
            {currentStep === 1 && '1. Category & Locality'}
            {currentStep === 2 && '2. Financials & Costs'}
            {currentStep === 3 && '3. Room Specifications'}
            {currentStep === 4 && '4. Flatmate Vibe & Rules'}
            {currentStep === 5 && '5. Real Photos'}
            {currentStep === 6 && '6. Tenancy Authority Proof'}
            {currentStep === 7 && '7. Review & Submit'}
          </span>
        </div>
        
        {/* Progress bar line */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Wizard Step Content Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
        
        {/* STEP 1: Category & Locality */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Vacancy Category & Location</h2>
              <p className="text-xs text-slate-500">Pick the priority type and Hyderabad IT corridor location.</p>
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Listing Priority</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'REPLACEMENT_FLATMATE', label: '1. Replacement Flatmate', desc: 'Flatmate moving out mid-lease' },
                  { id: 'AVAILABLE_ROOM', label: '2. Available Room', desc: 'Room vacant in existing shared flat' },
                  { id: 'SHARED_ACCOMMODATION', label: '3. Shared Accommodation', desc: 'Twin/multi sharing space' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setListingType(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      listingType === item.id 
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold' 
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-xs font-bold">{item.label}</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urgent Replacement Flatmate: Private AC Room in 3BHK Gated Society"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description & Reason for Vacancy</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain who is moving out, what the room offers, and what kind of flatmate you're looking for..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Locality & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Locality (Hyderabad)</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Madhapur">Madhapur</option>
                  <option value="Gachibowli">Gachibowli</option>
                  <option value="Kondapur">Kondapur</option>
                  <option value="HITEC City">HITEC City</option>
                  <option value="Financial District">Financial District</option>
                  <option value="Kukatpally">Kukatpally</option>
                  <option value="Gowlidoddy">Gowlidoddy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Approximate Address (Privacy Shielded)</label>
                <input
                  type="text"
                  required
                  value={addressApproximate}
                  onChange={(e) => setAddressApproximate(e.target.value)}
                  placeholder="e.g. Near DLF Cyber City Gate 2"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opp Radisson Hotel"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pin Code</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="500032"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Financials & Costs */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Transparent Financials</h2>
              <p className="text-xs text-slate-500">No hidden fees, no brokerage. Exact cost breakdown for replacement flatmate.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Rent per Flatmate (₹)</label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={rentAmount}
                  onChange={(e) => setRentAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Security Deposit Required (₹)</label>
                <input
                  type="number"
                  required
                  min={0}
                  step={1000}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Maintenance (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={maintenanceAmount}
                  onChange={(e) => setMaintenanceAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
                <span className="text-[10px] text-slate-400">Enter 0 if already covered in rent</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Utilities Split (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={utilitiesEstimate}
                  onChange={(e) => setUtilitiesEstimate(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
                <span className="text-[10px] text-slate-400">Wi-Fi, power, maid, gas split per person</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Food / Cook Arrangement</label>
              <select
                value={foodArrangement}
                onChange={(e) => setFoodArrangement(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              >
                <option value="Cook Available (Shared Cost)">Cook Available (Shared Cost)</option>
                <option value="Self-Cook">Self-Cook</option>
                <option value="Mess / Tiffin Service Nearby">Mess / Tiffin Service Nearby</option>
                <option value="Flexible / Mutual Agreement">Flexible / Mutual Agreement</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Room & Flat Details */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Room & Accommodation Details</h2>
              <p className="text-xs text-slate-500">Provide accurate flat specs so seekers find their ideal match.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Flat BHK Type</label>
                <select
                  value={bhkType}
                  onChange={(e) => setBhkType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="Villa">Independent Villa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Private Room with Attached Bath">Private Room with Attached Bath</option>
                  <option value="Master Bedroom with Attached Bath">Master Bedroom with Attached Bath</option>
                  <option value="Private Room (Common Bath)">Private Room (Common Bath)</option>
                  <option value="Shared Room (2 Sharing)">Shared Room (2 Sharing)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Furnishing Status</label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Semi Furnished">Semi Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Gender Preference</label>
                <select
                  value={preferredGender}
                  onChange={(e) => setPreferredGender(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="Any">Any Gender</option>
                  <option value="Male">Male Flatmate</option>
                  <option value="Female">Female Flatmate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Flatmates</label>
                <input
                  type="number"
                  min={1}
                  value={currentFlatmatesCount}
                  onChange={(e) => setCurrentFlatmatesCount(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Total Rooms</label>
                <input
                  type="number"
                  min={1}
                  value={totalRooms}
                  onChange={(e) => setTotalRooms(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-center font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Vacant Rooms</label>
                <input
                  type="number"
                  min={1}
                  value={vacantRooms}
                  onChange={(e) => setVacantRooms(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-center font-bold"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={attachedBathroom}
                  onChange={(e) => setAttachedBathroom(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Attached Bathroom</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={balcony}
                  onChange={(e) => setBalcony(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Private Balcony</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Flatmate Vibe, Rules & Amenities */}
        {currentStep === 4 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 4: Flatmate Vibe & House Rules</h2>
              <p className="text-xs text-slate-500">Shared living succeeds when lifestyles align. Describe your community culture.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Existing Flatmates Vibe</label>
              <textarea
                rows={3}
                value={flatmateVibe}
                onChange={(e) => setFlatmateVibe(e.target.value)}
                placeholder="e.g. 2 software engineers working at Microsoft & Amazon. We love badminton, Netflix, and respect quiet hours."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">House Rules</label>
              <textarea
                rows={3}
                value={houseRules}
                onChange={(e) => setHouseRules(e.target.value)}
                placeholder="Smoking policy, guests, noise restrictions, kitchen cleaning guidelines..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {amenityOptions.map(am => (
                  <button
                    key={am}
                    type="button"
                    onClick={() => toggleAmenity(am)}
                    className={`p-2 rounded-lg border text-xs font-medium text-left transition-all ${
                      selectedAmenities.includes(am)
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {selectedAmenities.includes(am) ? '✓ ' : '+ '} {am}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Real Photos */}
        {currentStep === 5 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 5: Authentic Photos</h2>
              <p className="text-xs text-slate-500">Roomigo requires authentic room photos to reject stock photos and scams.</p>
            </div>

            {/* Upload or Preset Selection */}
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/50 text-center space-y-2">
              <Upload className="w-8 h-8 text-indigo-600 mx-auto" />
              <p className="text-xs font-bold text-slate-700">Upload Photos of the Room & Flat</p>
              <p className="text-[11px] text-slate-400">PNG, JPG, WebP up to 15MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'photo')}
                className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
              />
              {uploadingPhoto && <p className="text-xs text-indigo-600 font-semibold">Uploading photo...</p>}
            </div>

            {/* Quick Presets for Demo Testing */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Or pick verified demo photo presets:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {photoPresets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPhotos(prev => prev ? `${prev},${p.url}` : p.url)}
                    className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 hover:border-indigo-500 text-left"
                  >
                    <img src={p.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute bottom-1 left-1 right-1 bg-slate-900/80 text-white text-[9px] p-1 rounded font-medium truncate block">
                      + Add {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photos URLs String */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Photos List (comma separated URLs)</label>
              <textarea
                rows={2}
                value={photos}
                onChange={(e) => setPhotos(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
              />
            </div>
          </div>
        )}

        {/* STEP 6: Replacement Authority & Tenancy Verification */}
        {currentStep === 6 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Verification Safeguard (Roomigo Core Rule)
                </h3>
                <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                  We don't assume tenants have legal authority to offer flatmate replacements. 
                  Upload proof of your tenancy or landlord consent so our admin review team can verify your listing within 12 hours.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Relationship to this Accommodation</label>
              <select
                value={posterRelationship}
                onChange={(e) => setPosterRelationship(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900"
              >
                <option value="Current Tenant Moving Out (Co-tenant replacement)">Current Tenant Moving Out (Co-tenant replacement)</option>
                <option value="Remaining Flatmate Seeking Replacement">Remaining Flatmate Seeking Replacement</option>
                <option value="Master Tenant on Primary Lease">Master Tenant on Primary Lease</option>
                <option value="Flat Owner Offering Shared Rental">Flat Owner Offering Shared Rental</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Proof Document Type</label>
              <select
                value={authorityProofType}
                onChange={(e) => setAuthorityProofType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              >
                <option value="Rental Agreement with Co-Tenant Clause">Rental Agreement with Co-Tenant Clause</option>
                <option value="Landlord Written NOC / Consent Email/WhatsApp">Landlord Written NOC / Consent Email/WhatsApp</option>
                <option value="Recent Society Maintenance Bill / Gate Pass">Recent Society Maintenance Bill / Gate Pass</option>
                <option value="Owner Deed / Title Document">Owner Deed / Title Document</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Upload Document or Evidence URL</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => handleFileUpload(e, 'proof')}
                  className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={authorityDocumentUrl}
                  onChange={(e) => setAuthorityDocumentUrl(e.target.value)}
                  placeholder="URL of lease agreement / NOC evidence"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                🔒 Privacy Guarantee: This document is kept strictly confidential for admin review only and is NEVER shown to seekers.
              </p>
            </div>
          </div>
        )}

        {/* STEP 7: Review & Final Submit */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 7: Final Review & Submission</h2>
              <p className="text-xs text-slate-500">Review all details before submitting to the Roomigo admin review queue.</p>
            </div>

            {/* Summary Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Title:</span>
                <span className="font-bold text-slate-900 text-right">{title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Locality:</span>
                <span className="font-bold text-slate-900">{locality} ({addressApproximate})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rent & Deposit:</span>
                <span className="font-bold text-slate-900">₹{rentAmount.toLocaleString('en-IN')}/mo • Deposit: ₹{depositAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room & Flat:</span>
                <span className="font-bold text-slate-900">{bhkType} • {roomType} • {furnishing}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Flatmate:</span>
                <span className="font-bold text-slate-900">{preferredGender}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span className="text-slate-500">Authority Proof:</span>
                <span className="font-bold text-emerald-700">{authorityProofType}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs space-y-1">
              <p className="font-bold">What happens next?</p>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Your vacancy enters the verification queue. Once our admin team verifies the lease proof, your listing will be published live with a <strong>Verified Tenancy Badge</strong> and active for 7 days.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Navigation Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div></div>}

          {currentStep < 7 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting for Review...' : 'Submit Vacancy for Verification'}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
