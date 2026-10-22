import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const SafetyBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 text-amber-900 shadow-xs">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
            <span>Safety Rule: Visit Before Paying</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              Roomigo Policy
            </span>
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Never wire deposit or token money upfront before physically visiting the flat and checking the current lease agreement. 
            Genuine replacement flatmates will always welcome an in-person or video walkthrough.
          </p>
        </div>
      </div>
    </div>
  );
};
