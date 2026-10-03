import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2 
} from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'candidate';

  const [role, setRole] = useState(initialRole);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setIsLoading(true);
    // Prepared for Supabase Auth integration in Step 4
    setTimeout(() => {
      setIsLoading(false);
      navigate(role === 'employer' ? '/dashboard/employer' : '/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827] flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Background Subtle Gradient Blobs (Warm Orange & Charcoal) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-60 workzo-hero-gradient"
        />
      </div>

      {/* Top Bar with Logo & Back to Home */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <img 
            src="/workzo-logo.png" 
            alt="WORKZO" 
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 hover:scale-105"
          />
        </Link>
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-[#71717A] hover:text-[#111827] hover:bg-slate-200/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Register Card */}
      <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-6 my-auto">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-10 shadow-lg hover:border-orange-200 transition-all">
          
          {/* Card Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Create your account
            </h1>
            <p className="text-sm text-[#71717A] mt-2">
              Join WORKZO to start connecting with {role === 'candidate' ? 'verified employers' : 'qualified candidates'}
            </p>
          </div>

          {/* Role Choice Cards (Orange Candidate vs Black Employer) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setRole('candidate')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                role === 'candidate'
                  ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-200/80 shadow-xs'
                  : 'border-[#E5E7EB] bg-[#FAFAF9] hover:border-orange-300 hover:bg-orange-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">Candidate</span>
                {role === 'candidate' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
              </div>
              <p className="text-sm font-bold text-[#111827]">Job Seeker</p>
              <p className="text-[11px] text-[#71717A] mt-0.5">Find jobs & apply</p>
            </button>

            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                role === 'employer'
                  ? 'border-[#111827] bg-[#111827] text-white ring-2 ring-slate-900/30 shadow-xs'
                  : 'border-[#E5E7EB] bg-[#FAFAF9] hover:border-slate-400 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold uppercase tracking-wide ${role === 'employer' ? 'text-orange-400' : 'text-[#111827]'}`}>
                  Employer
                </span>
                {role === 'employer' && <CheckCircle2 className="w-4 h-4 text-orange-400" />}
              </div>
              <p className={`text-sm font-bold ${role === 'employer' ? 'text-white' : 'text-[#111827]'}`}>Company</p>
              <p className={`text-[11px] mt-0.5 ${role === 'employer' ? 'text-slate-300' : 'text-[#71717A]'}`}>Post jobs & hire</p>
            </button>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* If Employer, show Company Name */}
            {role === 'employer' && (
              <div>
                <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                  Company Name
                </label>
                <div className="group relative flex items-center rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 focus-within:shadow-xs">
                  <Building2 className="w-4 h-4 text-[#71717A] group-focus-within:text-orange-600 absolute left-3.5 pointer-events-none transition-colors" />
                  <input 
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Technologies Inc."
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-[#111827] placeholder-[#A1A1AA] outline-none"
                  />
                </div>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {role === 'employer' ? 'Contact Person Name' : 'Full Name'}
              </label>
              <div className="group relative flex items-center rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 focus-within:shadow-xs">
                <User className="w-4 h-4 text-[#71717A] group-focus-within:text-orange-600 absolute left-3.5 pointer-events-none transition-colors" />
                <input 
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'employer' ? 'Jane Doe (HR Manager)' : 'John Doe'}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-[#111827] placeholder-[#A1A1AA] outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                {role === 'employer' ? 'Work Email Address' : 'Email Address'}
              </label>
              <div className="group relative flex items-center rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 focus-within:shadow-xs">
                <Mail className="w-4 h-4 text-[#71717A] group-focus-within:text-orange-600 absolute left-3.5 pointer-events-none transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'employer' ? 'recruiting@company.com' : 'john@example.com'}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-[#111827] placeholder-[#A1A1AA] outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Password
              </label>
              <div className="group relative flex items-center rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 focus-within:shadow-xs">
                <Lock className="w-4 h-4 text-[#71717A] group-focus-within:text-orange-600 absolute left-3.5 pointer-events-none transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-10 pr-11 py-3 bg-transparent text-sm text-[#111827] placeholder-[#A1A1AA] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 text-[#71717A] hover:text-[#111827] hover:bg-slate-100 rounded-lg p-1.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Confirm Password
              </label>
              <div className="group relative flex items-center rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 focus-within:shadow-xs">
                <Lock className="w-4 h-4 text-[#71717A] group-focus-within:text-orange-600 absolute left-3.5 pointer-events-none transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-[#111827] placeholder-[#A1A1AA] outline-none"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input 
                type="checkbox"
                id="agreeTerms"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-orange-600 border-[#E5E7EB] rounded focus:ring-2 focus:ring-orange-400 cursor-pointer accent-orange-600"
              />
              <label htmlFor="agreeTerms" className="text-xs text-[#71717A] hover:text-[#111827] cursor-pointer select-none leading-tight transition-colors">
                I agree to the WORKZO Terms of Service and Privacy Policy
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`${
                role === 'candidate' ? 'workzo-btn-primary' : 'workzo-btn-dark'
              } w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-4 ${
                role === 'candidate' ? 'focus-visible:ring-orange-500/30' : 'focus-visible:ring-slate-900/30'
              } transition-all mt-2`}
            >
              <span>{isLoading ? 'Creating account...' : `Sign Up as ${role === 'candidate' ? 'Job Seeker' : 'Employer'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Switch to Login */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-xs text-[#71717A]">
              Already have an account?{' '}
              <Link 
                to={`/login?role=${role}`} 
                className="font-bold text-orange-600 hover:text-orange-700 hover:underline focus-visible:outline-none focus-visible:underline"
              >
                Log in
              </Link>
            </p>
          </div>

        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-[#71717A]">
        <span>© 2026 WORKZO Inc. Clean & Professional Job Portal</span>
      </footer>

    </div>
  );
}
