import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] shadow-3xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/workzo-logo.png" 
              alt="WORKZO" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#4B5563]">
            <Link to="/#search" className="hover:text-orange-600 transition-colors">Find Jobs</Link>
            <Link to="/#for-candidates" className="hover:text-orange-600 transition-colors">For Candidates</Link>
            <Link to="/#for-employers" className="hover:text-orange-600 transition-colors">For Employers</Link>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link 
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100/80 border border-orange-200/80 rounded-xl transition-all cursor-pointer shadow-3xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-orange-600" />
            <span>Dashboard</span>
          </Link>

          <div className="w-[1px] h-6 bg-[#E5E7EB] mx-1" />

          <Link 
            to="/login"
            className="px-4 py-2 text-sm font-semibold text-[#111827] hover:text-orange-600 hover:bg-slate-100/70 rounded-xl transition-all cursor-pointer"
          >
            Log In
          </Link>

          <Link 
            to="/register"
            className="workzo-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer shadow-sm inline-flex items-center gap-1.5 active:scale-98 transition-all"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex sm:hidden items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#71717A] hover:text-[#111827] hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#E5E7EB] p-5 space-y-3 shadow-lg">
          <Link 
            to="/#search" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#111827] hover:text-orange-600"
          >
            Find Jobs
          </Link>
          <Link 
            to="/#for-candidates" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#111827] hover:text-orange-600"
          >
            For Candidates
          </Link>
          <Link 
            to="/#for-employers" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-[#111827] hover:text-orange-600"
          >
            For Employers
          </Link>
          <Link 
            to="/dashboard" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-orange-600"
          >
            Candidate Dashboard →
          </Link>

          <div className="pt-3 border-t border-[#E5E7EB] flex flex-col gap-2">
            <Link 
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-semibold text-[#111827] bg-[#FAFAF9] rounded-xl border border-[#E5E7EB]"
            >
              Log In
            </Link>
            <Link 
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="workzo-btn-primary w-full py-2.5 text-center text-sm font-semibold rounded-xl"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
