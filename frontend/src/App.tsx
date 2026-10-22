import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { PwaInstallPrompt } from './components/PwaInstallPrompt';

import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { PostListingWizard } from './pages/PostListingWizard';
import { VerificationPage } from './pages/VerificationPage';
import { MyListingsPage } from './pages/MyListingsPage';
import { EnquiriesPage } from './pages/EnquiriesPage';
import { VisitsPage } from './pages/VisitsPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
            <Navbar />
            
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/listings/:id" element={<ListingDetailPage />} />
                <Route path="/post-vacancy" element={<PostListingWizard />} />
                <Route path="/verification" element={<VerificationPage />} />
                <Route path="/my-listings" element={<MyListingsPage />} />
                <Route path="/enquiries" element={<EnquiriesPage />} />
                <Route path="/visits" element={<VisitsPage />} />
                <Route path="/favourites" element={<FavouritesPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <AuthModal />
            <NotificationDrawer />
            <PwaInstallPrompt />
          </div>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
