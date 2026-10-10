import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  Users,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const location = useLocation();

  // Scroll to section on hash change
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const featuredJobs = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      company: 'Veloce Labs',
      location: 'Remote',
      salary: '$130k - $155k',
      type: 'Full-time',
      department: 'Engineering',
      postedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Lead Product Designer',
      company: 'NotionCraft',
      location: 'San Francisco, CA',
      salary: '$125k - $150k',
      type: 'Full-time',
      department: 'Design',
      postedDate: '3 days ago'
    },
    {
      id: 3,
      title: 'Backend Systems Architect',
      company: 'CloudScale Inc.',
      location: 'Remote',
      salary: '$145k - $175k',
      type: 'Full-time',
      department: 'Engineering',
      postedDate: 'Just now'
    }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111827] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 px-6 overflow-hidden">
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

          {/* Hero Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => scrollTo('jobs')}
              className="workzo-btn-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <span>Find Jobs</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo('for-employers')}
              className="workzo-btn-dark w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all"
            >
              <Building2 className="w-4 h-4" />
              <span>For Employers</span>
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[#71717A]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% Verified Employers</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>Direct Applications</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Fast-Track Response</span>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Jobs Section */}
      <section id="jobs" className="py-16 sm:py-20 px-6 bg-white scroll-mt-24 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Active Listings</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-1">
                Featured Verified Jobs
              </h2>
              <p className="text-sm text-[#71717A] mt-1">
                Explore handpicked verified opportunities available for immediate application.
              </p>
            </div>
            <Link 
              to="/jobs"
              className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Explore all jobs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <div 
                key={job.id}
                className="bg-[#FAFAF9] border border-[#E5E7EB] hover:border-orange-300 rounded-2xl p-6 transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-orange-100/70 text-orange-700 border border-orange-200/60">
                      {job.department}
                    </span>
                    <span className="text-xs text-[#A1A1AA]">{job.postedDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#111827] mb-1">{job.title}</h3>
                  <p className="text-xs font-medium text-[#4B5563] mb-3">{job.company}</p>

                  <div className="space-y-1.5 text-xs text-[#71717A] mb-6">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-semibold text-[#111827]">
                      <span>{job.salary}</span>
                      <span className="text-[#A1A1AA] font-normal">• {job.type}</span>
                    </p>
                  </div>
                </div>

                <Link
                  to="/register?role=candidate"
                  className="workzo-btn-primary w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
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
      <section id="for-candidates" className="py-20 px-6 bg-white scroll-mt-24">
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
            <div id="for-employers" className="bg-[#FAFAF9] border border-[#E5E7EB] rounded-3xl p-8 sm:p-10 hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24">
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
