import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Footer() {
  const location = useLocation();

  const handleNavClick = (e, targetId) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    }
  };

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

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#71717A]">
          <Link 
            to="/#jobs" 
            onClick={(e) => handleNavClick(e, 'jobs')}
            className="hover:text-orange-600 transition-colors"
          >
            Find Jobs
          </Link>
          <Link 
            to="/#for-candidates" 
            onClick={(e) => handleNavClick(e, 'for-candidates')}
            className="hover:text-orange-600 transition-colors"
          >
            For Candidates
          </Link>
          <Link 
            to="/#for-employers" 
            onClick={(e) => handleNavClick(e, 'for-employers')}
            className="hover:text-orange-600 transition-colors"
          >
            For Employers
          </Link>
          <Link to="/login" className="hover:text-orange-600 transition-colors">Log In</Link>
          <Link to="/register" className="hover:text-orange-600 transition-colors">Sign Up</Link>
        </div>

      </div>
    </footer>
  );
}
