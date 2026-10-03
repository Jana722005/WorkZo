import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Users,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Remote'];

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section id="search" className="relative pt-16 pb-20 px-6 overflow-hidden">
        {/* Subtle Warm Orange & Soft Charcoal Ambient Splash */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 -z-10 opacity-70 pointer-events-none rounded-b-3xl blur-2xl workzo-hero-gradient"
        />

        <div className="max-w-4xl mx-auto text-center">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-orange-200/80 shadow-xs text-xs font-semibold text-orange-600 mb-6">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span>The Modern Job Portal for Job Seekers & Employers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.15] mb-6">
            Find the right job.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Hire the right talent.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-[#71717A] max-w-2xl mx-auto leading-relaxed mb-10">
            WORKZO connects ambitious candidates with verified employers. Clean, direct, and completely transparent.
          </p>

          {/* Main Search Box */}
          <div className="bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-xl max-w-3xl mx-auto hover:border-orange-200 transition-colors">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              
              {/* Job Title / Keyword Input */}
              <div className="flex items-center gap-3 px-3 py-2 w-full flex-1">
                <Search className="w-5 h-5 text-[#71717A] shrink-0" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Job title, keywords, or company..."
                  className="w-full text-base text-[#111827] placeholder-[#71717A] outline-none bg-transparent"
                />
              </div>

              <div className="hidden sm:block w-[1px] h-8 bg-[#E5E7EB]" />

              {/* Location Input */}
              <div className="flex items-center gap-3 px-3 py-2 w-full sm:w-64">
                <MapPin className="w-5 h-5 text-[#71717A] shrink-0" />
                <input 
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="City, state, or Remote"
                  className="w-full text-base text-[#111827] placeholder-[#71717A] outline-none bg-transparent"
                />
              </div>

              {/* Search Button */}
              <button className="workzo-btn-primary w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shrink-0 cursor-pointer">
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-xs font-medium text-[#71717A] mr-2">Popular:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#111827] text-white border-[#111827]'
                    : 'bg-white text-[#71717A] border-[#E5E7EB] hover:border-orange-300 hover:text-orange-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Stats Banner */}
      <section className="border-y border-[#E5E7EB] bg-[#FAFAF9] py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#111827]">2,500+</p>
            <p className="text-sm font-medium text-[#71717A] mt-1">Active Job Listings</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-orange-600">850+</p>
            <p className="text-sm font-medium text-[#71717A] mt-1">Verified Employers</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-[#111827]">98%</p>
            <p className="text-sm font-medium text-[#71717A] mt-1">Application Response</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-orange-600">&lt; 24h</p>
            <p className="text-sm font-medium text-[#71717A] mt-1">Fast-track Reviews</p>
          </div>
        </div>
      </section>

      {/* Two Paths (Job Seeker vs Employer) */}
      <section id="for-candidates" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827]">
              Built for both sides of hiring
            </h2>
            <p className="text-base text-[#71717A] mt-3">
              Whether you are taking the next step in your career or scaling your team, WORKZO keeps it clean and efficient.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Card 1: Job Seekers */}
            <div className="bg-[#FAFAF9] border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600">For Job Seekers</span>
                <h3 className="text-2xl font-bold text-[#111827] mt-2 mb-4">
                  Looking for your next opportunity?
                </h3>
                <p className="text-sm text-[#71717A] mb-6">
                  Build your professional profile, upload your resume, and apply to top companies with complete transparency.
                </p>

                <ul className="space-y-3 mb-8 text-sm text-[#111827]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Upload resume & build candidate profile</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>1-click application and real-time tracking</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Direct interview invites and instant notifications</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/register?role=candidate"
                className="workzo-btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
              >
                <span>Get Started as Candidate</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Card 2: Employers */}
            <div id="for-employers" className="bg-[#FAFAF9] border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 shadow-sm">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#111827]">For Employers</span>
                <h3 className="text-2xl font-bold text-[#111827] mt-2 mb-4">
                  Hiring exceptional talent?
                </h3>
                <p className="text-sm text-[#71717A] mb-6">
                  Post verified openings, manage applicants, download resumes, and schedule candidate interviews effortlessly.
                </p>

                <ul className="space-y-3 mb-8 text-sm text-[#111827]">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#111827] shrink-0" />
                    <span>Post and manage active job listings</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#111827] shrink-0" />
                    <span>Review applicants, view profiles & download resumes</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#111827] shrink-0" />
                    <span>Shortlist candidates and schedule interviews</span>
                  </li>
                </ul>
              </div>

              <Link 
                to="/register?role=employer"
                className="workzo-btn-dark w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
              >
                <span>Post Jobs as Employer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden workzo-hero-gradient border border-orange-200/80 shadow-sm">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] max-w-xl mx-auto leading-tight">
            Ready to experience a cleaner way to work and hire?
          </h2>
          <p className="text-base text-[#71717A] max-w-lg mx-auto mt-4 mb-8">
            Join thousands of professionals and companies discovering great matches on WORKZO today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/register?role=candidate"
              className="workzo-btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm cursor-pointer shadow-md inline-block"
            >
              Create Candidate Account
            </Link>
            <Link 
              to="/register?role=employer"
              className="workzo-btn-dark w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm cursor-pointer shadow-md inline-block"
            >
              Post Jobs as Employer
            </Link>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
