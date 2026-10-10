import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import JobSearchComponent from '../components/JobSearchComponent';
import { Sparkles, Briefcase } from 'lucide-react';

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827] flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="relative pt-12 pb-8 px-6 overflow-hidden bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 text-xs font-bold text-orange-600 mb-3 shadow-3xs">
            <Briefcase className="w-3.5 h-3.5 text-orange-600" />
            <span>WORKZO Career Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#111827]">
            Find Your Next Opportunity
          </h1>
          <p className="text-xs sm:text-sm text-[#71717A] mt-1.5 max-w-2xl">
            Explore verified openings across top tech companies, startups, and remote teams. Apply with one click.
          </p>
        </div>
      </section>

      {/* Main Job Search Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <JobSearchComponent isDashboardEmbedded={false} />
      </main>

      <Footer />
    </div>
  );
}
