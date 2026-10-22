import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  PlusCircle, 
  Search, 
  Bell, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  MapPin, 
  CheckCircle2, 
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const Navbar: React.FC = () => {
  const { user, isAdmin, isPoster, logout, openAuthModal } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & City Badge */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Room<span className="text-indigo-600">igo</span>
                </span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-600 -mt-1">
                  Replacement Flatmates
                </span>
              </div>
            </Link>

            {/* Hyderabad Launch Badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>Hyderabad IT Corridors</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/search" 
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
            >
              <Search className="w-4 h-4" />
              Find Flatmates
            </Link>
            
            <Link 
              to="/verification" 
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verification Hub
            </Link>

            <Link 
              to="/post-vacancy" 
              className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Post a Vacancy
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            {user && (
              <button 
                onClick={toggleDrawer}
                className="relative p-2 text-slate-600 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
                title="Notifications"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* Favourites Link */}
            {user && (
              <Link 
                to="/favourites" 
                className="p-2 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors hidden sm:block"
                title="Saved Rooms"
              >
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* User Profile / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-left"
                >
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-600 leading-none">
                      {user.role === 'ROLE_ADMIN' ? 'Admin' : user.role === 'ROLE_POSTER' ? 'Flatmate Poster' : 'Renter'}
                    </span>
                  </div>
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  {user.idVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 -ml-3 mt-4 bg-white rounded-full" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-600">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Phone {user.phoneVerified ? 'Verified' : 'Unverified'}</span>
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-listings"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Home className="w-4 h-4 text-slate-600" />
                      My Vacancies & Expiry
                    </Link>

                    <Link
                      to="/enquiries"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                      Enquiries & Messages
                    </Link>

                    <Link
                      to="/visits"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <Calendar className="w-4 h-4 text-slate-600" />
                      Scheduled Visits
                    </Link>

                    <Link
                      to="/verification"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Verification Status
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3.5 py-2 rounded-lg shadow-sm transition-all hidden sm:block"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold w-fit">
            <MapPin className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hyderabad: Madhapur, Gachibowli, Kondapur</span>
          </div>

          <Link
            to="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            <Search className="w-5 h-5 text-indigo-600" />
            Find Replacement Flatmates
          </Link>

          <Link
            to="/post-vacancy"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-base font-semibold text-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            <PlusCircle className="w-5 h-5 text-indigo-600" />
            Post a Flatmate Vacancy
          </Link>

          <Link
            to="/verification"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verification Hub
          </Link>

          {user && (
            <>
              <Link
                to="/my-listings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
              >
                <Home className="w-5 h-5 text-slate-600" />
                My Vacancies & Reconfirmation
              </Link>

              <Link
                to="/enquiries"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
              >
                <MessageSquare className="w-5 h-5 text-slate-600" />
                Enquiries & Chats
              </Link>

              <Link
                to="/visits"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-700 rounded-lg hover:bg-slate-50"
              >
                <Calendar className="w-5 h-5 text-slate-600" />
                Scheduled Visits
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-base font-bold text-indigo-700 bg-indigo-50 rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
              Admin Dashboard
            </Link>
          )}

          {!user && (
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                className="w-full text-center py-2.5 rounded-lg border border-slate-300 font-semibold text-slate-800"
              >
                Log In
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); openAuthModal('register'); }}
                className="w-full text-center py-2.5 rounded-lg bg-indigo-600 font-semibold text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
