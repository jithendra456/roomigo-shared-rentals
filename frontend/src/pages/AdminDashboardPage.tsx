import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Users, 
  Building2, 
  Activity, 
  MapPin, 
  TrendingUp, 
  Eye, 
  ExternalLink,
  Check,
  X,
  Search,
  Plus
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { AdminStats, AuditLog, ListingVerification, Locality, RenterVerification, UserReport } from '../types';
import { useAuth } from '../context/AuthContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'renters' | 'reports' | 'localities' | 'audit'>('listings');
  
  // Data queues
  const [listingVerifications, setListingVerifications] = useState<ListingVerification[]>([]);
  const [renterVerifications, setRenterVerifications] = useState<RenterVerification[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Review modal state
  const [selectedListingVer, setSelectedListingVer] = useState<ListingVerification | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('Lease agreement and co-tenant terms verified.');
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // New Locality modal
  const [newLocalityModalOpen, setNewLocalityModalOpen] = useState<boolean>(false);
  const [newLocName, setNewLocName] = useState<string>('');
  const [newLocZone, setNewLocZone] = useState<string>('');
  const [newLocRent, setNewLocRent] = useState<number>(15000);
  const [newLocImg, setNewLocImg] = useState<string>('https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=600&q=80');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [st, lv, rv, rep, loc, logs] = await Promise.all([
        adminService.getStats(),
        adminService.getPendingListings(),
        adminService.getPendingRenters(),
        adminService.getReports(),
        adminService.getLocalities(),
        adminService.getAuditLogs()
      ]);
      setStats(st);
      setListingVerifications(lv);
      setRenterVerifications(rv);
      setReports(rep);
      setLocalities(loc);
      setAuditLogs(logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReviewListing = async (verificationId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await adminService.reviewListing(verificationId, {
        status,
        approxLocationVerified: true,
        rentVerified: true,
        photosVerified: true,
        rulesVerified: true,
        adminNotes: adminNotes,
        rejectionReason: status === 'REJECTED' ? (rejectionReason || 'Authority proof invalid') : undefined
      });
      setActionMessage(`Listing verification marked as ${status}`);
      setSelectedListingVer(null);
      fetchData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewRenter = async (verificationId: number, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await adminService.reviewRenter(verificationId, {
        status,
        adminNotes: 'Workplace credentials verified by admin.',
        rejectionReason: status === 'REJECTED' ? 'Identity document unclear or mismatched.' : undefined
      });
      setActionMessage(`Renter verification marked as ${status}`);
      fetchData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveReport = async (reportId: number, action: 'DISMISS' | 'TAKE_DOWN_LISTING') => {
    try {
      await adminService.resolveReport(reportId, {
        action,
        notes: action === 'TAKE_DOWN_LISTING' ? 'Listing unlisted due to verified user complaint.' : 'Report dismissed after investigation.'
      });
      setActionMessage(`Report resolved with action: ${action}`);
      fetchData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLocality = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.saveLocality({
        name: newLocName,
        city: 'Hyderabad',
        itHubZone: newLocZone,
        avgRent: newLocRent,
        popular: true,
        imageUrl: newLocImg
      });
      setNewLocalityModalOpen(false);
      setActionMessage(`Locality ${newLocName} added.`);
      fetchData();
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || user.role !== 'ROLE_ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-3">
        <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Admin Authorization Required</h2>
        <p className="text-xs text-slate-500">Sign in with an administrator account to view the moderation console.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold uppercase tracking-wider">
              Platform Integrity Console
            </span>
            <span className="text-xs text-slate-400">Live DB Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Roomigo Hyderabad Administration
          </h1>
        </div>

        <button
          onClick={fetchData}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 w-fit"
        >
          <Activity className="w-3.5 h-3.5 text-indigo-600" />
          <span>Refresh Data</span>
        </button>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Real Live Database Metrics Grid (No fake numbers!) */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Vacancies</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.activeListings}</span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">Live</span>
            </div>
            <p className="text-[11px] text-slate-400">of {stats.totalListings} total posted</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Verifications</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">{stats.pendingVerifications}</span>
              <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded">Action Req</span>
            </div>
            <p className="text-[11px] text-slate-400">Tenancy proof review</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Enquiries & Visits</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{stats.totalEnquiries + stats.totalVisits}</span>
              <span className="text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">{stats.totalVisits} visits</span>
            </div>
            <p className="text-[11px] text-slate-400">{stats.totalEnquiries} direct enquiries</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">User Disputes / Reports</span>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">{stats.pendingReports}</span>
              <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">Flagged</span>
            </div>
            <p className="text-[11px] text-slate-400">Moderation queue</p>
          </div>

        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'listings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Listing Verifications ({listingVerifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('renters')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'renters' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>User & Identity Verifications ({renterVerifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'reports' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>User Reports ({reports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('localities')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'localities' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Supported Localities ({localities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
            activeTab === 'audit' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Audit Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: Listing Verifications Queue */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Pending Tenancy Authority Verifications</h3>
            <span className="text-xs text-slate-500">{listingVerifications.length} submissions awaiting review</span>
          </div>

          {listingVerifications.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              ✓ All listing verifications have been reviewed!
            </div>
          ) : (
            <div className="space-y-4">
              {listingVerifications.map((lv) => (
                <div
                  key={lv.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {lv.listing.listingType.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{lv.listing.locality}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-600">{lv.listing.addressApproximate}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{lv.listing.title}</h4>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-extrabold text-slate-900">₹{lv.listing.rentAmount.toLocaleString('en-IN')}/mo</span>
                      <p className="text-[11px] text-slate-400">Deposit: ₹{lv.listing.depositAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Verification evidence summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Poster Relationship</span>
                      <span className="font-bold text-slate-800 mt-0.5 block">{lv.posterRelationship}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Authority Proof Type</span>
                      <span className="font-bold text-emerald-800 mt-0.5 block">{lv.authorityProofType}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Document Evidence</span>
                      {lv.documentUrl ? (
                        <a
                          href={lv.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-0.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Proof Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400">No document attached</span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => handleReviewListing(lv.id, 'APPROVED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Tenancy & Publish Listing</span>
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt('Reason for rejection / corrections needed:');
                        if (reason) {
                          setRejectionReason(reason);
                          handleReviewListing(lv.id, 'REJECTED');
                        }
                      }}
                      className="px-4 py-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-700 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject / Request Corrections</span>
                    </button>

                    <a
                      href={`/listings/${lv.listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold ml-auto"
                    >
                      Inspect Post
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Renter & Poster Verifications Queue */}
      {activeTab === 'renters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Pending User Profile & Identity Verifications</h3>
            <span className="text-xs text-slate-500">{renterVerifications.length} profiles awaiting badge</span>
          </div>

          {renterVerifications.length === 0 ? (
            <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              ✓ All user identity verifications have been reviewed!
            </div>
          ) : (
            <div className="space-y-4">
              {renterVerifications.map((rv) => (
                <div
                  key={rv.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {rv.idType.replace('_', ' ')}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">User #{rv.userId} • {rv.companyOrCollege}</h4>
                      <p className="text-xs text-slate-500 font-mono">Masked ID: {rv.idNumberMasked}</p>
                    </div>

                    {rv.workEmail && (
                      <div className="text-right text-xs">
                        <span className="text-slate-400">Work Email:</span>
                        <p className="font-bold text-slate-900">{rv.workEmail}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {rv.documentUrl && (
                      <a
                        href={rv.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Inspect Verification Document</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {rv.linkedinUrl && (
                      <a
                        href={rv.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
                      >
                        <span>LinkedIn Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleReviewRenter(rv.id, 'VERIFIED')}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve Identity Badge</span>
                    </button>
                    <button
                      onClick={() => handleReviewRenter(rv.id, 'REJECTED')}
                      className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 font-semibold text-xs flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: User Reports Queue */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">User Reports & Moderation Disputes</h3>
            <span className="text-xs text-slate-500">{reports.length} reports logged</span>
          </div>

          <div className="space-y-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-rose-100 text-rose-800 uppercase">
                      {rep.reasonCategory}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      Listing #{rep.listing?.id}: {rep.listing?.locality}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    rep.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                  <strong>Report Description:</strong> {rep.description}
                </div>

                {rep.status === 'PENDING' && (
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleResolveReport(rep.id, 'TAKE_DOWN_LISTING')}
                      className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Take Down Listing
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep.id, 'DISMISS')}
                      className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold text-xs"
                    >
                      Dismiss Report
                    </button>
                    <a
                      href={`/listings/${rep.listing?.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs text-indigo-600 font-semibold ml-auto"
                    >
                      Inspect Listing →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Supported Localities Manager */}
      {activeTab === 'localities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Supported Hyderabad Localities</h3>
            <button
              onClick={() => setNewLocalityModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Locality</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {localities.map((loc) => (
              <div key={loc.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{loc.name}</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {loc.activeListingsCount} active
                  </span>
                </div>
                <p className="text-xs text-slate-500">{loc.itHubZone}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Avg Rent:</span>
                  <span className="font-bold text-slate-900">₹{loc.avgRent.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-800">System Audit Trail</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 text-xs flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] text-slate-400">• {log.targetType} #{log.targetId}</span>
                  </div>
                  <p className="text-slate-500 mt-0.5">{log.details}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <p className="text-[10px] text-slate-500">{log.actorEmail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Locality */}
      {newLocalityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Add Supported Locality</h3>
              <button onClick={() => setNewLocalityModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddLocality} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Locality Name</label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="e.g. Manikonda"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IT Hub Zone</label>
                <input
                  type="text"
                  required
                  value={newLocZone}
                  onChange={(e) => setNewLocZone(e.target.value)}
                  placeholder="e.g. Lanco Hills & Outer Ring Road"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Average Rent (₹)</label>
                <input
                  type="number"
                  required
                  value={newLocRent}
                  onChange={(e) => setNewLocRent(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                Add Locality
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
