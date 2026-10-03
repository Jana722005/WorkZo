import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E7EB] bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="flex items-center gap-3">
          <Link to="/">
            <img 
              src="/workzo-logo.png" 
              alt="WORKZO" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>
          <span className="text-sm text-[#71717A]">© 2026 WORKZO Inc. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#71717A]">
          <Link to="/#search" className="hover:text-orange-600 transition-colors">Jobs</Link>
          <Link to="/#for-candidates" className="hover:text-orange-600 transition-colors">Candidates</Link>
          <Link to="/#for-employers" className="hover:text-orange-600 transition-colors">Employers</Link>
          <Link to="/login" className="hover:text-orange-600 transition-colors">Log In</Link>
          <Link to="/register" className="hover:text-orange-600 transition-colors">Sign Up</Link>
        </div>

      </div>
    </footer>
  );
}
