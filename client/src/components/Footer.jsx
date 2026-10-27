import React from 'react';
import { Shield, Database, Building2, Server } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0E1713] text-stone-400 border-t border-stone-800 py-10 px-4 sm:px-8 text-xs">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-stone-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#143828] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-extrabold text-white text-sm tracking-tight flex items-center gap-2">
                <span>CAMPUS-X</span>
                <span className="text-[10px] font-mono uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1.5 py-0.2 rounded font-bold">
                  v2.5
                </span>
              </div>
              <div className="text-[11px] text-stone-400 font-medium">
                University Facility Booking & Spatial Management System
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 text-stone-300 bg-stone-900 px-2.5 py-1 rounded border border-stone-800">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>MongoDB Atlas & Mongoose</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-300 bg-stone-900 px-2.5 py-1 rounded border border-stone-800">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>httpOnly Cookie Auth</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-stone-300 bg-stone-900 px-2.5 py-1 rounded border border-stone-800">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>Express 4 Engine</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <p>© 2026 Campus-X Operations. Built with React 19, Tailwind CSS v4 & Express.js.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Campus Services Nominal</span>
            </span>
            <span>Fall 2026 Term</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
