import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Building2, 
  Users, 
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import api from '../lib/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'candidate';

  const [role, setRole] = useState(initialRole); // 'candidate' | 'employer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [mismatchTarget, setMismatchTarget] = useState(null);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
    setMismatchTarget(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setMismatchTarget(null);

    try {
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
        role
      });

      if (response.data.success && response.data.session) {
        const returnedUser = response.data.user;
        const returnedRole = (returnedUser?.role || '').toLowerCase();

        // Enforce strict client-side role consistency guard
        if (returnedRole && returnedRole !== role.toLowerCase()) {
          const registeredLabel = returnedRole === 'employer' ? 'Employer' : 'Job Seeker';
          const currentLabel = role === 'employer' ? 'Employer' : 'Job Seeker';
          setErrorMsg(`Account type mismatch: This account is registered as a ${registeredLabel}, not an ${currentLabel}. Please switch to the ${registeredLabel} login tab.`);
          setMismatchTarget(returnedRole);
          return;
        }

        localStorage.setItem('workzo_token', response.data.session.access_token);
        localStorage.setItem('workzo_user', JSON.stringify(returnedUser));
        
        if (role === 'employer') {
          navigate('/dashboard/employer');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg(response.data.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const data = err.response?.data;
      if (data?.code === 'ROLE_MISMATCH') {
        const target = data.actualRole || (role === 'employer' ? 'candidate' : 'employer');
        setMismatchTarget(target);
        setErrorMsg(data.message || 'Account role mismatch. Please switch to the matching login tab.');
      } else {
        setMismatchTarget(null);
        setErrorMsg(data?.message || 'Login failed. Please check your email and password.');
      }
    } finally {
      setIsLoading(false);
    }
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

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-6 py-6 my-auto">
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-8 sm:p-10 shadow-lg hover:border-orange-200 transition-all">
          
          {/* Card Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-[#71717A] mt-2">
              Sign in to manage your {role === 'candidate' ? 'applications and profile' : 'job postings and applicants'}
            </p>
          </div>

          {/* Role Selector Tabs (Job Seeker Orange vs Employer Black) */}
          <div className="p-1.5 bg-[#F4F4F5] rounded-2xl border border-[#E5E7EB] flex items-center gap-1.5 mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('candidate')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                role === 'candidate' 
                  ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-xs ring-1 ring-orange-200/80' 
                  : 'bg-transparent text-[#71717A] border-transparent hover:bg-orange-50/80 hover:text-orange-600 hover:border-orange-200'
              }`}
            >
              <Users className={`w-4 h-4 transition-colors ${role === 'candidate' ? 'text-orange-600' : 'text-[#71717A]'}`} />
              <span>Job Seeker</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('employer')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                role === 'employer' 
                  ? 'bg-[#111827] text-white border-[#111827] shadow-xs ring-1 ring-slate-900/30' 
                  : 'bg-transparent text-[#71717A] border-transparent hover:bg-slate-200/80 hover:text-[#111827]'
              }`}
            >
              <Building2 className={`w-4 h-4 transition-colors ${role === 'employer' ? 'text-white' : 'text-[#71717A]'}`} />
              <span>Employer</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className={`p-4 rounded-2xl border text-xs ${
                mismatchTarget
                  ? 'bg-amber-50/95 border-amber-300 text-amber-900 shadow-2xs'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <div className="flex items-start gap-2.5">
                  <AlertCircle className={`w-4 h-4 shrink-0 mt-0.5 ${
                    mismatchTarget ? 'text-amber-600' : 'text-red-600'
                  }`} />
                  <div className="flex-1">
                    {mismatchTarget && (
                      <p className="font-bold text-amber-950 uppercase tracking-wider text-[10px] mb-0.5">
                        Account Role Mismatch
                      </p>
                    )}
                    <span className="font-medium leading-relaxed">{errorMsg}</span>
                  </div>
                </div>

                {mismatchTarget && (
                  <div className="mt-3 pt-2.5 border-t border-amber-200/80 flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-[11px] text-amber-800 font-semibold">
                      Account Type: <strong>{mismatchTarget === 'employer' ? 'Employer' : 'Job Seeker'}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRoleChange(mismatchTarget)}
                      className="px-3 py-1.5 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Switch to {mismatchTarget === 'employer' ? 'Employer' : 'Job Seeker'} Tab</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#111827] mb-1.5">
                Email Address
              </label>
              <div className="group relative flex items-center rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 focus-within:shadow-xs">
                <Mail className="w-4 h-4 text-[#71717A] group-focus-within:text-orange-600 absolute left-3.5 pointer-events-none transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'candidate' ? 'name@example.com' : 'recruiting@company.com'}
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-sm text-[#111827] placeholder-[#A1A1AA] outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#111827]">
                  Password
                </label>
                <a 
                  href="#" 
                  className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline focus-visible:outline-none focus-visible:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="group relative flex items-center rounded-xl border border-[#E5E7EB] bg-white transition-all duration-200 hover:border-slate-400 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/15 focus-within:shadow-xs">
                <Lock className="w-4 h-4 text-[#71717A] group-focus-within:text-orange-600 absolute left-3.5 pointer-events-none transition-colors" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <input 
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-orange-600 border-[#E5E7EB] rounded focus:ring-2 focus:ring-orange-400 cursor-pointer accent-orange-600"
              />
              <label htmlFor="rememberMe" className="text-xs text-[#71717A] hover:text-[#111827] cursor-pointer select-none transition-colors">
                Keep me signed in for 30 days
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
              <span>{isLoading ? 'Signing in...' : `Sign In as ${role === 'candidate' ? 'Job Seeker' : 'Employer'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Switch to Register */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
            <p className="text-xs text-[#71717A]">
              Don't have a WORKZO account?{' '}
              <Link 
                to={`/register?role=${role}`} 
                className="font-bold text-orange-600 hover:text-orange-700 hover:underline focus-visible:outline-none focus-visible:underline"
              >
                Sign up now
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
