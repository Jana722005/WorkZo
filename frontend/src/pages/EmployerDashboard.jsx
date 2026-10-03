import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FileText
} from 'lucide-react';

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [editingJob, setEditingJob] = useState(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);

  // Drag-to-resize sidebar logic
  const isDraggingRef = useRef(false);

  const startDragging = (e) => {
    e.preventDefault();
    setIsDragging(true);
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
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
  }, []);

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

  // 2. Posted Jobs State
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      type: 'Full-time',
      location: 'Remote',
      salary: '$130k - $155k',
      applicantsCount: 42,
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
      applicantsCount: 28,
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
      applicantsCount: 35,
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
      applicantsCount: 19,
      status: 'Paused',
      postedDate: 'Sep 15, 2026',
      description: 'Manage multi-region Kubernetes clusters, CI/CD pipelines, and infrastructure observability.'
    }
  ]);

  // 3. Candidates / Applicants State
  const [applicants, setApplicants] = useState([
    {
      id: 1,
      name: 'Alex Rivera',
      role: 'Senior Frontend Engineer',
      email: 'alex.rivera@example.com',
      experience: '6 yrs',
      appliedDate: 'Oct 2, 2026',
      status: 'Interview Scheduled',
      stage: 'interview', // 'applied' | 'shortlisted' | 'interview' | 'hired'
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite']
    },
    {
      id: 2,
      name: 'Sophia Patel',
      role: 'Lead Product Designer',
      email: 'sophia.patel@example.com',
      experience: '7 yrs',
      appliedDate: 'Oct 1, 2026',
      status: 'Shortlisted',
      stage: 'shortlisted',
      skills: ['Figma', 'Design Systems', 'UX Research', 'Prototyping']
    },
    {
      id: 3,
      name: 'Marcus Brody',
      role: 'Backend Systems Architect',
      email: 'm.brody@example.com',
      experience: '8 yrs',
      appliedDate: 'Sep 30, 2026',
      status: 'In Review',
      stage: 'applied',
      skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis']
    },
    {
      id: 4,
      name: 'Elena Rostova',
      role: 'Senior Frontend Engineer',
      email: 'elena.r@example.com',
      experience: '5 yrs',
      appliedDate: 'Sep 29, 2026',
      status: 'Hired',
      stage: 'hired',
      skills: ['React', 'Next.js', 'GraphQL', 'CSS Modules'],
      hiredDate: 'Oct 3, 2026',
      salaryAgreed: '$140,000 / yr'
    }
  ]);

  // 4. Interviews State
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      candidateName: 'Alex Rivera',
      role: 'Senior Frontend Engineer',
      date: 'Monday, Oct 6 • 10:30 AM (PST)',
      type: 'Technical System Round',
      interviewer: 'David Vance (VP Tech)',
      link: 'https://meet.google.com/xyz-workzo-tech',
      status: 'Confirmed'
    },
    {
      id: 2,
      candidateName: 'Sophia Patel',
      role: 'Lead Product Designer',
      date: 'Tuesday, Oct 7 • 2:00 PM (PST)',
      type: 'Design Portfolio Walkthrough',
      interviewer: 'Laura Chen (Head of Design)',
      link: 'https://meet.google.com/abc-workzo-design',
      status: 'Confirmed'
    }
  ]);

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

  // New Interview Form State
  const [newInterview, setNewInterview] = useState({
    candidateName: '',
    role: '',
    date: '',
    time: '10:00 AM',
    type: 'Technical Interview',
    interviewer: 'David Vance'
  });

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

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    if (!newInterview.candidateName) return;
    const created = {
      id: Date.now(),
      candidateName: newInterview.candidateName,
      role: newInterview.role || 'Senior Frontend Engineer',
      date: `${newInterview.date || 'Oct 8, 2026'} • ${newInterview.time}`,
      type: newInterview.type,
      interviewer: newInterview.interviewer,
      link: 'https://meet.google.com/new-meeting-workzo',
      status: 'Confirmed'
    };
    setInterviews([created, ...interviews]);
    setScheduleModalOpen(false);
    showBanner(`Interview scheduled with ${newInterview.candidateName}!`);
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
    if (window.confirm('Are you sure you want to delete this job listing?')) {
      setJobs(jobs.filter(j => j.id !== id));
      showBanner('Job listing deleted.');
    }
  };

  const handleLogout = () => {
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
        { id: 'interviews', label: 'Interviews', icon: Calendar, badge: `${interviews.length} Scheduled` },
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
      
      {/* 1. Employer Sidebar Hierarchy */}
      {sidebarOpen && (
        <aside 
          style={{ width: `${sidebarWidth}px` }}
          className="bg-white border-r border-[#E5E7EB] shrink-0 sticky top-0 h-screen flex flex-col justify-between z-30 transition-[width] duration-75 relative select-none shadow-xs"
        >
          {/* Draggable Resize Handle */}
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

          <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            
            {/* Header: Exact Branding: WORKZO + Employer Portal */}
            <div className="h-20 px-5 flex items-center justify-between border-b border-[#E5E7EB] shrink-0">
              <Link to="/" className="flex items-center gap-3 min-w-0">
                <img src="/workzo-logo.png" alt="WORKZO" className="h-9 w-auto object-contain shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-black tracking-tight text-[#111827] leading-tight">WORKZO</div>
                  <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider leading-tight">Employer Portal</div>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                title="Collapse sidebar"
                className="p-1.5 text-[#71717A] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Action: Post New Job */}
            <div className="px-4 pt-4 pb-2 shrink-0">
              <button
                onClick={() => setActiveTab('post-job')}
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
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] h-18 px-6 sm:px-8 flex items-center justify-between shadow-3xs">
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Hide menu" : "Show menu"}
              className="p-2 rounded-xl text-[#71717A] hover:text-[#111827] hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2 border border-[#E5E7EB]"
            >
              <Menu className="w-5 h-5 text-[#111827]" />
              <span className="hidden sm:inline text-xs font-bold text-[#111827]">
                {sidebarOpen ? 'Menu' : 'Show Menu'}
              </span>
            </button>

            {!sidebarOpen && (
              <Link to="/" className="flex items-center gap-2">
                <img src="/workzo-logo.png" alt="WORKZO" className="h-8 w-auto object-contain" />
              </Link>
            )}

            <h1 className="text-base sm:text-lg font-bold text-[#111827] capitalize ml-1">
              {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Employer Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Switch to Candidate Portal */}
            <Link 
              to="/dashboard"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#71717A] hover:text-[#111827] hover:bg-slate-100 border border-[#E5E7EB] transition-colors"
            >
              <span>Candidate Portal</span>
              <ExternalLink className="w-3 h-3 text-[#71717A]" />
            </Link>

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
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3 z-50">
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
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                {company.name.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-[#111827]">{company.name}</span>
            </button>
          </div>
        </header>

        {/* Global Toast Success Banner */}
        {saveSuccessMsg && (
          <div className="bg-emerald-600 text-white text-xs font-semibold px-6 py-2.5 flex items-center justify-between shadow-xs">
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
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          
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
                  <p className="text-[11px] text-[#A1A1AA] mt-1">+18 this week</p>
                </div>
                <div 
                  onClick={() => setActiveTab('interviews')}
                  className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs hover:border-orange-300 transition-all cursor-pointer"
                >
                  <p className="text-xs font-medium text-[#71717A]">Interviews Scheduled</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{interviews.length}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">Next on Oct 6</p>
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
                {/* Upcoming Interview Card */}
                <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/50">
                        Next Video Interview
                      </span>
                      <button onClick={() => setActiveTab('interviews')} className="text-xs font-semibold text-orange-600 hover:underline">
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
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                    <span className="text-xs text-[#71717A]">Interviewer: {interviews[0]?.interviewer}</span>
                    <a 
                      href={interviews[0]?.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meeting</span>
                    </a>
                  </div>
                </div>

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
                          <td className="py-3 px-3 text-right space-x-2">
                            <button 
                              onClick={() => setActiveTab('applicants')}
                              className="text-xs font-semibold text-[#111827] hover:text-orange-600 underline cursor-pointer"
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
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
                          <strong>{job.applicantsCount}</strong> Applicants
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
                          onClick={() => handleDeleteJob(job.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-[#71717A] hover:text-red-600 cursor-pointer" 
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
                  <p className="text-xs text-[#71717A]">Review candidate resumes, shortlist for next round, or schedule interviews.</p>
                </div>
              </div>

              <div className="space-y-3">
                {applicants.map((a) => (
                  <div key={a.id} className="p-4 rounded-xl border border-[#E5E7EB] flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
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

                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => alert(`Downloading verified resume for ${a.name} (PDF)...`)}
                        className="px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-medium hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Resume</span>
                      </button>

                      <button 
                        onClick={() => {
                          const newStage = a.stage === 'shortlisted' ? 'applied' : 'shortlisted';
                          const newStatus = newStage === 'shortlisted' ? 'Shortlisted' : 'In Review';
                          setApplicants(applicants.map(app => app.id === a.id ? { ...app, stage: newStage, status: newStatus } : app));
                          showBanner(newStage === 'shortlisted' ? `${a.name} shortlisted!` : `${a.name} returned to review.`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                          a.stage === 'shortlisted' 
                            ? 'bg-orange-50 text-orange-600 border-orange-200' 
                            : 'bg-white text-[#111827] border-[#E5E7EB] hover:bg-slate-50'
                        }`}
                      >
                        {a.stage === 'shortlisted' ? 'Shortlisted ✓' : 'Shortlist'}
                      </button>

                      <button 
                        onClick={() => {
                          setScheduleCandidate(a);
                          setNewInterview({ ...newInterview, candidateName: a.name, role: a.role });
                          setScheduleModalOpen(true);
                        }}
                        className="bg-slate-900 hover:bg-black text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                ))}
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
                    setNewInterview({ candidateName: applicants[0]?.name || '', role: applicants[0]?.role || '', date: 'Oct 8, 2026', time: '11:00 AM', type: 'Technical Round', interviewer: 'David Vance' });
                    setScheduleModalOpen(true);
                  }}
                  className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Schedule Interview</span>
                </button>
              </div>

              <div className="space-y-3">
                {interviews.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-orange-200 bg-orange-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-100/80 px-2 py-0.5 rounded-md">
                          Video Call
                        </span>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#111827] mt-1">{item.candidateName} — {item.role}</h3>
                      <p className="text-xs text-[#71717A] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-600" />
                        <span>{item.date}</span>
                        <span>•</span>
                        <span>Round: <strong>{item.type}</strong></span>
                        <span>•</span>
                        <span>Interviewer: <strong>{item.interviewer}</strong></span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a 
                        href={item.link}
                        target="_blank"
                        rel="noreferrer"
                        className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Meeting</span>
                      </a>
                      <button 
                        onClick={() => {
                          setInterviews(interviews.filter(i => i.id !== item.id));
                          showBanner('Interview cancelled.');
                        }}
                        className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                        onClick={() => {
                          setApplicants(applicants.map(app => app.id === a.id ? { ...app, stage: 'hired', status: 'Hired', hiredDate: 'Oct 3, 2026', salaryAgreed: '$135,000 / yr' } : app));
                          showBanner(`Congratulations! ${a.name} marked as Hired!`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Mark as Hired
                      </button>
                      <button 
                        onClick={() => {
                          setScheduleCandidate(a);
                          setNewInterview({ ...newInterview, candidateName: a.name, role: a.role });
                          setScheduleModalOpen(true);
                        }} 
                        className="workzo-btn-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        Schedule Interview
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
                    </div>
                  </div>
                ))}
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
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E5E7EB]">
                  <button 
                    type="button" 
                    onClick={() => setScheduleModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="workzo-btn-primary px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Confirm & Send Invite
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Minimal Footer */}
        <footer className="border-t border-[#E5E7EB] bg-white py-5 px-8 text-xs text-[#71717A] flex items-center justify-between">
          <span>WORKZO Employer Portal</span>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="hover:text-orange-600">Switch to Candidate Portal</Link>
            <Link to="/" className="hover:text-orange-600">Home</Link>
          </div>
        </footer>

      </div>

    </div>
  );
}
