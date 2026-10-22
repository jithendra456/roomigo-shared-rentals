import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search, Home } from 'lucide-react';
import { Listing } from '../types';
import { listingService } from '../services/listingService';
import { ListingCard } from '../components/ListingCard';
import { useAuth } from '../context/AuthContext';

export const FavouritesPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [favourites, setFavourites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFavs = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await listingService.getMyFavourites();
        setFavourites(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Heart className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign in to View Saved Rooms</h2>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Saved Vacancies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Rooms and replacement flatmates you have bookmarked.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400">Loading saved rooms...</div>
      ) : favourites.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <Heart className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-bold text-slate-800">No saved vacancies yet</p>
          <p className="text-xs text-slate-400">Click the heart icon on any listing card to save it for later.</p>
          <Link
            to="/search"
            className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs mt-2"
          >
            Explore Vacancies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((listing) => (
            <ListingCard key={listing.id} listing={listing} initialFavourited={true} />
          ))}
        </div>
      )}
    </div>
  );
};
