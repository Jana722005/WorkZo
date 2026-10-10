import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Users, 
  Calendar, 
  UserCheck, 
  Award, 
  Building2, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  PanelLeftClose, 
  GripVertical, 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  Download, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign, 
  Video, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Upload,
  Globe,
  Mail,
  Shield,
  Phone,
  AlertCircle,
  FileText,
  Copy,
  Check
} from 'lucide-react';

// Initial Seed Data (fallback when localStorage is empty)
const INITIAL_JOBS = [
  {
    id: 1,
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    salary: '$130k - $155k',
    status: 'Active',
    postedDate: 'Sep 24, 2026',
    description: 'Looking for a seasoned React & TypeScript engineer to lead our core client dashboard application.'
  },
  {
    id: 2,
    title: 'Lead Product Designer',
    department: 'Design',
    type: 'Full-time',
    location: 'San Francisco, CA',
    salary: '$125k - $150k',
    status: 'Active',
    postedDate: 'Sep 28, 2026',
    description: 'Design intuitive design systems, candidate journeys, and high-conversion enterprise interfaces.'
  },
  {
    id: 3,
    title: 'Backend Systems Architect',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    salary: '$145k - $175k',
    status: 'Active',
    postedDate: 'Oct 1, 2026',
    description: 'Architect scalable PostgreSQL and Node.js microservices handling millions of events daily.'
  },
  {
    id: 4,
    title: 'DevOps / Site Reliability Lead',
    department: 'Infrastructure',
    type: 'Contract',
    location: 'Remote',
    salary: '$90/hr - $110/hr',
    status: 'Paused',
    postedDate: 'Sep 15, 2026',
    description: 'Manage multi-region Kubernetes clusters, CI/CD pipelines, and infrastructure observability.'
  }
];

const INITIAL_APPLICANTS = [
  {
    id: 1,
    name: 'Alex Rivera',
    role: 'Senior Frontend Engineer',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 234-8901',
    location: 'San Francisco, CA (Open to Remote)',
    experience: '6 yrs',
    appliedDate: 'Oct 2, 2026',
    status: 'Interview Scheduled',
    stage: 'interview',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js', 'Redux Toolkit'],
    education: 'B.S. in Computer Science, UC Berkeley (2020)',
    bio: 'Frontend specialist with 6+ years of experience architecting resilient single-page applications, design systems, and responsive enterprise portals. Passionate about web performance and accessibility.',
    resumeName: 'Alex_Rivera_Senior_Frontend_Resume.pdf',
    resumeSize: '240 KB'
  },
  {
    id: 2,
    name: 'Sophia Patel',
    role: 'Lead Product Designer',
    email: 'sophia.patel@example.com',
    phone: '+1 (555) 782-4419',
    location: 'San Francisco, CA',
    experience: '7 yrs',
    appliedDate: 'Oct 1, 2026',
    status: 'Shortlisted',
    stage: 'shortlisted',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping', 'User Testing', 'Wireframing'],
    education: 'B.Des. in Interaction Design, RISD (2019)',
    bio: 'Lead product designer focused on creating intuitive, delightful user experiences for SaaS platforms. Led design system adoption across 14 cross-functional product teams.',
    resumeName: 'Sophia_Patel_Product_Design_Portfolio_Resume.pdf',
    resumeSize: '410 KB'
  },
  {
    id: 3,
    name: 'Marcus Brody',
    role: 'Backend Systems Architect',
    email: 'm.brody@example.com',
    phone: '+1 (555) 901-3321',
    location: 'Austin, TX (Remote)',
    experience: '8 yrs',
    appliedDate: 'Sep 30, 2026',
    status: 'In Review',
    stage: 'applied',
    skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'GraphQL', 'Kubernetes', 'Go'],
    education: 'M.S. in Software Engineering, UT Austin (2018)',
    bio: 'Distributed systems architect with 8 years building low-latency backend APIs and asynchronous stream processors handling over 50M daily events.',
    resumeName: 'Marcus_Brody_Backend_Architect_Resume.pdf',
    resumeSize: '315 KB'
  },
  {
    id: 4,
    name: 'Elena Rostova',
    role: 'DevOps / Site Reliability Lead',
    email: 'elena.r@example.com',
    phone: '+1 (555) 412-9908',
    location: 'Seattle, WA (Remote)',
    experience: '5 yrs',
    appliedDate: 'Sep 29, 2026',
    status: 'Hired',
    stage: 'hired',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Prometheus', 'Grafana', 'Docker'],
    education: 'B.S. in Information Systems, University of Washington (2021)',
    bio: 'DevOps engineer with 5 years managing cloud-native Kubernetes clusters, zero-downtime multi-region deployments, and comprehensive telemetry stacks.',
    resumeName: 'Elena_Rostova_DevOps_SRE_Resume.pdf',
    resumeSize: '290 KB',
    hiredDate: 'Oct 3, 2026',
    salaryAgreed: '$140,000 / yr'
  }
];

const INITIAL_INTERVIEWS = [];

export default function EmployerDashboard() {
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
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [editingJob, setEditingJob] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);
  const [viewingApplicant, setViewingApplicant] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [editingMeetInterview, setEditingMeetInterview] = useState(null);
  const [editMeetLinkValue, setEditMeetLinkValue] = useState('');

  // In-App Confirmation Modal State (Reliable across all browser environments)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    onConfirm: null
  });

  // Role Protection: Ensure a candidate account is routed to the candidate dashboard
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('workzo_user') || '{}');
      if (u.role === 'candidate') {
        navigate('/dashboard', { replace: true });
      }
    } catch (_) {}
  }, [navigate]);

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

  // Drag-to-resize sidebar logic (Desktop only)
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
      const newWidth = Math.max(210, Math.min(e.clientX, 450));
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

  // 1. Company Profile State
  const [company, setCompany] = useState({
    name: 'Veloce Labs',
    tagline: 'High-performance cloud infrastructure & distributed edge systems',
    industry: 'Software & Cloud Services',
    size: '50-150 employees',
    website: 'https://velocelabs.example.com',
    location: 'San Francisco, CA (Hybrid)',
    contactPerson: 'David Vance',
    contactEmail: 'recruiting@velocelabs.example.com',
    phone: '+1 (415) 555-0192',
    founded: '2021'
  });

  useEffect(() => {
    const fetchEmployerData = async () => {
      const token = localStorage.getItem('workzo_token');
      if (!token) return;
      try {
        const res = await api.get('/users/me');
        if (res.data?.company) {
          const c = res.data.company;
          setCompany(prev => ({
            ...prev,
            name: c.name || prev.name,
            tagline: c.tagline || prev.tagline,
            industry: c.industry || prev.industry,
            size: c.size || prev.size,
            website: c.website || prev.website,
            location: c.location || prev.location,
            contactPerson: c.contact_person || prev.contactPerson,
            contactEmail: c.contact_email || prev.contactEmail
          }));
        } else if (res.data?.profile) {
          const p = res.data.profile;
          setCompany(prev => ({
            ...prev,
            name: p.full_name || prev.name,
            contactEmail: p.email || prev.contactEmail
          }));
        }
      } catch (err) {
        console.warn('Could not load employer info:', err);
      }
    };
    fetchEmployerData();
  }, []);

  // 2. Posted Jobs State (Hydrated from localStorage with fallback)
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('workzo_employer_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not parse saved jobs from localStorage:', e);
    }
    return INITIAL_JOBS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('workzo_employer_jobs', JSON.stringify(jobs));
    } catch (e) {
      console.warn('Could not save jobs to localStorage:', e);
    }
  }, [jobs]);

  // 3. Candidates / Applicants State (Hydrated from localStorage with fallback)
  const [applicants, setApplicants] = useState(() => {
    try {
      const saved = localStorage.getItem('workzo_employer_applicants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not parse saved applicants from localStorage:', e);
    }
    return INITIAL_APPLICANTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('workzo_employer_applicants', JSON.stringify(applicants));
    } catch (e) {
      console.warn('Could not save applicants to localStorage:', e);
    }
  }, [applicants]);

  // Dynamic applicants count helper to ensure 100% data consistency
  const getJobApplicantsCount = (jobTitle) => {
    return applicants.filter(a => a.role.toLowerCase() === jobTitle.toLowerCase()).length;
  };

  // 4. Interviews State (Hydrated from localStorage with fallback)
  const [interviews, setInterviews] = useState(() => {
    try {
      const saved = localStorage.getItem('workzo_employer_interviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not parse saved interviews from localStorage:', e);
    }
    return INITIAL_INTERVIEWS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('workzo_employer_interviews', JSON.stringify(interviews));
    } catch (e) {
      console.warn('Could not save interviews to localStorage:', e);
    }
  }, [interviews]);

  // 5. Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Application Received',
      message: 'Alex Rivera submitted application for Senior Frontend Engineer.',
      time: '10 mins ago',
      unread: true,
      type: 'application'
    },
    {
      id: 2,
      title: 'Interview Confirmed',
      message: 'Sophia Patel accepted the calendar invitation for Design Portfolio Walkthrough.',
      time: '2 hours ago',
      unread: true,
      type: 'interview'
    },
    {
      id: 3,
      title: 'Job Posting Milestone',
      message: 'Your listing "Backend Systems Architect" reached 35 verified candidate views.',
      time: 'Yesterday',
      unread: false,
      type: 'system'
    }
  ]);

  // 6. Settings State
  const [settings, setSettings] = useState({
    emailAlerts: true,
    interviewReminders: true,
    weeklyDigest: false,
    publicListing: true,
    candidateDirectMessaging: true
  });

  // Post a Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote',
    salary: '',
    description: '',
    experience: '3+ years'
  });

  // Google Meet Helper: Generate standard 3-4-3 character meeting code (e.g. abc-defg-hij)
  const generateMeetCode = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const pick = (len) => Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${pick(3)}-${pick(4)}-${pick(3)}`;
  };

  // New Interview Form State
  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    role: '',
    date: '',
    time: '10:00 AM',
    type: 'Technical System Round',
    interviewer: 'David Vance',
    meetingLink: ''
  });

  const handleGenerateMeetLink = () => {
    const code = generateMeetCode();
    const link = `https://meet.google.com/${code}`;
    setNewInterview(prev => ({ ...prev, meetingLink: link }));
    showBanner('Google Meet link generated!');
  };

  const handleCopyLink = (link, id) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    showBanner('Google Meet link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenEditMeetLink = (interview) => {
    setEditingMeetInterview(interview);
    setEditMeetLinkValue(interview.link || `https://meet.google.com/${generateMeetCode()}`);
  };

  const handleSaveMeetLink = (e) => {
    e.preventDefault();
    if (!editingMeetInterview) return;
    let finalLink = editMeetLinkValue.trim();
    if (!finalLink.startsWith('http://') && !finalLink.startsWith('https://')) {
      finalLink = `https://${finalLink}`;
    }
    
    const updated = interviews.map(i => 
      i.id === editingMeetInterview.id ? { ...i, link: finalLink } : i
    );
    setInterviews(updated);

    try {
      localStorage.setItem('workzo_employer_interviews', JSON.stringify(updated));
      const cand = JSON.parse(localStorage.getItem('workzo_candidate_interviews') || '[]');
      const updatedCand = cand.map(i => i.id === editingMeetInterview.id ? { ...i, link: finalLink } : i);
      localStorage.setItem('workzo_candidate_interviews', JSON.stringify(updatedCand));
    } catch (_) {}

    setEditingMeetInterview(null);
    showBanner('Google Meet link updated successfully!');
  };

  const handleCancelInterview = (id) => {
    const updated = interviews.filter(i => i.id !== id);
    setInterviews(updated);
    try {
      localStorage.setItem('workzo_employer_interviews', JSON.stringify(updated));
      const cand = JSON.parse(localStorage.getItem('workzo_candidate_interviews') || '[]');
      const updatedCand = cand.filter(i => i.id !== id);
      localStorage.setItem('workzo_candidate_interviews', JSON.stringify(updatedCand));
    } catch (_) {}
    showBanner('Interview cancelled.');
  };

  const handlePostJob = (e) => {
    e.preventDefault();
    if (!newJob.title || !newJob.salary) return;
    const created = {
      id: Date.now(),
      title: newJob.title,
      department: newJob.department,
      type: newJob.type,
      location: newJob.location,
      salary: newJob.salary,
      applicantsCount: 0,
      status: 'Active',
      postedDate: 'Today',
      description: newJob.description || 'Join our innovative engineering team.'
    };
    setJobs([created, ...jobs]);
    setNewJob({ title: '', department: 'Engineering', type: 'Full-time', location: 'Remote', salary: '', description: '', experience: '3+ years' });
    showBanner('Job opening published successfully!');
    setActiveTab('my-jobs');
  };

  // Handle Application Actions: Shortlist, Schedule Meeting, Remove
  const handleToggleShortlist = (applicantId) => {
    setApplicants(prev => prev.map(app => {
      if (app.id === applicantId) {
        const nextStage = app.stage === 'shortlisted' ? 'applied' : 'shortlisted';
        const nextStatus = nextStage === 'shortlisted' ? 'Shortlisted' : 'In Review';
        const updated = { ...app, stage: nextStage, status: nextStatus };
        if (viewingApplicant && viewingApplicant.id === applicantId) {
          setViewingApplicant(updated);
        }
        showBanner(nextStage === 'shortlisted' ? `${app.name} has been shortlisted!` : `${app.name} returned to In Review.`);
        return updated;
      }
      return app;
    }));
  };

  const handleOpenScheduleForApplicant = (applicant) => {
    setScheduleCandidate(applicant);
    const code = generateMeetCode();
    setNewInterview({
      candidateName: applicant.name,
      role: applicant.role,
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM',
      type: 'Technical System Round',
      interviewer: 'David Vance',
      meetingLink: `https://meet.google.com/${code}`
    });
    setScheduleModalOpen(true);
  };

  const handleRemoveApplicant = (applicantId) => {
    const target = applicants.find(a => String(a.id) === String(applicantId));
    const name = target ? target.name : 'this candidate';
    const role = target ? `for "${target.role}"` : '';
    setConfirmModal({
      isOpen: true,
      title: 'Remove Candidate Application',
      message: `Are you sure you want to remove ${name}'s application ${role}? This action will permanently remove the application from your pipeline.`,
      confirmText: 'Remove Application',
      onConfirm: () => {
        setApplicants(prev => {
          const updated = prev.filter(a => String(a.id) !== String(applicantId));
          try {
            localStorage.setItem('workzo_employer_applicants', JSON.stringify(updated));
          } catch (e) { /* ignore */ }
          return updated;
        });
        if (target) {
          setInterviews(prev => {
            const updated = prev.filter(i => i.candidateName.toLowerCase() !== target.name.toLowerCase());
            try {
              localStorage.setItem('workzo_employer_interviews', JSON.stringify(updated));
            } catch (e) { /* ignore */ }
            return updated;
          });
        }
        if (viewingApplicant && String(viewingApplicant.id) === String(applicantId)) {
          setViewingApplicant(null);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showBanner(`Application for ${name} has been removed.`);
      }
    });
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!newInterview.candidateName) return;

    let finalLink = (newInterview.meetingLink || '').trim();
    if (!finalLink) {
      finalLink = `https://meet.google.com/${generateMeetCode()}`;
    } else if (!finalLink.startsWith('http://') && !finalLink.startsWith('https://')) {
      finalLink = `https://${finalLink}`;
    }

    const created = {
      id: Date.now(),
      candidateName: newInterview.candidateName,
      role: newInterview.role || 'Senior Frontend Engineer',
      date: `${newInterview.date || 'Oct 8, 2026'} • ${newInterview.time}`,
      type: newInterview.type || 'Technical System Round',
      interviewer: newInterview.interviewer || 'David Vance',
      link: finalLink,
      status: 'Confirmed'
    };

    const updatedInterviews = [created, ...interviews];
    setInterviews(updatedInterviews);
    try {
      localStorage.setItem('workzo_employer_interviews', JSON.stringify(updatedInterviews));
      const existingCand = JSON.parse(localStorage.getItem('workzo_candidate_interviews') || '[]');
      const updatedCand = [created, ...existingCand.filter(i => i.id !== created.id)];
      localStorage.setItem('workzo_candidate_interviews', JSON.stringify(updatedCand));
    } catch (e) {
      console.warn('Could not save interview to storage:', e);
    }

    // Synchronize applicant status and stage
    setApplicants(prev => prev.map(a => 
      a.name.toLowerCase() === newInterview.candidateName.toLowerCase()
        ? { ...a, stage: 'interview', status: 'Interview Scheduled' }
        : a
    ));
    if (viewingApplicant && viewingApplicant.name.toLowerCase() === newInterview.candidateName.toLowerCase()) {
      setViewingApplicant(prev => ({ ...prev, stage: 'interview', status: 'Interview Scheduled' }));
    }
    setScheduleModalOpen(false);
    showBanner(`Interview scheduled with ${newInterview.candidateName}! Google Meet link created.`);
    setActiveTab('interviews');
  };

  const showBanner = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Close or Delete Job handlers
  const handleCloseJob = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, status: 'Closed' } : j));
    showBanner('Job listing has been closed.');
  };

  const handleDeleteJob = (id) => {
    const target = jobs.find(j => String(j.id) === String(id));
    const title = target ? target.title : 'this job opening';
    setConfirmModal({
      isOpen: true,
      title: 'Delete Job Listing',
      message: `Are you sure you want to permanently delete "${title}"? This cannot be undone.`,
      confirmText: 'Delete Job',
      onConfirm: () => {
        setJobs(prev => {
          const updated = prev.filter(j => String(j.id) !== String(id));
          try {
            localStorage.setItem('workzo_employer_jobs', JSON.stringify(updated));
          } catch (e) { /* ignore */ }
          return updated;
        });
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        showBanner(`Job listing "${title}" has been deleted.`);
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('workzo_token');
    localStorage.removeItem('workzo_user');
    navigate('/login?role=employer');
  };

  // User's Exact Sidebar Hierarchy Specification
  const navSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my-jobs', label: 'My Jobs', icon: Briefcase, count: jobs.length },
        { id: 'post-job', label: 'Post a Job', icon: PlusCircle },
        { id: 'applicants', label: 'Applicants', icon: Users, count: applicants.length },
        { id: 'interviews', label: 'Interviews', icon: Calendar, badge: interviews.length > 0 ? `${interviews.length} Scheduled` : undefined },
      ]
    },
    {
      title: 'RECRUITMENT',
      items: [
        { id: 'shortlisted', label: 'Shortlisted', icon: UserCheck, count: applicants.filter(a => a.stage === 'shortlisted').length },
        { id: 'hired', label: 'Hired', icon: Award, count: applicants.filter(a => a.stage === 'hired').length },
      ]
    },
    {
      title: 'COMPANY',
      items: [
        { id: 'company-profile', label: 'Company Profile', icon: Building2 },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: notifications.filter(n => n.unread).length },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'logout', label: 'Logout', icon: LogOut, isAction: true },
      ]
    }
  ];

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

      {/* 1. Employer Sidebar Hierarchy */}
      {sidebarOpen && (
        <aside 
          style={isMobile ? undefined : { width: `${sidebarWidth}px` }}
          className={`bg-white border-r border-[#E5E7EB] flex flex-col justify-between select-none ${
            isMobile 
              ? 'fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] h-full shadow-2xl' 
              : 'sticky top-0 h-screen shrink-0 z-30 transition-[width] duration-75 relative shadow-xs'
          }`}
        >
          {/* Draggable Resize Handle (Desktop only) */}
          {!isMobile && (
            <div
              onMouseDown={startDragging}
              title="Drag to resize sidebar"
              className="absolute top-0 -right-2.5 w-5 h-full cursor-col-resize z-40 flex items-center justify-center group"
            >
              <div className={`w-1.5 h-16 rounded-full transition-all duration-200 flex items-center justify-center ${
                isDragging 
                  ? 'bg-orange-500 scale-y-125 shadow-sm' 
                  : 'bg-slate-300 group-hover:bg-slate-900 group-hover:scale-y-110'
              }`}>
                <GripVertical className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          )}

          <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            
            {/* Header: Exact Branding: WORKZO + Employer Portal */}
            <div className="h-18 px-5 flex items-center justify-between border-b border-[#E5E7EB] shrink-0">
              <Link 
                to="/" 
                className="flex items-center gap-3 min-w-0"
                onClick={() => isMobile && setSidebarOpen(false)}
              >
                <img src="/workzo-logo.png" alt="WORKZO" className="h-9 w-auto object-contain shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-black tracking-tight text-[#111827] leading-tight">WORKZO</div>
                  <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider leading-tight">Employer Portal</div>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                title={isMobile ? "Close menu" : "Collapse sidebar"}
                className="p-1.5 text-[#71717A] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                {isMobile ? <X className="w-5 h-5 text-slate-700" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
            </div>

            {/* Quick Action: Post New Job */}
            <div className="px-4 pt-4 pb-2 shrink-0">
              <button
                onClick={() => {
                  setActiveTab('post-job');
                  if (isMobile) setSidebarOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-[#111827] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-orange-400" />
                <span>Post a Job</span>
              </button>
            </div>

            {/* Structured Navigation Groups */}
            <div className="p-3.5 space-y-5 flex-1">
              {navSections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                    {section.title}
                  </p>

                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    const isLogout = item.id === 'logout';

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (isMobile) setSidebarOpen(false);
                          if (isLogout) {
                            handleLogout();
                          } else {
                            setActiveTab(item.id);
                          }
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                          isLogout 
                            ? 'text-[#71717A] hover:text-red-600 hover:bg-red-50' 
                            : isActive
                              ? 'bg-[#111827] text-white shadow-xs font-bold'
                              : 'text-[#4B5563] hover:text-[#111827] hover:bg-slate-100/80 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                            isLogout ? 'text-[#71717A] group-hover:text-red-600' : isActive ? 'text-orange-400' : 'text-[#71717A]'
                          }`} />
                          <span className="truncate">{item.label}</span>
                        </div>

                        {item.count !== undefined && item.count > 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#71717A]'
                          }`}>
                            {item.count}
                          </span>
                        )}

                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Bottom Profile Preview */}
            <div className="p-3.5 border-t border-[#E5E7EB] bg-[#FAFAF9]/80 shrink-0">
              <div className="flex items-center gap-2.5 px-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                  {company.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#111827] truncate">{company.name}</p>
                  <p className="text-[10px] text-[#71717A] truncate">{company.contactEmail}</p>
                </div>
              </div>
            </div>

          </div>
        </aside>
      )}

      {/* 2. Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar with Menu Toggle & Controls */}
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
              {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Employer Dashboard'}
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
                <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                    <p className="text-xs font-bold text-[#111827]">Notifications ({notifications.filter(n => n.unread).length})</p>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, unread: false })));
                        setNotificationsOpen(false);
                      }}
                      className="text-[10px] text-orange-600 font-semibold hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="mt-2 space-y-2 text-xs">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-2.5 rounded-xl ${n.unread ? 'bg-orange-50 border border-orange-100' : 'bg-slate-50'}`}>
                        <p className="font-semibold text-[#111827] text-xs">{n.title}</p>
                        <p className="text-[#71717A] text-[11px] mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-[#A1A1AA] mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company Profile Icon & Name */}
            <button 
              onClick={() => setActiveTab('company-profile')}
              className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {company.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#111827] max-w-[120px] truncate">{company.name}</span>
            </button>
          </div>
        </header>

        {/* Global Toast Success Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2 max-w-6xl mx-auto w-full">
              <CheckCircle2 className="w-4 h-4" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg('')} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 3. Dynamic Section Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">
          
          {/* TAB 1: DASHBOARD (Overview of jobs, applicants, interviews, and hiring activity) */}
          {activeTab === 'dashboard' && (
            <>
              {/* Employer Hero Banner (Soft Notion Gradient) */}
              <div 
                className="rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
                style={{
                  background: 'linear-gradient(135deg, #BFDBFE 0%, #DDD6FE 50%, #CCFBF1 100%)'
                }}
              >
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-white/60 text-xs font-semibold text-[#111827] mb-3">
                    <Building2 className="w-3.5 h-3.5 text-orange-600" />
                    <span>Employer Workspace • {company.name}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
                    Hiring Activity & Recruitment Overview
                  </h2>
                  <p className="text-xs sm:text-sm text-[#334155] mt-1.5 max-w-xl leading-relaxed">
                    You currently have <span className="font-bold text-[#111827]">{jobs.filter(j => j.status === 'Active').length} active job listings</span>, <span className="font-bold text-[#111827]">{applicants.length} candidates in progress</span>, and <span className="font-bold text-[#111827]">{interviews.length} interviews scheduled</span>.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('post-job')}
                    className="bg-[#111827] hover:bg-black text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-orange-400" />
                    <span>Post a Job</span>
                  </button>
                </div>
              </div>

              {/* 4 Key Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveTab('my-jobs')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">Active Listings</p>
                  <p className="text-2xl font-bold text-[#111827] mt-1">{jobs.filter(j => j.status === 'Active').length}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">{jobs.filter(j => j.status === 'Paused').length} paused</p>
                </div>
                <div 
                  onClick={() => setActiveTab('applicants')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">Total Applicants</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">{applicants.length}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">Across all open positions</p>
                </div>
                <div 
                  onClick={() => setActiveTab('interviews')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">Interviews Scheduled</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{interviews.length}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">
                    {interviews.length > 0 ? (interviews[0]?.date ? `Next: ${interviews[0].date.split('•')[0]}` : 'Upcoming calls') : 'No upcoming calls'}
                  </p>
                </div>
                <div 
                  onClick={() => setActiveTab('hired')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">Hired Candidates</p>
                  <p className="text-2xl font-bold text-[#111827] mt-1">
                    {applicants.filter(a => a.stage === 'hired').length}
                  </p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">Pipeline tracking</p>
                </div>
              </div>

              {/* Two Column Grid: Next Interview + Quick Pipeline Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upcoming Interview Card or Empty State */}
                {interviews.length > 0 ? (
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/50">
                          Next Video Interview
                        </span>
                        <button onClick={() => setActiveTab('interviews')} className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer">
                          All ({interviews.length}) →
                        </button>
                      </div>
                      <h3 className="text-base font-bold text-[#111827]">
                        {interviews[0]?.candidateName} — {interviews[0]?.role}
                      </h3>
                      <p className="text-xs text-[#71717A] mt-1.5 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        <span>{interviews[0]?.date}</span>
                      </p>
                      <p className="text-xs text-[#71717A] mt-1">
                        Type: <strong>{interviews[0]?.type}</strong>
                      </p>
                      {interviews[0]?.link && (
                        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-orange-600 font-mono bg-orange-50/70 border border-orange-200/60 px-2.5 py-1 rounded-lg w-fit max-w-full">
                          <Video className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{interviews[0]?.link}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-2">
                      <span className="text-xs text-[#71717A]">Interviewer: {interviews[0]?.interviewer}</span>
                      {interviews[0]?.link ? (
                        <a 
                          href={interviews[0]?.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Join Meeting</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => handleOpenEditMeetLink(interviews[0])}
                          className="px-3.5 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-xl text-xs font-semibold cursor-pointer border border-orange-200"
                        >
                          + Add Meet Link
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                          Interview Pipeline
                        </span>
                        <span className="text-xs font-semibold text-slate-400">0 Scheduled</span>
                      </div>
                      <h3 className="text-base font-bold text-[#111827]">
                        No Interviews Scheduled
                      </h3>
                      <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">
                        There are currently zero candidate interviews scheduled. Create a Google Meet link and schedule technical or screening calls with your applicants.
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                      <span className="text-xs text-[#71717A]">No calls pending</span>
                      <button 
                        onClick={() => {
                          setScheduleCandidate(null);
                          setNewInterview({ 
                            candidateName: applicants[0]?.name || '', 
                            role: applicants[0]?.role || '', 
                            date: new Date().toISOString().split('T')[0], 
                            time: '11:00 AM', 
                            type: 'Technical System Round', 
                            interviewer: 'David Vance',
                            meetingLink: `https://meet.google.com/${generateMeetCode()}`
                          });
                          setScheduleModalOpen(true);
                        }}
                        className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Schedule Interview</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Pipeline Status */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#111827] mb-3">Recruitment Funnel</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#71717A]">Under Review</span>
                        <span className="font-bold text-[#111827]">{applicants.filter(a => a.stage === 'applied').length} candidates</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-slate-700 h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#71717A]">Shortlisted</span>
                        <span className="font-bold text-orange-600">{applicants.filter(a => a.stage === 'shortlisted').length} candidates</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full rounded-full" style={{ width: '60%' }}></div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#71717A]">Interview Stage</span>
                        <span className="font-bold text-emerald-600">{applicants.filter(a => a.stage === 'interview').length} candidates</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-xs text-[#71717A]">Candidates ready for action</span>
                    <button onClick={() => setActiveTab('applicants')} className="text-xs font-semibold text-orange-600 hover:underline">
                      Manage Applicants →
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Applicants Review Table */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#111827]">Recent Candidate Applications</h3>
                  <button onClick={() => setActiveTab('applicants')} className="text-xs font-semibold text-orange-600 hover:underline">
                    View all applicants →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E7EB] text-[#A1A1AA] uppercase tracking-wider font-semibold">
                        <th className="py-3 px-3">Candidate</th>
                        <th className="py-3 px-3">Target Role</th>
                        <th className="py-3 px-3">Applied</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {applicants.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <p className="font-bold text-[#111827]">{a.name}</p>
                            <p className="text-[11px] text-[#71717A]">{a.email}</p>
                          </td>
                          <td className="py-3 px-3 font-medium text-[#111827]">{a.role}</td>
                          <td className="py-3 px-3 text-[#71717A]">{a.appliedDate}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              a.stage === 'interview' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              a.stage === 'shortlisted' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                              a.stage === 'hired' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right space-x-1.5">
                            <button 
                              type="button"
                              onClick={() => setViewingApplicant(a)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-orange-600 hover:text-white hover:bg-orange-600 transition-colors cursor-pointer border border-orange-200 shadow-2xs"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveApplicant(a.id);
                              }}
                              className="inline-flex items-center p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-200"
                              title="Remove application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {applicants.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-xs text-[#71717A]">
                            No candidate applications in pipeline.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MY JOBS (View, edit, pause, close, or delete posted jobs) */}
          {activeTab === 'my-jobs' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Manage Posted Jobs</h2>
                  <p className="text-xs text-[#71717A]">View, edit, pause, close, or delete your posted jobs.</p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Status Filters */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                    {['All', 'Active', 'Paused', 'Closed'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedJobFilter(filter)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                          selectedJobFilter === filter ? 'bg-white font-bold text-[#111827] shadow-xs' : 'text-[#71717A] hover:text-[#111827]'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab('post-job')}
                    className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post New Job</span>
                  </button>
                </div>
              </div>

              {/* Jobs List */}
              <div className="divide-y divide-[#E5E7EB]">
                {jobs
                  .filter(job => selectedJobFilter === 'All' ? true : job.status === selectedJobFilter)
                  .map((job) => (
                    <div key={job.id} className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-base font-bold text-[#111827]">{job.title}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            job.status === 'Paused' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#71717A]">
                          {job.department} • {job.type} • {job.location} • <strong className="text-[#111827]">{job.salary}</strong> • Posted {job.postedDate}
                        </p>
                        <p className="text-xs text-[#4B5563] line-clamp-1">{job.description}</p>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {/* Applicants Badge */}
                        <button 
                          onClick={() => setActiveTab('applicants')}
                          className="text-xs text-[#71717A] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer"
                        >
                          <strong>{getJobApplicantsCount(job.title)}</strong> {getJobApplicantsCount(job.title) === 1 ? 'Applicant' : 'Applicants'}
                        </button>

                        {/* Pause / Resume */}
                        <button 
                          onClick={() => {
                            const newStatus = job.status === 'Active' ? 'Paused' : 'Active';
                            setJobs(jobs.map(j => j.id === job.id ? { ...j, status: newStatus } : j));
                            showBanner(`Job "${job.title}" is now ${newStatus}.`);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg text-[#71717A] hover:text-[#111827] cursor-pointer" 
                          title={job.status === 'Active' ? 'Pause listing' : 'Resume listing'}
                        >
                          {job.status === 'Active' ? <PauseCircle className="w-4 h-4 text-amber-600" /> : <PlayCircle className="w-4 h-4 text-emerald-600" />}
                        </button>

                        {/* Close Job */}
                        {job.status !== 'Closed' && (
                          <button 
                            onClick={() => handleCloseJob(job.id)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 border border-[#E5E7EB] cursor-pointer"
                            title="Close listing"
                          >
                            Close
                          </button>
                        )}

                        {/* Delete Job */}
                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteJob(job.id);
                          }}
                          className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer transition-colors border border-transparent hover:border-red-200" 
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                {jobs.filter(job => selectedJobFilter === 'All' ? true : job.status === selectedJobFilter).length === 0 && (
                  <div className="text-center py-10 text-xs text-[#71717A]">
                    No job postings found with status "{selectedJobFilter}".
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: POST A JOB (Create and publish a new job) */}
          {activeTab === 'post-job' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Post a New Job Opportunity</h2>
                <p className="text-xs text-[#71717A] mt-0.5">Create and publish a verified opening to thousands of candidates on WORKZO.</p>
              </div>

              <form onSubmit={handlePostJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">Job Title *</label>
                  <input 
                    type="text" 
                    required
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer, Product Designer..." 
                    className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">Department</label>
                    <select 
                      value={newJob.department}
                      onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:border-orange-500"
                    >
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Product</option>
                      <option>Marketing</option>
                      <option>Operations</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">Job Type</label>
                    <select 
                      value={newJob.type}
                      onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm bg-white outline-none focus:border-orange-500"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">Location</label>
                    <input 
                      type="text" 
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      placeholder="e.g. Remote or San Francisco, CA" 
                      className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">Salary Range *</label>
                    <input 
                      type="text" 
                      required
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      placeholder="e.g. $130,000 - $155,000" 
                      className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#111827] mb-1">Required Experience</label>
                    <input 
                      type="text" 
                      value={newJob.experience}
                      onChange={(e) => setNewJob({ ...newJob, experience: e.target.value })}
                      placeholder="e.g. 3-5 years" 
                      className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#111827] mb-1">Job Description & Responsibilities</label>
                  <textarea 
                    rows={4}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Outline day-to-day duties, required skills, team culture, and benefits..."
                    className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('my-jobs')} 
                    className="px-5 py-2.5 text-xs font-semibold text-[#71717A] hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="workzo-btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Publish Job Opening
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: APPLICANTS (View candidates who applied for jobs) */}
          {activeTab === 'applicants' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Candidate Applications ({applicants.length})</h2>
                  <p className="text-xs text-[#71717A]">Review full candidate applications, shortlist, schedule interviews, or remove candidates.</p>
                </div>
              </div>

              <div className="space-y-3">
                {applicants.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-[#111827]">{a.name}</h3>
                        <span className="text-xs text-[#71717A]">({a.experience} exp)</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          a.stage === 'interview' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          a.stage === 'shortlisted' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                          a.stage === 'hired' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {a.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A]">{a.role} • Applied {a.appliedDate} • {a.email}</p>
                      
                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {a.skills?.map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-[#4B5563] text-[10px] font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                      {/* View Application Button */}
                      <button 
                        onClick={() => setViewingApplicant(a)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {/* Shortlist / Un-shortlist Toggle */}
                      <button 
                        onClick={() => handleToggleShortlist(a.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer transition-colors ${
                          a.stage === 'shortlisted' 
                            ? 'bg-amber-50 text-amber-700 border-amber-300' 
                            : 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-slate-50'
                        }`}
                      >
                        {a.stage === 'shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                      </button>

                      {/* Schedule Meeting Button */}
                      <button 
                        onClick={() => handleOpenScheduleForApplicant(a)}
                        className="bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                      >
                        Schedule
                      </button>

                      {/* Remove Application Button */}
                      <button 
                        onClick={() => handleRemoveApplicant(a.id)}
                        title="Remove application"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {applicants.length === 0 && (
                  <div className="text-center py-12 text-xs text-[#71717A]">
                    No candidate applications currently found.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: INTERVIEWS (Schedule and manage candidate interviews) */}
          {activeTab === 'interviews' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Scheduled Candidate Interviews</h2>
                  <p className="text-xs text-[#71717A]">Schedule video meetings, track dates, and invite interviewers.</p>
                </div>

                <button 
                  onClick={() => {
                    setScheduleCandidate(null);
                    setNewInterview({ 
                      candidateName: applicants[0]?.name || '', 
                      role: applicants[0]?.role || '', 
                      date: new Date().toISOString().split('T')[0], 
                      time: '11:00 AM', 
                      type: 'Technical System Round', 
                      interviewer: 'David Vance',
                      meetingLink: `https://meet.google.com/${generateMeetCode()}`
                    });
                    setScheduleModalOpen(true);
                  }}
                  className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Schedule Interview</span>
                </button>
              </div>

              {interviews.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-[#E5E7EB] rounded-2xl p-6 bg-slate-50/50">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-[#111827]">No Scheduled Interviews</h3>
                  <p className="text-xs text-[#71717A] mt-1.5 max-w-sm mx-auto leading-relaxed">
                    You currently have zero scheduled candidate interviews. Schedule an interview with candidate applicants and input or generate a Google Meet link.
                  </p>
                  <button 
                    onClick={() => {
                      setScheduleCandidate(null);
                      setNewInterview({ 
                        candidateName: applicants[0]?.name || '', 
                        role: applicants[0]?.role || '', 
                        date: new Date().toISOString().split('T')[0], 
                        time: '11:00 AM', 
                        type: 'Technical System Round', 
                        interviewer: 'David Vance',
                        meetingLink: `https://meet.google.com/${generateMeetCode()}`
                      });
                      setScheduleModalOpen(true);
                    }}
                    className="workzo-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold mt-4 inline-flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Schedule First Interview</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {interviews.map((item) => (
                    <div key={item.id} className="p-5 rounded-2xl border border-orange-200 bg-orange-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                            Google Meet Call
                          </span>
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            {item.status}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#111827] mt-1">{item.candidateName} — {item.role}</h3>
                        <p className="text-xs text-[#71717A] flex items-center gap-1.5 flex-wrap">
                          <Clock className="w-3.5 h-3.5 text-orange-600" />
                          <span>{item.date}</span>
                          <span>•</span>
                          <span>Round: <strong>{item.type}</strong></span>
                          <span>•</span>
                          <span>Interviewer: <strong>{item.interviewer}</strong></span>
                        </p>

                        {/* Google Meet Link Info & Copy / Edit Actions */}
                        {item.link ? (
                          <div className="pt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-[#4B5563]">Meet URL:</span>
                            <a 
                              href={item.link} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs font-mono text-orange-600 hover:underline bg-white px-2.5 py-1 rounded-lg border border-orange-200/80 flex items-center gap-1.5"
                            >
                              <Video className="w-3.5 h-3.5 text-orange-600" />
                              <span className="truncate max-w-[220px] sm:max-w-xs">{item.link}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                            <button
                              onClick={() => handleCopyLink(item.link, item.id)}
                              className="p-1 text-[#71717A] hover:text-[#111827] hover:bg-white rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#E5E7EB]"
                              title="Copy Google Meet Link"
                            >
                              {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleOpenEditMeetLink(item)}
                              className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                            >
                              Edit Link
                            </button>
                          </div>
                        ) : (
                          <div className="pt-1 flex items-center gap-2">
                            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">No Meet link set</span>
                            <button
                              onClick={() => handleOpenEditMeetLink(item)}
                              className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                            >
                              + Add Google Meet Link
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.link ? (
                          <a 
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Join Meeting</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => handleOpenEditMeetLink(item)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 cursor-pointer"
                          >
                            Set Meet Link
                          </button>
                        )}
                        <button 
                          onClick={() => handleCancelInterview(item.id)}
                          className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: SHORTLISTED (Manage candidates selected for the next stage) */}
          {activeTab === 'shortlisted' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Shortlisted Candidates</h2>
                <p className="text-xs text-[#71717A]">Candidates who passed initial screening and are selected for next stages.</p>
              </div>

              <div className="space-y-3">
                {applicants.filter(a => a.stage === 'shortlisted').map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-orange-200 bg-orange-50/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">{a.name}</h3>
                      <p className="text-xs text-[#71717A]">{a.role} • {a.experience} experience • {a.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setViewingApplicant(a)}
                        className="px-3 py-1.5 border border-[#E5E7EB] hover:border-slate-300 rounded-lg text-xs font-semibold text-[#111827] hover:bg-slate-50 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-orange-600" />
                        <span>View</span>
                      </button>
                      <button 
                        onClick={() => {
                          setApplicants(applicants.map(app => app.id === a.id ? { ...app, stage: 'hired', status: 'Hired', hiredDate: 'Oct 3, 2026', salaryAgreed: '$135,000 / yr' } : app));
                          showBanner(`Congratulations! ${a.name} marked as Hired!`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Mark as Hired
                      </button>
                      <button 
                        onClick={() => handleOpenScheduleForApplicant(a)} 
                        className="workzo-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Schedule Meeting
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveApplicant(a.id);
                        }}
                        title="Remove application"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {applicants.filter(a => a.stage === 'shortlisted').length === 0 && (
                  <div className="text-center py-10 text-xs text-[#71717A]">
                    No candidates currently shortlisted. Go to the Applicants tab to shortlist candidates.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: HIRED (View candidates who have been selected/hired) */}
          {activeTab === 'hired' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Hired Candidates</h2>
                <p className="text-xs text-[#71717A]">View candidates who have successfully joined or accepted company offers.</p>
              </div>

              <div className="space-y-3">
                {applicants.filter(a => a.stage === 'hired').map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#111827]">{a.name}</h3>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Offer Accepted 🎉
                        </span>
                      </div>
                      <p className="text-xs text-[#71717A]">{a.role} • Package: {a.salaryAgreed || '$140k/yr'}</p>
                      <p className="text-[11px] text-[#A1A1AA]">Hired on {a.hiredDate || 'October 2026'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`mailto:${a.email}`}
                        className="px-3.5 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email Candidate</span>
                      </a>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveApplicant(a.id);
                        }}
                        title="Remove candidate record"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {applicants.filter(a => a.stage === 'hired').length === 0 && (
                  <div className="text-center py-10 text-xs text-[#71717A]">
                    No candidates currently marked as hired.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 8: COMPANY PROFILE (Manage company information, logo, website, industry, etc.) */}
          {activeTab === 'company-profile' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Company Profile & Organization Info</h2>
                  <p className="text-xs text-[#71717A]">Update your company branding, verified contact person, and public details.</p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  showBanner('Company profile information updated successfully!');
                }}
                className="space-y-5"
              >
                {/* Logo & Headline */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold flex items-center justify-center text-xl shrink-0">
                    {company.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">{company.name}</h3>
                    <p className="text-xs text-[#71717A]">{company.industry} • Founded {company.founded}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Verified Employer Status ✓
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Company Name</label>
                    <input 
                      type="text" 
                      value={company.name}
                      onChange={(e) => setCompany({ ...company, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Industry Sector</label>
                    <input 
                      type="text" 
                      value={company.industry}
                      onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Company Website</label>
                    <input 
                      type="text" 
                      value={company.website}
                      onChange={(e) => setCompany({ ...company, website: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Company Size</label>
                    <input 
                      type="text" 
                      value={company.size}
                      onChange={(e) => setCompany({ ...company, size: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Recruiter / Contact Person</label>
                    <input 
                      type="text" 
                      value={company.contactPerson}
                      onChange={(e) => setCompany({ ...company, contactPerson: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Recruiting Email</label>
                    <input 
                      type="email" 
                      value={company.contactEmail}
                      onChange={(e) => setCompany({ ...company, contactEmail: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-[#111827]">Company Bio & Mission</label>
                  <textarea 
                    rows={3}
                    value={company.tagline}
                    onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#E5E7EB] text-sm outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="workzo-btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Save Company Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 9: NOTIFICATIONS (New applications, interview updates, application activity) */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#111827]">Notifications & Activity Feed</h2>
                  <p className="text-xs text-[#71717A]">Real-time alerts for incoming applications and candidate interviews.</p>
                </div>

                <button 
                  onClick={() => {
                    setNotifications(notifications.map(n => ({ ...n, unread: false })));
                    showBanner('All notifications marked as read.');
                  }}
                  className="text-xs font-semibold text-orange-600 hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div 
                    key={n.id} 
                    className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
                      n.unread ? 'bg-orange-50/40 border-orange-200' : 'bg-white border-[#E5E7EB]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#111827]">{n.title}</span>
                        {n.unread && (
                          <span className="w-2 h-2 rounded-full bg-orange-600"></span>
                        )}
                      </div>
                      <p className="text-xs text-[#4B5563]">{n.message}</p>
                      <span className="text-[11px] text-[#A1A1AA] block">{n.time}</span>
                    </div>

                    <button 
                      onClick={() => setNotifications(notifications.filter(item => item.id !== n.id))}
                      className="text-[#A1A1AA] hover:text-[#111827] p-1 cursor-pointer"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: SETTINGS (Account, password, notification and privacy settings) */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">Employer Account & Privacy Settings</h2>
                <p className="text-xs text-[#71717A]">Configure credentials, email alert preferences, and privacy controls.</p>
              </div>

              <div className="space-y-6 text-xs">
                {/* 1. Account Info */}
                <div className="space-y-3 pb-5 border-b border-[#E5E7EB]">
                  <h3 className="text-sm font-bold text-[#111827]">Account Administrator</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-[#71717A]">Admin Email</label>
                      <input type="text" readOnly value={company.contactEmail} className="w-full p-2.5 bg-slate-50 rounded-xl border border-[#E5E7EB]" />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-[#71717A]">Phone Number</label>
                      <input type="text" readOnly value={company.phone} className="w-full p-2.5 bg-slate-50 rounded-xl border border-[#E5E7EB]" />
                    </div>
                  </div>
                </div>

                {/* 2. Notification Preferences */}
                <div className="space-y-3 pb-5 border-b border-[#E5E7EB]">
                  <h3 className="text-sm font-bold text-[#111827]">Email Notification Preferences</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-[#111827]">Instant Application Alerts</p>
                      <p className="text-[#71717A] text-[11px]">Receive an email immediately when a candidate submits an application.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.emailAlerts}
                      onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-[#111827]">Interview Confirmations & Reminders</p>
                      <p className="text-[#71717A] text-[11px]">Send automatic calendar invites and 1-hour pre-meeting reminders.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.interviewReminders}
                      onChange={(e) => setSettings({ ...settings, interviewReminders: e.target.checked })}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-[#111827]">Weekly Pipeline Digest</p>
                      <p className="text-[#71717A] text-[11px]">A Monday summary of active job performance and candidates in pipeline.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.weeklyDigest}
                      onChange={(e) => setSettings({ ...settings, weeklyDigest: e.target.checked })}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                {/* 3. Privacy & Security */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-[#111827]">Privacy & Visibility</h3>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-[#111827]">Public Company Listing</p>
                      <p className="text-[#71717A] text-[11px]">Show your company profile on WORKZO's verified directory.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={settings.publicListing}
                      onChange={(e) => setSettings({ ...settings, publicListing: e.target.checked })}
                      className="w-4 h-4 accent-orange-600 rounded cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => showBanner('Account settings updated!')}
                    className="workzo-btn-primary px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-sm"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* View Application Details Modal */}
        {viewingApplicant && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#E5E7EB] overflow-hidden">
              
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b border-[#E5E7EB] flex items-center justify-between bg-slate-50/70 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white font-black text-lg flex items-center justify-center shadow-xs shrink-0">
                    {viewingApplicant.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#111827] flex items-center gap-2">
                      <span>{viewingApplicant.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        viewingApplicant.stage === 'interview' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        viewingApplicant.stage === 'shortlisted' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        viewingApplicant.stage === 'hired' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {viewingApplicant.status}
                      </span>
                    </h3>
                    <p className="text-xs text-[#71717A] mt-0.5">
                      Applied for <strong className="text-[#111827]">{viewingApplicant.role}</strong> • {viewingApplicant.appliedDate}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setViewingApplicant(null)}
                  className="p-1.5 text-[#71717A] hover:text-[#111827] hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs text-[#334155]">
                
                {/* Contact & Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                    <span className="text-[10px] text-[#A1A1AA] uppercase font-bold flex items-center gap-1">
                      <Mail className="w-3 h-3 text-orange-600" /> Email
                    </span>
                    <p className="font-semibold text-[#111827] mt-1 truncate" title={viewingApplicant.email}>
                      {viewingApplicant.email}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#A1A1AA] uppercase font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-orange-600" /> Phone
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-full">
                        Verified ✓
                      </span>
                    </div>
                    <p className="font-semibold text-[#111827] mt-1 truncate">
                      {viewingApplicant.phone || '+1 (555) 012-9840'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                    <span className="text-[10px] text-[#A1A1AA] uppercase font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-orange-600" /> Location
                    </span>
                    <p className="font-semibold text-[#111827] mt-1 truncate">
                      {viewingApplicant.location || 'Remote'}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-[#E5E7EB]">
                    <span className="text-[10px] text-[#A1A1AA] uppercase font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-600" /> Experience
                    </span>
                    <p className="font-semibold text-[#111827] mt-1 truncate">
                      {viewingApplicant.experience}
                    </p>
                  </div>
                </div>

                {/* Candidate Summary / Bio */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-orange-600" />
                    <span>Candidate Summary</span>
                  </h4>
                  <p className="text-xs leading-relaxed text-[#374151] p-3.5 bg-slate-50/70 rounded-xl border border-[#E5E7EB]">
                    {viewingApplicant.bio}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">
                    Verified Competencies & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingApplicant.skills?.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-orange-50 text-orange-800 border border-orange-200/70 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Education */}
                {viewingApplicant.education && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1.5">
                      Academic Background
                    </h4>
                    <p className="text-xs font-semibold text-[#111827]">{viewingApplicant.education}</p>
                  </div>
                )}

                {/* Resume Document Card */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] text-orange-600 shadow-2xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-[#111827]">{viewingApplicant.resumeName || `${viewingApplicant.name}_Resume.pdf`}</p>
                      <p className="text-[11px] text-[#71717A]">
                        {viewingApplicant.resumeSize || '320 KB'} • Verified Candidate Attachment
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => alert(`Downloading verified resume for ${viewingApplicant.name} (PDF)...`)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#111827] border border-[#E5E7EB] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-orange-600" />
                    <span>Download PDF</span>
                  </button>
                </div>

              </div>

              {/* Modal Footer / Actions */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-[#E5E7EB] flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
                {/* Danger Action: Remove Candidate */}
                <button 
                  onClick={() => handleRemoveApplicant(viewingApplicant.id)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Remove Application</span>
                </button>

                {/* Main Actions: Shortlist & Schedule */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => handleToggleShortlist(viewingApplicant.id)}
                    className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors border ${
                      viewingApplicant.stage === 'shortlisted'
                        ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                        : 'bg-white hover:bg-orange-50 text-orange-700 border-orange-300 shadow-2xs'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{viewingApplicant.stage === 'shortlisted' ? 'Remove from Shortlist' : 'Shortlist Candidate'}</span>
                  </button>

                  <button 
                    onClick={() => handleOpenScheduleForApplicant(viewingApplicant)}
                    className="flex-1 sm:flex-initial bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>Schedule Meeting</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Schedule Interview Modal */}
        {scheduleModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <h3 className="text-base font-bold text-[#111827]">Schedule Candidate Interview</h3>
                <button onClick={() => setScheduleModalOpen(false)} className="text-[#71717A] hover:text-[#111827]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">Candidate Name</label>
                  <input 
                    type="text" 
                    required 
                    value={newInterview.candidateName}
                    onChange={(e) => setNewInterview({ ...newInterview, candidateName: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E7EB]" 
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">Target Role</label>
                  <input 
                    type="text" 
                    value={newInterview.role}
                    onChange={(e) => setNewInterview({ ...newInterview, role: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E7EB]" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Interview Date</label>
                    <input 
                      type="date" 
                      required
                      value={newInterview.date}
                      onChange={(e) => setNewInterview({ ...newInterview, date: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB]" 
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-[#111827]">Time</label>
                    <input 
                      type="text" 
                      value={newInterview.time}
                      onChange={(e) => setNewInterview({ ...newInterview, time: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E5E7EB]" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">Interview Round</label>
                  <select 
                    value={newInterview.type}
                    onChange={(e) => setNewInterview({ ...newInterview, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E7EB] bg-white"
                  >
                    <option>Technical System Round</option>
                    <option>Design Portfolio Walkthrough</option>
                    <option>Hiring Manager Screen</option>
                    <option>Culture & Values Fit</option>
                    <option>Executive Final Round</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#111827]">Interviewer Name</label>
                  <input 
                    type="text" 
                    value={newInterview.interviewer}
                    onChange={(e) => setNewInterview({ ...newInterview, interviewer: e.target.value })}
                    placeholder="e.g. David Vance (VP Tech)"
                    className="w-full p-2.5 rounded-xl border border-[#E5E7EB]" 
                  />
                </div>

                {/* Google Meet Link Field & Generation Helpers */}
                <div className="p-3 bg-orange-50/40 rounded-2xl border border-orange-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-[#111827] flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-orange-600" />
                      <span>Google Meet Link</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={handleGenerateMeetLink}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate</span>
                      </button>
                      <span className="text-slate-300">|</span>
                      <a 
                        href="https://meet.google.com/new" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                        title="Create an instant room in Google Meet"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Open Meet</span>
                      </a>
                    </div>
                  </div>

                  <input 
                    type="url" 
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    value={newInterview.meetingLink}
                    onChange={(e) => setNewInterview({ ...newInterview, meetingLink: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E5E7EB] bg-white font-mono text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                  />
                  <p className="text-[10px] text-[#71717A] leading-tight">
                    Both candidate and interviewer can join via this link. Click <strong>Generate</strong> for an instant URL, or open Google Meet to create your own room.
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
                  <button 
                    type="button" 
                    onClick={() => setScheduleModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="workzo-btn-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Confirm & Schedule Meet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Google Meet Link Modal */}
        {editingMeetInterview && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111827]">Update Google Meet Link</h3>
                    <p className="text-xs text-[#71717A]">{editingMeetInterview.candidateName} — {editingMeetInterview.role}</p>
                  </div>
                </div>
                <button onClick={() => setEditingMeetInterview(null)} className="text-[#71717A] hover:text-[#111827] cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMeetLink} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-semibold text-[#111827]">Google Meet Link</label>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button" 
                        onClick={() => setEditMeetLinkValue(`https://meet.google.com/${generateMeetCode()}`)}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Generate Link</span>
                      </button>
                      <span className="text-slate-300">|</span>
                      <a 
                        href="https://meet.google.com/new" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Meet</span>
                      </a>
                    </div>
                  </div>
                  <div className="relative">
                    <Video className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input 
                      type="url" 
                      required
                      placeholder="https://meet.google.com/xxx-yyyy-zzz"
                      value={editMeetLinkValue}
                      onChange={(e) => setEditMeetLinkValue(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E5E7EB] font-mono text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" 
                    />
                  </div>
                  <p className="text-[11px] text-[#71717A] mt-1">
                    Updates will sync immediately for both you and the candidate.
                  </p>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
                  <button 
                    type="button" 
                    onClick={() => setEditingMeetInterview(null)}
                    className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-slate-100 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="workzo-btn-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Custom In-App Delete / Action Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-70 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-red-100">
              <div className="flex items-start gap-3.5">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0 border border-red-200">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#111827]">{confirmModal.title}</h3>
                  <p className="text-xs text-[#71717A] mt-1.5 leading-relaxed">{confirmModal.message}</p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-[#E5E7EB]">
                <button 
                  type="button" 
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors"
                >
                  {confirmModal.confirmText || 'Confirm Delete'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <footer className="border-t border-[#E5E7EB] bg-white py-5 px-8 text-xs text-[#71717A] flex items-center justify-between">
          <span>WORKZO Employer Portal • Verified Hiring Hub</span>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-orange-600">Home</Link>
          </div>
        </footer>

      </div>

    </div>
  );
}
