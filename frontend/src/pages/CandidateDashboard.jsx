import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import JobSearchComponent from '../components/JobSearchComponent';
import { 
  LayoutDashboard, 
  Search,
  Briefcase, 
  Bookmark, 
  Calendar,
  User, 
  FileText, 
  ShieldCheck,
  Bell, 
  Settings,
  LogOut, 
  Menu, 
  X, 
  Clock, 
  MapPin, 
  DollarSign, 
  ArrowRight,
  Video,
  GripVertical,
  PanelLeftClose,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  ExternalLink,
  ChevronRight,
  Save,
  Plus,
  Phone,
  Smartphone,
  Send,
  KeyRound,
  ShieldAlert,
  Check,
  Mail,
  Sparkles,
  Camera,
  Loader2,
  Download,
  RefreshCw,
  FileUp,
  Copy
} from 'lucide-react';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // In-App Confirmation Modal State (Reliable across all browser environments)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    onConfirm: null
  });

  // Mobile Verification State
  const [isPhoneVerified, setIsPhoneVerified] = useState(() => {
    try {
      return localStorage.getItem('workzo_candidate_phone_verified') === 'true';
    } catch (_) {
      return false;
    }
  });

  const [verifiedPhone, setVerifiedPhone] = useState(() => {
    try {
      return localStorage.getItem('workzo_candidate_verified_phone') || '';
    } catch (_) {
      return '';
    }
  });

  const [verificationCountryCode, setVerificationCountryCode] = useState('+1');
  const [verificationPhone, setVerificationPhone] = useState(() => {
    try {
      return localStorage.getItem('workzo_candidate_verified_phone') || '';
    } catch (_) {
      return '';
    }
  });
  const [verificationStep, setVerificationStep] = useState(() => {
    try {
      if (localStorage.getItem('workzo_candidate_phone_verified') === 'true') {
        return 'verified';
      }
    } catch (_) {}
    return 'input';
  });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [activeOtpCode, setActiveOtpCode] = useState('123456');
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef([]);

  // Sync phone verification state with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('workzo_candidate_phone_verified', String(isPhoneVerified));
      if (verifiedPhone) {
        localStorage.setItem('workzo_candidate_verified_phone', verifiedPhone);
      }
    } catch (_) {}
  }, [isPhoneVerified, verifiedPhone]);

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  // File Upload States & Refs
  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeMeta, setResumeMeta] = useState({
    filename: '',
    size: '',
    updatedAt: ''
  });

  // 1. Live Candidate Profile State (Initialized from localStorage if present)
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('workzo_user') || '{}');
    } catch {
      return {};
    }
  })();

  const [candidate, setCandidate] = useState({
    name: storedUser.fullName || '',
    email: storedUser.email || '',
    headline: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    resume_url: '',
    avatar: storedUser.avatar || ''
  });

  // Role Protection: Ensure an employer account is routed to the employer dashboard
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('workzo_user') || '{}');
      if (u.role === 'employer') {
        navigate('/dashboard/employer', { replace: true });
      }
    } catch (_) {}
  }, [navigate]);

  // Keep verificationPhone in sync if candidate.phone is loaded from profile
  useEffect(() => {
    if (candidate.phone && !verificationPhone) {
      setVerificationPhone(candidate.phone);
    }
  }, [candidate.phone, verificationPhone]);

  // 2. Real Applications & Saved Jobs & Interviews States (Hydrated from localStorage)
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('workzo_candidate_applications');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  const [savedJobs, setSavedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('workzo_candidate_saved_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  });

  const [copiedMeetId, setCopiedMeetId] = useState(null);
  const handleCopyMeetLink = (link, id) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedMeetId(id);
    setToastMsg('Google Meet link copied to clipboard!');
    setTimeout(() => setCopiedMeetId(null), 2500);
  };

  const [interviews, setInterviews] = useState(() => {
    try {
      const saved = localStorage.getItem('workzo_candidate_interviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      const empSaved = localStorage.getItem('workzo_employer_interviews');
      if (empSaved) {
        const parsed = JSON.parse(empSaved);
        if (Array.isArray(parsed)) {
          const u = JSON.parse(localStorage.getItem('workzo_user') || '{}');
          if (u.fullName) {
            const matched = parsed.filter(i => 
              i.candidateName && i.candidateName.toLowerCase() === u.fullName.toLowerCase()
            );
            if (matched.length > 0) return matched;
          }
        }
      }
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    const handleSyncInterviews = () => {
      try {
        const saved = localStorage.getItem('workzo_candidate_interviews');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setInterviews(parsed);
            return;
          }
        }
        const empSaved = localStorage.getItem('workzo_employer_interviews');
        if (empSaved) {
          const parsed = JSON.parse(empSaved);
          if (Array.isArray(parsed)) {
            const u = JSON.parse(localStorage.getItem('workzo_user') || '{}');
            if (u.fullName) {
              const matched = parsed.filter(i => 
                i.candidateName && i.candidateName.toLowerCase() === u.fullName.toLowerCase()
              );
              setInterviews(matched);
            }
          }
        }
      } catch (_) {}
    };

    window.addEventListener('storage', handleSyncInterviews);
    return () => window.removeEventListener('storage', handleSyncInterviews);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('workzo_candidate_applications', JSON.stringify(applications));
    } catch (_) {}
  }, [applications]);

  useEffect(() => {
    try {
      localStorage.setItem('workzo_candidate_saved_jobs', JSON.stringify(savedJobs));
    } catch (_) {}
  }, [savedJobs]);
  const [availableJobs, setAvailableJobs] = useState([
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
  ]);

  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to WORKZO',
      message: 'Your profile has been created. Complete your details to get discovered by employers.',
      time: 'Just now',
      unread: true
    }
  ]);

  // Calculate dynamic Profile Completion Percentage
  const calculateCompletion = () => {
    let score = 0;
    if (candidate.name?.trim()) score += 10;
    if (candidate.email?.trim()) score += 10;
    if (candidate.headline?.trim()) score += 10;
    if (candidate.location?.trim()) score += 10;
    if (candidate.phone?.trim()) score += 10;
    if (isPhoneVerified) score += 10;
    if (candidate.bio?.trim()) score += 10;
    if (candidate.skills?.length > 0) score += 10;
    if (candidate.avatar) score += 10;
    if (candidate.resume_url) score += 10;
    return Math.min(score, 100);
  };

  const profileCompletePercent = calculateCompletion();

  // Load user profile from live backend API
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('workzo_token');
      if (!token) return;

      try {
        const res = await api.get('/users/me');
        if (res.data?.profile) {
          const p = res.data.profile;
          const loadedAvatar = p.avatar_url || storedUser.avatar || '';
          setCandidate({
            name: p.full_name || storedUser.fullName || '',
            email: p.email || storedUser.email || '',
            headline: p.headline || '',
            phone: p.phone || '',
            location: p.location || '',
            bio: p.bio || '',
            skills: Array.isArray(p.skills) ? p.skills : [],
            resume_url: p.resume_url || '',
            avatar: loadedAvatar
          });

          // Keep localStorage in sync so avatar is instantly available on reload
          if (p.avatar_url) {
            try {
              const u = JSON.parse(localStorage.getItem('workzo_user') || '{}');
              u.avatar = p.avatar_url;
              localStorage.setItem('workzo_user', JSON.stringify(u));
            } catch (_) {}
          }

          if (p.resume_url) {
            const rawName = p.resume_url.split('/').pop() || 'resume.pdf';
            const cleanName = rawName.replace(/^resume-[a-zA-Z0-9_-]+-\d+-/, '');
            setResumeMeta({
              filename: cleanName || 'Candidate_Resume.pdf',
              size: 'PDF Document',
              updatedAt: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Verified'
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch user profile from API:', err);
      }
    };

    fetchProfile();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Profile Save Handler (Calls live PUT /api/users/me)
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setIsSavingProfile(true);

    try {
      const response = await api.put('/users/me', {
        full_name: candidate.name,
        headline: candidate.headline,
        phone: candidate.phone,
        location: candidate.location,
        bio: candidate.bio,
        skills: candidate.skills,
        resume_url: candidate.resume_url,
        avatar_url: candidate.avatar
      });

      if (response.data?.success) {
        // Update local storage user name and avatar
        const updatedUser = { 
          ...storedUser, 
          fullName: candidate.name,
          avatar: candidate.avatar 
        };
        localStorage.setItem('workzo_user', JSON.stringify(updatedUser));
        showToast('Profile updated successfully!');
      } else {
        showToast(response.data?.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      showToast(err.response?.data?.message || 'Server error saving profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Profile Photo Upload Handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB.');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showToast('Please select a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await api.post('/upload/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data?.avatar_url) {
        setCandidate(prev => ({ ...prev, avatar: res.data.avatar_url }));
        try {
          const u = JSON.parse(localStorage.getItem('workzo_user') || '{}');
          u.avatar = res.data.avatar_url;
          localStorage.setItem('workzo_user', JSON.stringify(u));
        } catch (_) {}
        showToast('Profile image updated successfully!');
      } else {
        showToast(res.data?.message || 'Failed to upload profile image.');
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      showToast(err.response?.data?.message || 'Server error uploading profile image.');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setIsUploadingAvatar(true);
      await api.put('/users/me', { avatar_url: '' });
      setCandidate(prev => ({ ...prev, avatar: '' }));
      try {
        const u = JSON.parse(localStorage.getItem('workzo_user') || '{}');
        delete u.avatar;
        localStorage.setItem('workzo_user', JSON.stringify(u));
      } catch (_) {}
      showToast('Profile photo removed.');
    } catch (err) {
      showToast('Failed to remove profile photo.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Resume Document Upload Handler
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('Resume file size must be less than 15MB.');
      return;
    }

    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) {
      showToast('Please select a PDF, DOC, or DOCX document.');
      return;
    }

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/upload/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success && res.data?.resume_url) {
        setCandidate(prev => ({ ...prev, resume_url: res.data.resume_url }));
        setResumeMeta({
          filename: res.data.filename || file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          updatedAt: 'Just now'
        });
        showToast('Resume document uploaded successfully!');
      } else {
        showToast(res.data?.message || 'Failed to upload resume document.');
      }
    } catch (err) {
      console.error('Error uploading resume:', err);
      showToast(err.response?.data?.message || 'Server error uploading resume.');
    } finally {
      setIsUploadingResume(false);
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  const handleRemoveResume = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Remove Resume',
      message: 'Are you sure you want to remove your uploaded resume? This cannot be undone.',
      confirmText: 'Remove Resume',
      onConfirm: async () => {
        try {
          setIsUploadingResume(true);
          await api.put('/users/me', { resume_url: '' });
          setCandidate(prev => ({ ...prev, resume_url: '' }));
          setResumeMeta({ filename: '', size: '', updatedAt: '' });
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          showToast('Resume removed successfully.');
        } catch (err) {
          showToast('Failed to remove resume.');
        } finally {
          setIsUploadingResume(false);
        }
      }
    });
  };

  // Add / Remove Skills handlers
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (candidate.skills.includes(trimmed)) {
      setNewSkillInput('');
      return;
    }
    setCandidate(prev => ({
      ...prev,
      skills: [...prev.skills, trimmed]
    }));
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCandidate(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Mobile Number Verification Handlers (Demo Mode / Realtime Ready)
  const handleSendVerificationCode = async (e) => {
    if (e) e.preventDefault();
    const rawNumber = (verificationPhone || candidate.phone || '').trim();
    if (!rawNumber || rawNumber.length < 6) {
      setOtpError('Please enter a valid mobile number with area code.');
      return;
    }

    const fullPhone = rawNumber.startsWith('+') 
      ? rawNumber 
      : `${verificationCountryCode}${rawNumber.replace(/^\+/, '')}`;

    setIsSendingOtp(true);
    setOtpError('');

    try {
      const res = await api.post('/verification/send-code', { phone: fullPhone });
      if (res.data?.success) {
        setVerificationStep('otp');
        setOtpCountdown(60);
        setOtpDigits(['', '', '', '', '', '']);
        const generatedCode = res.data.demoCode || res.data.debugCode || '123456';
        setActiveOtpCode(generatedCode);
        showToast(res.data.message || `Demo Code: ${generatedCode}`);
        setTimeout(() => {
          if (otpInputRefs.current[0]) otpInputRefs.current[0].focus();
        }, 150);
      } else {
        setOtpError(res.data?.message || 'Failed to dispatch verification code.');
      }
    } catch (err) {
      console.warn('Backend verification route notice (Demo Mode active):', err);
      // Graceful demo mode fallback so UI testing/demoing never breaks
      setVerificationStep('otp');
      setOtpCountdown(60);
      setOtpDigits(['', '', '', '', '', '']);
      setActiveOtpCode('123456');
      showToast('Demo Mode active: Use code 123456 to verify.');
      setTimeout(() => {
        if (otpInputRefs.current[0]) otpInputRefs.current[0].focus();
      }, 150);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleAutoFillDemoOtp = () => {
    const code = activeOtpCode || '123456';
    const digits = code.split('').slice(0, 6);
    while (digits.length < 6) digits.push('0');
    setOtpDigits(digits);
    setOtpError('');
    showToast(`Auto-filled demo passcode: ${code}`);
  };

  const handleQuickDemoVerify = async () => {
    const rawNumber = (verificationPhone || candidate.phone || '555-019-2831').trim();
    const fullPhone = rawNumber.startsWith('+') 
      ? rawNumber 
      : `${verificationCountryCode}${rawNumber.replace(/^\+/, '')}`;

    setVerificationPhone(rawNumber);
    setIsSubmittingOtp(true);
    setOtpError('');

    try {
      await api.post('/verification/verify-code', {
        phone: fullPhone,
        code: '123456'
      });
    } catch (_) {
      // In demo mode, frontend state updates reliably
    }

    setIsPhoneVerified(true);
    setVerifiedPhone(fullPhone);
    setCandidate(prev => ({ ...prev, phone: fullPhone }));
    setVerificationStep('verified');

    try {
      localStorage.setItem('workzo_candidate_phone_verified', 'true');
      localStorage.setItem('workzo_candidate_verified_phone', fullPhone);
    } catch (_) {}

    showToast('Mobile number verified instantly via Quick Demo!');
    setIsSubmittingOtp(false);

    setNotifications(prev => [
      {
        id: Date.now(),
        title: 'Mobile Number Verified ✓ (Demo Mode)',
        message: `Your mobile number ${fullPhone} has been verified via demo verification.`,
        time: 'Just now',
        unread: true
      },
      ...prev
    ]);
  };

  const handleOtpDigitChange = (index, value) => {
    // If pasted string
    if (value.length > 1) {
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      if (cleaned) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = cleaned[i] || '';
        }
        setOtpDigits(newDigits);
        setOtpError('');
        const focusIdx = Math.min(cleaned.length, 5);
        if (otpInputRefs.current[focusIdx]) {
          otpInputRefs.current[focusIdx].focus();
        }
        return;
      }
    }

    const digit = value.slice(-1).replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setOtpError('');

    if (digit && index < 5) {
      if (otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      if (otpInputRefs.current[index - 1]) {
        otpInputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    const rawNumber = (verificationPhone || candidate.phone || '').trim();
    const fullPhone = rawNumber.startsWith('+') 
      ? rawNumber 
      : `${verificationCountryCode}${rawNumber.replace(/^\+/, '')}`;

    setIsSubmittingOtp(true);
    setOtpError('');

    try {
      const res = await api.post('/verification/verify-code', {
        phone: fullPhone,
        code: entered
      });

      if (res.data?.success) {
        setIsPhoneVerified(true);
        setVerifiedPhone(fullPhone);
        setCandidate(prev => ({ ...prev, phone: fullPhone }));
        setVerificationStep('verified');

        try {
          localStorage.setItem('workzo_candidate_phone_verified', 'true');
          localStorage.setItem('workzo_candidate_verified_phone', fullPhone);
        } catch (_) {}

        showToast('Mobile number verified successfully (Demo Mode)!');

        setNotifications(prev => [
          {
            id: Date.now(),
            title: 'Mobile Number Verified ✓ (Demo Mode)',
            message: `Your mobile number ${fullPhone} has been verified successfully.`,
            time: 'Just now',
            unread: true
          },
          ...prev
        ]);
      } else {
        setOtpError(res.data?.message || 'Invalid verification code. Please check and try again.');
      }
    } catch (err) {
      console.warn('Backend verification error, checking demo code fallback:', err);
      // Demo fallback check
      if (entered === '123456' || entered === activeOtpCode) {
        setIsPhoneVerified(true);
        setVerifiedPhone(fullPhone);
        setCandidate(prev => ({ ...prev, phone: fullPhone }));
        setVerificationStep('verified');

        try {
          localStorage.setItem('workzo_candidate_phone_verified', 'true');
          localStorage.setItem('workzo_candidate_verified_phone', fullPhone);
        } catch (_) {}

        showToast('Mobile number verified successfully (Demo Mode)!');
      } else {
        setOtpError(err.response?.data?.message || 'Invalid code. In Demo Mode, please use 123456.');
      }
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  const handleStartChangeNumber = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Update Mobile Number',
      message: 'Updating your mobile number will reset verification status. Do you want to proceed?',
      confirmText: 'Change Number',
      onConfirm: () => {
        setIsPhoneVerified(false);
        setVerificationStep('input');
        setOtpDigits(['', '', '', '', '', '']);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Apply to Job Handler
  const handleApplyToJob = (job) => {
    if (applications.some(a => String(a.jobId) === String(job.id))) {
      showToast('You have already applied to this job.');
      return;
    }
    const newApp = {
      id: Date.now(),
      jobId: job.id,
      company: job.company,
      role: job.title,
      appliedDate: 'Today',
      status: 'Applied',
      statusType: 'neutral'
    };
    setApplications(prev => {
      const updated = [newApp, ...prev];
      try {
        localStorage.setItem('workzo_candidate_applications', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast(`Application submitted for ${job.title} at ${job.company}!`);
  };

  // Withdraw / Delete Application Handler
  const handleWithdrawApplication = (appId) => {
    const target = applications.find(a => String(a.id) === String(appId));
    const roleDesc = target ? `for "${target.role}" at ${target.company}` : '';
    setConfirmModal({
      isOpen: true,
      title: 'Withdraw Application',
      message: `Are you sure you want to withdraw and delete your application ${roleDesc}?`,
      confirmText: 'Withdraw Application',
      onConfirm: () => {
        setApplications(prev => {
          const updated = prev.filter(a => String(a.id) !== String(appId));
          try {
            localStorage.setItem('workzo_candidate_applications', JSON.stringify(updated));
          } catch (_) {}
          return updated;
        });
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showToast('Application withdrawn successfully.');
      }
    });
  };

  // Save / Bookmark Job Handler
  const handleToggleSaveJob = (job) => {
    const isSaved = savedJobs.some(j => String(j.id) === String(job.id));
    if (isSaved) {
      setSavedJobs(prev => {
        const updated = prev.filter(j => String(j.id) !== String(job.id));
        try {
          localStorage.setItem('workzo_candidate_saved_jobs', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      showToast(`Removed "${job.title}" from saved jobs.`);
    } else {
      setSavedJobs(prev => {
        const updated = [...prev, job];
        try {
          localStorage.setItem('workzo_candidate_saved_jobs', JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
      showToast(`Saved "${job.title}" to bookmarked jobs.`);
    }
  };

  // Responsive viewport resize listener
  useEffect(() => {
    let prevWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const mobile = currentWidth < 1024;
      setIsMobile(mobile);
      if (prevWidth >= 1024 && currentWidth < 1024) {
        setSidebarOpen(false);
      } else if (prevWidth < 1024 && currentWidth >= 1024) {
        setSidebarOpen(true);
      }
      prevWidth = currentWidth;
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile, sidebarOpen]);

  // Drag-to-resize logic for desktop sidebar
  const isDraggingRef = useRef(false);

  const startDragging = (e) => {
    if (isMobile) return;
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current || isMobile) return;
      const newWidth = Math.max(200, Math.min(e.clientX, 450));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  // Structured Sidebar Hierarchy
  const navSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'find-jobs', label: 'Find Jobs', icon: Search },
        { id: 'applications', label: 'My Applications', icon: Briefcase, count: applications.length },
        { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark, count: savedJobs.length },
      ]
    },
    {
      title: 'CAREER',
      items: [
        { id: 'interviews', label: 'Interviews', icon: Calendar, badge: interviews.length > 0 ? `${interviews.length} Scheduled` : undefined },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'resume', label: 'My Resume', icon: FileText },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { 
          id: 'verification', 
          label: 'Verification', 
          icon: ShieldCheck, 
          badge: isPhoneVerified ? 'Verified ✓' : 'Verify Mobile',
          badgeType: isPhoneVerified ? 'success' : 'warning'
        },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => n.unread).length },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827] flex font-sans overflow-x-hidden">
      
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && isMobile && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 transition-opacity"
          aria-label="Close menu backdrop"
        />
      )}

      {/* 1. Grouped Sidebar Hierarchy with Draggable Handle */}
      {sidebarOpen && (
        <aside 
          style={isMobile ? undefined : { width: `${sidebarWidth}px` }}
          className={`bg-white border-r border-[#E5E7EB] flex flex-col justify-between select-none ${
            isMobile 
              ? 'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl' 
              : 'sticky top-0 h-screen shrink-0 z-30 transition-[width] duration-75 relative shadow-xs'
          }`}
        >
          {/* Draggable Resize Handle (Desktop Only) */}
          {!isMobile && (
            <div
              onMouseDown={startDragging}
              title="Drag to resize sidebar"
              className="absolute top-0 -right-2.5 w-5 h-full cursor-col-resize z-40 flex items-center justify-center group"
            >
              <div className={`w-1.5 h-16 rounded-full transition-all duration-200 flex items-center justify-center ${
                isDragging 
                  ? 'bg-orange-600 scale-y-125 shadow-sm' 
                  : 'bg-slate-300 group-hover:bg-orange-500 group-hover:scale-y-110'
              }`}>
                <GripVertical className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}

          <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* WORKZO Brand Header */}
            <div className="h-18 px-5 flex items-center justify-between border-b border-[#E5E7EB] shrink-0">
              <Link 
                to="/" 
                className="flex items-center gap-2 min-w-0"
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <img 
                  src="/workzo-logo.png" 
                  alt="WORKZO" 
                  className="h-9 sm:h-10 w-auto object-contain shrink-0"
                />
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                title={isMobile ? "Close menu" : "Collapse sidebar"}
                className="p-1.5 text-[#71717A] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                {isMobile ? <X className="w-5 h-5 text-slate-700" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
            </div>

            {/* Visual Grouped Hierarchy */}
            <div className="p-3.5 space-y-5 flex-1">
              {navSections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    {section.title}
                  </p>

                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          if (isMobile) setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-orange-50 text-orange-600 border border-orange-200/80 shadow-2xs font-bold'
                            : 'text-[#4B5563] hover:text-[#111827] hover:bg-slate-100/80 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-orange-600' : 'text-[#71717A]'}`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.count !== undefined && item.count > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                            isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-[#71717A]'
                          }`}>
                            {item.count}
                          </span>
                        )}

                        {item.badge && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            item.badgeType === 'warning'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200/70 font-bold'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-bold'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Bottom Separator & Logout */}
            <div className="p-3.5 border-t border-[#E5E7EB] bg-[#FAFAF9]/80 shrink-0">
              <button 
                onClick={() => {
                  if (isMobile) setSidebarOpen(false);
                  localStorage.removeItem('workzo_token');
                  localStorage.removeItem('workzo_user');
                  navigate('/login');
                }}
                title="Sign out"
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#71717A] hover:text-orange-600 hover:bg-white rounded-xl border border-transparent hover:border-[#E5E7EB] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <LogOut className="w-4 h-4 text-[#71717A] shrink-0" />
                  <span>Logout</span>
                </div>
                <span className="text-[11px] text-[#A1A1AA]">Sign out</span>
              </button>
            </div>

          </div>
        </aside>
      )}

      {/* 2. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar with Menu Icon Toggle */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] h-18 px-4 sm:px-6 md:px-8 flex items-center justify-between shadow-3xs gap-2 sm:gap-4">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Menu Button - only visible when sidebar is collapsed/closed */}
            {!sidebarOpen && (
              <>
                <button 
                  onClick={() => setSidebarOpen(true)}
                  title="Open menu"
                  className="p-2 rounded-xl text-[#71717A] hover:text-[#111827] hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2 border border-[#E5E7EB] shrink-0"
                >
                  <Menu className="w-5 h-5 text-orange-600" />
                  <span className="hidden sm:inline text-xs font-bold text-[#111827]">
                    Menu
                  </span>
                </button>

                <Link to="/" className="flex items-center gap-1.5 shrink-0">
                  <img src="/workzo-logo.png" alt="WORKZO" className="h-7 sm:h-8 w-auto object-contain" />
                </Link>
              </>
            )}

            <h1 className="text-sm sm:text-base md:text-lg font-bold text-[#111827] capitalize ml-0.5 sm:ml-1 truncate">
              {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#71717A] hover:text-[#111827] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-600" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                    <p className="text-xs font-bold text-[#111827]">Notifications</p>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, unread: false })));
                        setNotificationsOpen(false);
                      }}
                      className="text-[10px] text-orange-600 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2 bg-slate-50 rounded-lg text-[#71717A] text-[11px]">
                        <p className="font-bold text-[#111827]">{n.title}</p>
                        <p className="mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-[#A1A1AA]">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Click to Profile */}
            <button 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 sm:gap-2.5 pl-2 border-l border-[#E5E7EB] cursor-pointer group"
              title="View & Edit Profile"
            >
              {candidate.avatar ? (
                <img 
                  src={candidate.avatar} 
                  alt={candidate.name || 'User'} 
                  className="w-8 h-8 rounded-full object-cover border border-orange-300 shadow-xs ring-2 ring-orange-100 shrink-0" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center text-xs shadow-xs shrink-0">
                  {getInitials(candidate.name)}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-bold text-[#111827] max-w-[120px] truncate group-hover:text-orange-600 transition-colors">
                {candidate.name || 'My Profile'}
              </span>
            </button>
          </div>
        </header>

        {/* Global Toast Success Banner */}
        {toastMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg('')} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3. Dynamic Section Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          
          {/* TAB: DASHBOARD (Overview) */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    Welcome back, {candidate.name || 'Job Seeker'} 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                    {candidate.headline || 'Your personal recruitment portal and job application tracker.'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#71717A]">Profile {profileCompletePercent}% complete</span>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletePercent}%` }}
                    />
                  </div>
                  {profileCompletePercent < 100 && (
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="text-xs font-semibold text-orange-600 hover:underline"
                    >
                      Complete →
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div 
                  onClick={() => setActiveTab('applications')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">Applied Jobs</p>
                  <p className="text-2xl font-bold text-[#111827] mt-1">{applications.length}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">Submitted applications</p>
                </div>

                <div 
                  onClick={() => setActiveTab('applications')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">In Review</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {applications.filter(a => a.status === 'Under Review' || a.status === 'Applied').length}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">Pending employer feedback</p>
                </div>

                <div 
                  onClick={() => setActiveTab('interviews')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">Interviews</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{interviews.length}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">
                    {interviews.length > 0 ? 'Upcoming interviews' : 'No upcoming interviews'}
                  </p>
                </div>
              </div>

              {/* Next Interview Banner (Shown only when interviews exist) */}
              {interviews.length > 0 ? (
                <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Upcoming Interview</span>
                      <h3 className="text-sm font-bold text-[#111827] mt-0.5">{interviews[0].role} • {interviews[0].company || 'WorkZo Partner'}</h3>
                      <p className="text-xs text-[#71717A] mt-0.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        <span>{interviews[0].date}</span>
                      </p>
                      {interviews[0].link && (
                        <p className="text-[11px] text-slate-500 font-mono mt-1 truncate max-w-xs">
                          {interviews[0].link}
                        </p>
                      )}
                    </div>
                  </div>
                  {interviews[0].link ? (
                    <a 
                      href={interviews[0].link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="workzo-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting</span>
                    </a>
                  ) : (
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-4 py-2 rounded-xl">
                      Meeting Link Pending
                    </span>
                  )}
                </div>
              ) : (
                <div className="bg-gradient-to-r from-orange-50/50 to-white p-5 rounded-2xl border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">Looking to land your next interview?</h3>
                      <p className="text-xs text-[#71717A] mt-0.5">Keep your profile updated and apply directly to verified openings in Find Jobs.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('find-jobs')}
                    className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Browse Openings
                  </button>
                </div>
              )}

              {/* Active Applications Section */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#111827]">Active Job Applications</h3>
                  {applications.length > 0 && (
                    <button onClick={() => setActiveTab('applications')} className="text-xs font-semibold text-orange-600 hover:underline">
                      View all ({applications.length}) →
                    </button>
                  )}
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-8 border border-dashed border-[#E5E7EB] rounded-2xl">
                    <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-[#111827]">No applications submitted yet</p>
                    <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                      Explore active openings from verified employers and track your applications here.
                    </p>
                    <button 
                      onClick={() => setActiveTab('find-jobs')}
                      className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold mt-3 cursor-pointer"
                    >
                      Find Jobs
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E5E7EB]">
                    {applications.slice(0, 3).map((app) => (
                      <div key={app.id} className="py-3 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#111827]">{app.role}</p>
                          <p className="text-xs text-[#71717A]">{app.company} • Applied {app.appliedDate}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {app.status}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleWithdrawApplication(app.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Withdraw application"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* TAB: FIND JOBS (Search, Filter, Browse, View, Apply, Save) */}
          {activeTab === 'find-jobs' && (
            <div className="space-y-4">
              <JobSearchComponent 
                isDashboardEmbedded={true}
                appliedJobIds={applications.map(a => a.jobId)}
                savedJobIds={savedJobs.map(j => j.id)}
                onApply={(job) => {
                  handleApplyToJob(job);
                }}
                onSave={(job) => {
                  handleToggleSaveJob(job);
                }}
              />
            </div>
          )}

          {/* TAB: MY APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Submitted Applications ({applications.length})</h2>

              {applications.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#E5E7EB] rounded-2xl">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#111827]">No Applications Submitted Yet</p>
                  <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                    When you apply to jobs, your real-time application status will be tracked here.
                  </p>
                  <button onClick={() => setActiveTab('find-jobs')} className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold mt-3 cursor-pointer">
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E5E7EB]">
                  {applications.map((app) => (
                    <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-[#111827]">{app.role}</h3>
                        <p className="text-xs text-[#71717A] mt-0.5">{app.company} • Applied on {app.appliedDate}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {app.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWithdrawApplication(app.id);
                          }}
                          className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                          title="Withdraw and delete this application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Withdraw</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SAVED JOBS */}
          {activeTab === 'saved-jobs' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Bookmarked Jobs ({savedJobs.length})</h2>
              {savedJobs.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#E5E7EB] rounded-2xl">
                  <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#111827]">No Saved Jobs</p>
                  <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                    Click the bookmark icon on any job in the Find Jobs tab to save it for later review.
                  </p>
                  <button onClick={() => setActiveTab('find-jobs')} className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold mt-3 cursor-pointer">
                    Find Jobs to Save
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedJobs.map((job) => (
                    <div key={job.id} className="p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">{job.title}</h3>
                        <p className="text-xs text-[#71717A]">{job.company} • {job.location} • {job.salary}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleApplyToJob(job)} 
                          className="workzo-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Apply
                        </button>
                        <button 
                          onClick={() => handleToggleSaveJob(job)} 
                          className="text-xs text-red-600 hover:bg-red-50 p-1.5 rounded-lg cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: INTERVIEWS */}
          {activeTab === 'interviews' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Candidate Interviews ({interviews.length})</h2>
              {interviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#E5E7EB] rounded-2xl">
                  <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#111827]">No Interviews Scheduled</p>
                  <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                    When an employer reviews your submitted application and schedules an interview, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {interviews.map(i => (
                    <div key={i.id} className="p-4 rounded-xl border border-orange-200 bg-orange-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                            Google Meet Call
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            {i.status || 'Confirmed'}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#111827] mt-1">{i.role} • {i.company || 'Employer Interview'}</h3>
                        <p className="text-xs text-[#71717A] mt-0.5 flex items-center gap-1.5 flex-wrap">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          <span>{i.date}</span>
                          <span>•</span>
                          <span>{i.type}</span>
                          {i.interviewer && (
                            <>
                              <span>•</span>
                              <span>Interviewer: <strong>{i.interviewer}</strong></span>
                            </>
                          )}
                        </p>
                        {i.link && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <a 
                              href={i.link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs font-mono text-orange-600 hover:underline bg-white px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1"
                            >
                              <Video className="w-3 h-3 text-orange-600" />
                              <span className="truncate max-w-[200px] sm:max-w-xs">{i.link}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                            <button
                              onClick={() => handleCopyMeetLink(i.link, i.id)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Copy Google Meet Link"
                            >
                              {copiedMeetId === i.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {i.link ? (
                          <a 
                            href={i.link} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Meeting</span>
                          </a>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">
                            Link Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: MY PROFILE (Interactive Editable Profile) */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Personal & Professional Profile</h2>
                  <p className="text-xs text-[#71717A] mt-0.5">Edit your candidate details, bio, skills, and contact info.</p>
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="workzo-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-auto"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>

              {/* Hidden File Inputs for Profile Photo & Resume */}
              <input 
                type="file" 
                ref={avatarInputRef} 
                onChange={handleAvatarUpload} 
                accept="image/png,image/jpeg,image/webp,image/jpg" 
                className="hidden" 
              />
              <input 
                type="file" 
                ref={resumeInputRef} 
                onChange={handleResumeUpload} 
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                className="hidden" 
              />

              {/* Profile Card Header with Photo Uploader */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-[#E5E7EB]">
                <div className="flex items-center gap-4">
                  {/* Avatar with Camera Overlay Trigger */}
                  <div className="relative group shrink-0">
                    {candidate.avatar ? (
                      <img 
                        src={candidate.avatar} 
                        alt={candidate.name || 'Candidate'} 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-200 shadow-xs" 
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-orange-600 text-white font-bold flex items-center justify-center text-2xl shadow-xs">
                        {getInitials(candidate.name)}
                      </div>
                    )}

                    {/* Camera icon badge */}
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      title="Upload new profile photo"
                      className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#111827] hover:bg-black text-white shadow-md transition-all cursor-pointer group-hover:scale-105 border border-white"
                    >
                      {isUploadingAvatar ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                      ) : (
                        <Camera className="w-3.5 h-3.5 text-orange-400" />
                      )}
                    </button>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#111827] truncate">
                        {candidate.name || 'Candidate Name'}
                      </h3>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-100/70 border border-orange-200/60 px-2 py-0.5 rounded-full shrink-0">
                        Job Seeker
                      </span>
                    </div>
                    <p className="text-xs text-[#71717A] truncate mt-0.5">
                      {candidate.headline || 'No professional headline set'}
                    </p>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">{candidate.email}</p>
                  </div>
                </div>

                {/* Avatar Action Buttons */}
                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    type="button"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 text-[#111827] border border-[#E5E7EB] rounded-xl text-xs font-semibold cursor-pointer shadow-3xs flex items-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-600" />
                    <span>{isUploadingAvatar ? 'Uploading...' : candidate.avatar ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>

                  {candidate.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploadingAvatar}
                      className="p-2 text-[#71717A] hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                      title="Remove profile image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                
                {/* 1. Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Full Name *</label>
                    <input 
                      type="text" 
                      required
                      value={candidate.name}
                      onChange={(e) => setCandidate({ ...candidate, name: e.target.value })}
                      placeholder="e.g. Alex Rivera"
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Professional Headline</label>
                    <input 
                      type="text" 
                      value={candidate.headline}
                      onChange={(e) => setCandidate({ ...candidate, headline: e.target.value })}
                      placeholder="e.g. Senior Frontend Engineer | React & TypeScript"
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Email Address (Login Account)</label>
                    <input 
                      type="email" 
                      readOnly
                      value={candidate.email}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm bg-slate-50 text-[#71717A] cursor-not-allowed" 
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-semibold text-[#111827]">Phone Number</label>
                      {isPhoneVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified ✓
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            if (candidate.phone) setVerificationPhone(candidate.phone);
                            setVerificationStep('input');
                            setActiveTab('verification');
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 px-2 py-0.5 rounded-full cursor-pointer transition-colors"
                        >
                          <AlertCircle className="w-3 h-3" />
                          Verify Mobile →
                        </button>
                      )}
                    </div>
                    <input 
                      type="tel" 
                      value={candidate.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCandidate({ ...candidate, phone: val });
                        if (isPhoneVerified && val !== verifiedPhone) {
                          setIsPhoneVerified(false);
                        }
                      }}
                      placeholder="e.g. +1 (555) 234-5678"
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold mb-1 text-[#111827]">Current Location / City</label>
                    <input 
                      type="text" 
                      value={candidate.location}
                      onChange={(e) => setCandidate({ ...candidate, location: e.target.value })}
                      placeholder="e.g. San Francisco, CA or Remote"
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                </div>

                {/* 2. Bio / Summary */}
                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">About Me / Bio</label>
                  <textarea 
                    rows={3}
                    value={candidate.bio}
                    onChange={(e) => setCandidate({ ...candidate, bio: e.target.value })}
                    placeholder="Brief summary of your career background, passions, and ideal role..."
                    className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500"
                  />
                </div>

                {/* 3. Interactive Skills Manager */}
                <div className="space-y-2 pt-2">
                  <label className="block font-semibold text-[#111827]">Skills & Technologies</label>
                  
                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-2 min-h-8">
                    {candidate.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-800 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>{skill}</span>
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-red-600 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {candidate.skills.length === 0 && (
                      <span className="text-xs text-[#A1A1AA] italic">No skills added yet. Add your key skills below.</span>
                    )}
                  </div>

                  {/* Add Skill Input */}
                  <div className="flex items-center gap-2 max-w-md pt-1">
                    <input 
                      type="text" 
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Type a skill (e.g. React, Node.js) and press Enter"
                      className="flex-1 p-2 rounded-xl border border-[#E5E7EB] text-xs outline-none focus:border-orange-500"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddSkill}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-xl cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* 4. Candidate Resume Document & Portfolio */}
                <div className="pt-2 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block font-semibold text-[#111827]">
                        Resume Document (PDF, DOC, DOCX)
                      </label>
                      {candidate.resume_url && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                          Uploaded & Verified ✓
                        </span>
                      )}
                    </div>

                    {candidate.resume_url ? (
                      <div className="p-4 rounded-xl border border-[#E5E7EB] bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-[#111827] truncate">
                              {resumeMeta.filename || 'Candidate_Resume.pdf'}
                            </p>
                            <p className="text-[11px] text-[#71717A] mt-0.5">
                              {resumeMeta.size || 'Verified Document'} • Updated {resumeMeta.updatedAt || 'Recently'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                          <a 
                            href={candidate.resume_url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#111827] border border-[#E5E7EB] rounded-lg text-xs font-semibold cursor-pointer shadow-3xs flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                            <span>View</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => resumeInputRef.current?.click()}
                            disabled={isUploadingResume}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-[#111827] border border-[#E5E7EB] rounded-lg text-xs font-semibold cursor-pointer shadow-3xs flex items-center gap-1.5 transition-colors"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 text-[#71717A] ${isUploadingResume ? 'animate-spin' : ''}`} />
                            <span>{isUploadingResume ? 'Uploading...' : 'Replace'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleRemoveResume}
                            disabled={isUploadingResume}
                            className="p-1.5 text-[#71717A] hover:text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                            title="Remove resume"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => resumeInputRef.current?.click()}
                        className="p-4 rounded-xl border border-dashed border-[#E5E7EB] hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20 transition-all cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-orange-100/70 text-orange-600 flex items-center justify-center shrink-0">
                            <Upload className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#111827]">
                              {isUploadingResume ? 'Uploading document...' : 'Upload your resume document'}
                            </p>
                            <p className="text-[11px] text-[#71717A]">
                              Supports PDF, DOC, DOCX up to 15MB.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          disabled={isUploadingResume}
                          className="px-3.5 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5"
                        >
                          {isUploadingResume ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400" />
                          ) : (
                            <FileUp className="w-3.5 h-3.5 text-orange-400" />
                          )}
                          <span>{isUploadingResume ? 'Uploading...' : 'Choose File'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">
                      External Portfolio / Cloud Link (Optional)
                    </label>
                    <input 
                      type="url" 
                      value={candidate.resume_url.startsWith('http://localhost') ? '' : candidate.resume_url}
                      onChange={(e) => setCandidate({ ...candidate, resume_url: e.target.value })}
                      placeholder="https://portfolio.yourname.com or Google Drive link"
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                </div>

                {/* Bottom Save Action */}
                <div className="pt-4 flex justify-end">
                  <button 
                    type="submit"
                    disabled={isSavingProfile}
                    className="workzo-btn-primary px-7 py-3 rounded-xl text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB: MY RESUME */}
          {activeTab === 'resume' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Resume & Career Documents</h2>
                  <p className="text-xs text-[#71717A] mt-0.5">
                    Manage the resume employers see when reviewing your applications.
                  </p>
                </div>

                <button
                  onClick={() => resumeInputRef.current?.click()}
                  disabled={isUploadingResume}
                  className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
                >
                  {isUploadingResume ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{candidate.resume_url ? 'Replace Resume' : 'Upload Resume File'}</span>
                </button>
              </div>

              {candidate.resume_url ? (
                <div className="space-y-4">
                  {/* Active Resume Card */}
                  <div className="p-6 border border-[#E5E7EB] bg-slate-50/70 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-3xs">
                        <FileText className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#111827]">
                            {resumeMeta.filename || 'Candidate_Resume.pdf'}
                          </h3>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            Active Document ✓
                          </span>
                        </div>
                        <p className="text-xs text-[#71717A]">
                          {resumeMeta.size || 'PDF Document'} • Uploaded {resumeMeta.updatedAt || 'Recently'}
                        </p>
                        <p className="text-xs text-[#A1A1AA] truncate max-w-lg">
                          URL: {candidate.resume_url}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                      <a 
                        href={candidate.resume_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </a>

                      <a 
                        href={candidate.resume_url}
                        download
                        className="px-3.5 py-2 bg-white hover:bg-slate-100 text-[#111827] border border-[#E5E7EB] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-3xs transition-colors"
                      >
                        <Download className="w-3.5 h-3.5 text-[#71717A]" />
                        <span>Download</span>
                      </a>

                      <button
                        onClick={handleRemoveResume}
                        className="p-2 text-[#71717A] hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                        title="Delete resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Candidate Best Practices Card */}
                  <div className="p-4 rounded-xl border border-orange-200/70 bg-orange-50/30 flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-[#71717A]">
                      <p className="font-bold text-[#111827]">Employer Application Integration</p>
                      <p className="mt-0.5">
                        This document is automatically linked when you submit applications to verified employers on WORKZO. Keep it concise, highlighting relevant technologies and metrics.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Upload Dropzone */}
                  <div 
                    onClick={() => resumeInputRef.current?.click()}
                    className="p-12 border-2 border-dashed border-[#E5E7EB] hover:border-orange-400 bg-slate-50/50 hover:bg-orange-50/20 rounded-2xl text-center space-y-3 cursor-pointer transition-all group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform shadow-3xs">
                      {isUploadingResume ? (
                        <Loader2 className="w-7 h-7 animate-spin" />
                      ) : (
                        <Upload className="w-7 h-7" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">
                        {isUploadingResume ? 'Uploading resume document...' : 'Upload your Candidate Resume / CV'}
                      </h3>
                      <p className="text-xs text-[#71717A] mt-1 max-w-sm mx-auto">
                        Supports PDF, DOC, DOCX up to 15MB. Verified recruiters review this file during applicant screening.
                      </p>
                    </div>
                    <button 
                      type="button"
                      disabled={isUploadingResume}
                      className="workzo-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs inline-flex items-center gap-2"
                    >
                      <FileUp className="w-4 h-4" />
                      <span>{isUploadingResume ? 'Uploading...' : 'Select File from Computer'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: VERIFICATION & SECURITY CENTER */}
          {activeTab === 'verification' && (
            <div className="space-y-6">
              {/* Header Card */}
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
                        <ShieldCheck className="w-5 h-5" />
                      </span>
                      <h2 className="text-lg sm:text-xl font-bold text-[#111827]">Candidate Verification & Trust Center</h2>
                    </div>
                    <p className="text-xs text-[#71717A] mt-1.5 max-w-xl">
                      Verify your mobile number and credentials to earn the <span className="text-orange-600 font-semibold">Verified Candidate Badge</span>. Verified profiles receive 3x more interview invitations and priority review.
                    </p>
                  </div>

                  {/* Trust Score Card */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-[#E5E7EB] rounded-xl shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider">Account Trust Level</p>
                      <p className="text-sm font-bold text-[#111827]">
                        {isPhoneVerified ? '100% High Trust' : '70% Standard'}
                      </p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isPhoneVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isPhoneVerified ? '100%' : '70%'}
                    </div>
                  </div>
                </div>

                {/* Status Badges Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-[#E5E7EB]">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs font-semibold text-[#111827] truncate">Email Address</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full shrink-0">
                      Verified ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 truncate">
                      <Smartphone className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="text-xs font-semibold text-[#111827] truncate">Mobile Number</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isPhoneVerified 
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                        : 'text-amber-800 bg-amber-50 border border-amber-200/70'
                    }`}>
                      {isPhoneVerified ? 'Verified ✓' : 'Action Required'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-[#E5E7EB]">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="text-xs font-semibold text-[#111827] truncate">Candidate Resume</span>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      candidate.resume_url
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                        : 'text-slate-600 bg-slate-100'
                    }`}>
                      {candidate.resume_url ? 'Attached ✓' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. PRIMARY DEDICATED SECTION: MOBILE NUMBER VERIFICATION */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs overflow-hidden">
                <div className="p-6 border-b border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      isPhoneVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-600'
                    }`}>
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-[#111827]">Mobile Number Verification</h3>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-blue-600" />
                          Demo Mode
                        </span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          isPhoneVerified
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60'
                            : 'text-amber-800 bg-amber-50 border border-amber-200/70'
                        }`}>
                          {isPhoneVerified ? 'Verified Active ✓' : 'Unverified'}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A] mt-0.5">
                        Demo verification active. Real-time carrier SMS dispatch can be integrated later via SMS gateway.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* CASE 1: ALREADY VERIFIED */}
                  {isPhoneVerified ? (
                    <div className="space-y-5">
                      <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Check className="w-6 h-6 stroke-[2.5]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                                Verified Mobile Number
                              </span>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded-md">
                                Demo Verified
                              </span>
                            </div>
                            <h4 className="text-lg font-bold text-[#111827] mt-0.5 tracking-wide">
                              {verifiedPhone || candidate.phone || '+1 (555) 234-5678'}
                            </h4>
                            <p className="text-xs text-emerald-800/80 mt-0.5 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Secured in Demo Mode • Real-time SMS can be connected later</span>
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleStartChangeNumber}
                          className="px-4 py-2 bg-white hover:bg-slate-50 text-[#111827] border border-[#E5E7EB] hover:border-slate-300 rounded-xl text-xs font-semibold cursor-pointer shadow-3xs transition-colors self-start sm:self-center"
                        >
                          Change Number / Re-test
                        </button>
                      </div>

                      {/* Verified Perks */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#111827]">Direct SMS Interview Alerts</p>
                            <p className="text-[#71717A] text-[11px] mt-0.5">Instant alerts when an employer accepts or requests an interview slot.</p>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl border border-[#E5E7EB] bg-slate-50/50 flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-[#111827]">Verified Candidate Badge on Applications</p>
                            <p className="text-[#71717A] text-[11px] mt-0.5">Employers see your verified phone badge next to your application name.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : verificationStep === 'input' ? (
                    /* CASE 2A: UNVERIFIED - STEP 1 (INPUT PHONE NUMBER) */
                    <form onSubmit={handleSendVerificationCode} className="space-y-5">
                      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-blue-900 leading-relaxed">
                          <p className="font-bold">Demo Verification Active</p>
                          <p className="mt-0.5 text-blue-800">
                            Enter any phone number below to test the verification experience. Standard demo passcode <strong>123456</strong> is enabled for instant testing without carrier SMS fees.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#111827]">
                          Mobile Phone Number *
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2.5">
                          {/* Country Code Select */}
                          <select
                            value={verificationCountryCode}
                            onChange={(e) => setVerificationCountryCode(e.target.value)}
                            className="p-2.5 sm:w-44 rounded-xl border border-[#E5E7EB] bg-white text-xs font-semibold text-[#111827] outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="+1">🇺🇸 US / CA (+1)</option>
                            <option value="+91">🇮🇳 India (+91)</option>
                            <option value="+44">🇬🇧 UK (+44)</option>
                            <option value="+61">🇦🇺 Australia (+61)</option>
                            <option value="+49">🇩🇪 Germany (+49)</option>
                            <option value="+65">🇸🇬 Singapore (+65)</option>
                            <option value="+971">🇦🇪 UAE (+971)</option>
                          </select>

                          {/* Phone Input */}
                          <div className="relative flex-1">
                            <input
                              type="tel"
                              required
                              value={verificationPhone}
                              onChange={(e) => {
                                setVerificationPhone(e.target.value);
                                setOtpError('');
                              }}
                              placeholder="e.g. 555-019-2831"
                              className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111827] outline-none focus:border-orange-500 pl-3 font-medium"
                            />
                          </div>

                          {/* Submit & Quick Demo Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              type="submit"
                              disabled={isSendingOtp}
                              className="workzo-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0 disabled:opacity-60"
                            >
                              {isSendingOtp ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Generating...</span>
                                </>
                              ) : (
                                <>
                                  <Send className="w-3.5 h-3.5" />
                                  <span>Send Demo Code</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={handleQuickDemoVerify}
                              disabled={isSubmittingOtp}
                              className="px-4 py-2.5 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                              title="Verify instantly in 1-click using Demo Mode"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              <span>⚡ Quick Verify</span>
                            </button>
                          </div>
                        </div>

                        {otpError && (
                          <p className="text-xs font-semibold text-red-600 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{otpError}</span>
                          </p>
                        )}
                        <p className="text-[11px] text-[#A1A1AA]">
                          Demo mode active • No actual SMS carrier charges will occur • Real-time SMS can be enabled later.
                        </p>
                      </div>
                    </form>
                  ) : (
                    /* CASE 2B: UNVERIFIED - STEP 2 (ENTER 6-DIGIT OTP) */
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      {/* Banner with Target Phone and Edit Action */}
                      <div className="p-4 rounded-xl bg-orange-50/70 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                            <KeyRound className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#111827]">
                              Enter Verification Code for {verificationCountryCode} {verificationPhone}
                            </p>
                            <p className="text-[11px] text-[#71717A] mt-0.5">
                              Use the demo passcode shown below or enter 123456.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setVerificationStep('input');
                            setOtpError('');
                          }}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline self-start sm:self-center cursor-pointer"
                        >
                          Change Number
                        </button>
                      </div>

                      {/* Demo Mode Code Callout with 1-Click Auto-Fill */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-3xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                            <Sparkles className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">Demo Passcode</span>
                              <span className="text-xs font-mono font-black text-blue-900 bg-white px-2 py-0.5 rounded-md border border-blue-200 shadow-2xs tracking-widest">
                                {activeOtpCode || '123456'}
                              </span>
                            </div>
                            <p className="text-[11px] text-blue-800/80 mt-0.5">
                              Click Auto-fill to load this demo code instantly into the fields.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAutoFillDemoOtp}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 self-start sm:self-center cursor-pointer transition-all active:scale-95 shrink-0"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>⚡ Auto-fill Code</span>
                        </button>
                      </div>

                      {/* 6 Digit Inputs */}
                      <div className="space-y-3">
                        <label className="block text-center text-xs font-bold uppercase tracking-wider text-[#111827]">
                          Enter 6-Digit Passcode
                        </label>
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => (otpInputRefs.current[idx] = el)}
                              type="text"
                              inputMode="numeric"
                              maxLength={6}
                              value={digit}
                              onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                              onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                              className="w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold rounded-xl border border-slate-300 bg-white text-[#111827] outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 shadow-3xs transition-all"
                            />
                          ))}
                        </div>

                        {otpError && (
                          <p className="text-center text-xs font-semibold text-red-600 flex items-center justify-center gap-1 mt-2">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{otpError}</span>
                          </p>
                        )}
                      </div>

                      {/* Resend and Submit Actions */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E7EB]">
                        <div>
                          {otpCountdown > 0 ? (
                            <p className="text-xs text-[#71717A] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-orange-600" />
                              <span>Resend demo code in <strong>{otpCountdown}s</strong></span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendVerificationCode}
                              disabled={isSendingOtp}
                              className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className={`w-3 h-3 ${isSendingOtp ? 'animate-spin' : ''}`} />
                              <span>Resend Demo Code</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setVerificationStep('input');
                              setOtpError('');
                            }}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-slate-100 text-xs font-semibold text-[#4B5563] cursor-pointer"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmittingOtp || otpDigits.join('').length < 6}
                            className="flex-1 sm:flex-initial workzo-btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                          >
                            {isSubmittingOtp ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-4 h-4" />
                                <span>Verify & Confirm (Demo)</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>

              {/* 2. SECONDARY SECTION: EMAIL & IDENTITY VERIFICATIONS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Verification Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#111827]">Account Email Address</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      Verified ✓
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#4B5563] truncate">{candidate.email}</p>
                  <p className="text-[11px] text-[#A1A1AA]">
                    Authenticated via WORKZO secure identity infrastructure.
                  </p>
                </div>

                {/* Identity / Government ID Verification Card */}
                <div className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-orange-600" />
                      </div>
                      <span className="text-xs font-bold text-[#111827]">Government ID / Passport</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-[#71717A]">
                    Upload passport, driving license, or national ID for a Gold Verified badge.
                  </p>
                  <button 
                    type="button"
                    onClick={() => showToast('Government ID submission portal is open. Optional document can be attached for Gold verification.')}
                    className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
                  >
                    Upload ID Proof (Optional) →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-[#111827]">Notifications Feed</h2>
              {notifications.map(n => (
                <div key={n.id} className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl text-xs">
                  <p className="font-bold text-[#111827]">{n.title}</p>
                  <p className="text-[#71717A] mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-[#A1A1AA]">{n.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Account Settings</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input type="text" readOnly value={candidate.email} className="w-full max-w-md p-2.5 bg-slate-50 rounded-xl border border-[#E5E7EB]" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Job Search Visibility</label>
                  <p className="text-[#71717A]">Your profile is visible to verified employers on WORKZO.</p>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-[#E5E7EB] bg-white py-5 px-8 text-xs text-[#71717A] flex items-center justify-between">
          <span>WORKZO Candidate Portal</span>
          <div className="flex items-center gap-4">
            <Link to="/dashboard/employer" className="hover:text-orange-600">Switch to Employer Portal</Link>
            <Link to="/" className="hover:text-orange-600">Home</Link>
          </div>
        </footer>

      </div>

      {/* Custom In-App Delete / Action Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-70 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-2">{confirmModal.title}</h3>
            <p className="text-sm text-[#71717A] leading-relaxed mb-6">{confirmModal.message}</p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4B5563] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirmModal.onConfirm) {
                    confirmModal.onConfirm();
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm cursor-pointer"
              >
                {confirmModal.confirmText || 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
