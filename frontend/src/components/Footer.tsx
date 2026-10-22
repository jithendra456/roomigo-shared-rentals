import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Heart, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Room<span className="text-indigo-400">igo</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hyderabad’s dedicated platform for replacement flatmates and verified shared flat vacancies. 
              Say goodbye to expired ads, brokers posing as tenants, and unverified promises.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hyderabad IT Corridors, Telangana</span>
            </div>
          </div>

          {/* Popular IT Localities */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Popular Localities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/search?locality=Madhapur" className="hover:text-white transition-colors">
                  Madhapur (Mindspace & Durgam Cheruvu)
                </Link>
              </li>
              <li>
                <Link to="/search?locality=Gachibowli" className="hover:text-white transition-colors">
                  Gachibowli (DLF Cyber City & Radisson)
                </Link>
              </li>
              <li>
                <Link to="/search?locality=Kondapur" className="hover:text-white transition-colors">
                  Kondapur (Botanical Garden & HITEC Link)
                </Link>
              </li>
              <li>
                <Link to="/search?locality=HITEC+City" className="hover:text-white transition-colors">
                  HITEC City (Knowledge City & Cyber Towers)
                </Link>
              </li>
              <li>
                <Link to="/search?locality=Financial+District" className="hover:text-white transition-colors">
                  Financial District & Nanakramguda
                </Link>
              </li>
              <li>
                <Link to="/search?locality=Kukatpally" className="hover:text-white transition-colors">
                  Kukatpally & KPHB Metro Zone
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Trust & Safety
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/verification" className="hover:text-white transition-colors text-emerald-400 font-medium">
                  Why Roomigo Verification Works
                </Link>
              </li>
              <li>
                <span className="text-slate-400">7-Day Auto-Expiry Rule</span>
              </li>
              <li>
                <span className="text-slate-400">Tenancy & Authority Validation</span>
              </li>
              <li>
                <span className="text-slate-400">Masked Personal IDs</span>
              </li>
              <li>
                <span className="text-slate-400">Direct Flatmate Enquiries (No Brokerage)</span>
              </li>
            </ul>
          </div>

          {/* Safety Advisory */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Safety Advisory</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Always visit the shared flat in person before transferring token money or security deposits. 
              Confirm the existing rental agreement terms with the flatmates and owner.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Roomigo Technologies Inc. Built for Hyderabad Flatmates.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for fair & verified shared living</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
