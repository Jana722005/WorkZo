import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isDragging, setIsDragging] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Drag-to-resize logic for the sidebar
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
      // Clamp between 200px and 450px
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
  }, []);

  // Candidate Data
  const candidate = {
    name: 'Alex Rivera',
    title: 'Senior Frontend Engineer',
    email: 'alex.rivera@example.com',
    location: 'San Francisco, CA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    profileComplete: 85,
    skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Node.js', 'REST APIs', 'Git'],
    experience: '6+ years in frontend engineering and design systems',
    education: 'B.S. in Computer Science — Stanford University'
  };

  // Recent Applications Data
  const [applications, setApplications] = useState([
    {
      id: 1,
      company: 'Starlight Studio',
      role: 'Lead UI Engineer',
      appliedDate: 'Oct 2, 2026',
      status: 'Interview Scheduled',
      statusType: 'success'
    },
    {
      id: 2,
      company: 'Veloce Labs',
      role: 'Senior React Developer',
      appliedDate: 'Sep 29, 2026',
      status: 'In Review',
      statusType: 'warning'
    },
    {
      id: 3,
      company: 'CloudScale Inc.',
      role: 'Frontend Engineer',
      appliedDate: 'Sep 27, 2026',
      status: 'Shortlisted',
      statusType: 'info'
    },
    {
      id: 4,
      company: 'HyperFlow Software',
      role: 'Full Stack Engineer',
      appliedDate: 'Sep 24, 2026',
      status: 'Submitted',
      statusType: 'neutral'
    }
  ]);

  // Recommended / Available Jobs
  const [recommendedJobs, setRecommendedJobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      company: 'FinTech Pulse',
      location: 'Remote',
      salary: '$130k - $155k',
      type: 'Full-time',
      saved: false
    },
    {
      id: 2,
      title: 'Design Systems Developer',
      company: 'NotionCraft Media',
      location: 'New York, NY',
      salary: '$120k - $140k',
      type: 'Full-time',
      saved: true
    },
    {
      id: 3,
      title: 'Web Platform Lead',
      company: 'Global Stream Corp',
      location: 'Remote',
      salary: '$135k - $160k',
      type: 'Full-time',
      saved: false
    },
    {
      id: 4,
      title: 'React Core Developer',
      company: 'Apex Cloud',
      location: 'San Francisco, CA',
      salary: '$140k - $165k',
      type: 'Full-time',
      saved: false
    }
  ]);

  const toggleSaveJob = (id) => {
    setRecommendedJobs(prev => prev.map(j => j.id === id ? { ...j, saved: !j.saved } : j));
  };

  // Structured Sidebar Hierarchy
  const navSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'find-jobs', label: 'Find Jobs', icon: Search },
        { id: 'applications', label: 'My Applications', icon: Briefcase, count: applications.length },
        { id: 'saved-jobs', label: 'Saved Jobs', icon: Bookmark, count: recommendedJobs.filter(j => j.saved).length },
      ]
    },
    {
      title: 'CAREER',
      items: [
        { id: 'interviews', label: 'Interviews', icon: Calendar, badge: 'Live (2)' },
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'resume', label: 'My Resume', icon: FileText, badge: 'PDF' },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { id: 'verification', label: 'Verification', icon: ShieldCheck, badge: 'Verified' },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: 2 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#111827] flex font-sans overflow-x-hidden">
      
      {/* 1. Grouped Sidebar Hierarchy with Draggable Handle */}
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
                ? 'bg-orange-600 scale-y-125 shadow-sm' 
                : 'bg-slate-300 group-hover:bg-orange-500 group-hover:scale-y-110'
            }`}>
              <GripVertical className="w-3 h-3 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="flex flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {/* WORKZO Brand Header */}
            <div className="h-20 px-5 flex items-center justify-between border-b border-[#E5E7EB] shrink-0">
              <Link to="/" className="flex items-center gap-2 min-w-0">
                <img 
                  src="/workzo-logo.png" 
                  alt="WORKZO" 
                  className="h-10 w-auto object-contain shrink-0"
                />
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                title="Collapse sidebar"
                className="p-1.5 text-[#71717A] hover:text-[#111827] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <PanelLeftClose className="w-5 h-5" />
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
                        onClick={() => setActiveTab(item.id)}
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

                        {item.count !== undefined && (
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                            isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 text-[#71717A]'
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

            {/* Bottom Separator & Logout */}
            <div className="p-3.5 border-t border-[#E5E7EB] bg-[#FAFAF9]/80 shrink-0">
              <Link 
                to="/" 
                title="Sign out"
                className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#71717A] hover:text-orange-600 hover:bg-white rounded-xl border border-transparent hover:border-[#E5E7EB] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <LogOut className="w-4 h-4 text-[#71717A] shrink-0" />
                  <span>Logout</span>
                </div>
                <span className="text-[11px] text-[#A1A1AA]">Sign out</span>
              </Link>
            </div>

          </div>
        </aside>
      )}

      {/* 2. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar with Menu Icon Toggle */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] h-18 px-6 sm:px-8 flex items-center justify-between shadow-3xs">
          
          <div className="flex items-center gap-3">
            {/* Menu Icon Toggle */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? "Hide menu" : "Show menu"}
              className="p-2 rounded-xl text-[#71717A] hover:text-[#111827] hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2 border border-[#E5E7EB]"
            >
              <Menu className="w-5 h-5 text-orange-600" />
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
              {navSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 text-[#71717A] hover:text-[#111827] transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-orange-600" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-3 z-50">
                  <p className="text-xs font-bold text-[#111827] pb-2 border-b border-[#E5E7EB]">Notifications</p>
                  <div className="mt-2 space-y-2 text-xs">
                    <p className="p-2 bg-orange-50 rounded-lg text-orange-950 text-[11px]">
                      Interview with Veloce Labs scheduled for Monday at 10:30 AM.
                    </p>
                    <p className="p-2 bg-slate-50 rounded-lg text-[#71717A] text-[11px]">
                      Starlight Studio reviewed your application.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
              <img 
                src={candidate.avatar} 
                alt={candidate.name} 
                className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]"
              />
              <span className="hidden sm:inline text-xs font-bold text-[#111827]">{candidate.name}</span>
            </div>
          </div>
        </header>

        {/* 3. Dynamic Section Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          
          {/* TAB: DASHBOARD (Overview) */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#111827]">
                    Welcome back, {candidate.name} 👋
                  </h2>
                  <p className="text-xs sm:text-sm text-[#71717A] mt-1">
                    Here is an overview of your active applications, upcoming interviews, and profile status.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#71717A]">Profile {candidate.profileComplete}% complete</span>
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${candidate.profileComplete}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                  <p className="text-xs font-medium text-[#71717A]">Applied Jobs</p>
                  <p className="text-2xl font-bold text-[#111827] mt-1">14</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">4 active in review</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                  <p className="text-xs font-medium text-[#71717A]">In Review</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">6</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">Under employer review</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                  <p className="text-xs font-medium text-[#71717A]">Interviews</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">2 Scheduled</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-1">Next on Monday, Oct 6</p>
                </div>
              </div>

              {/* Upcoming Interview Card */}
              <div className="bg-white p-5 rounded-2xl border border-orange-200 bg-orange-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Upcoming Interview</span>
                    <h3 className="text-sm font-bold text-[#111827]">Senior React Developer • Veloce Labs</h3>
                    <p className="text-xs text-[#71717A] mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      <span>Monday, Oct 6 at 10:30 AM (PST) • Technical Round</span>
                    </p>
                  </div>
                </div>

                <button className="workzo-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer shadow-xs">
                  Join Video Room
                </button>
              </div>

              {/* Active Applications */}
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#111827]">Active Job Applications</h3>
                  <button onClick={() => setActiveTab('applications')} className="text-xs font-semibold text-orange-600 hover:underline">
                    View all ({applications.length}) →
                  </button>
                </div>

                <div className="divide-y divide-[#E5E7EB]">
                  {applications.map((app) => (
                    <div key={app.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-[#111827]">{app.role}</h4>
                        <p className="text-xs text-[#71717A] mt-0.5">{app.company} • Applied {app.appliedDate}</p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                        app.statusType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        app.statusType === 'warning' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        app.statusType === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB: FIND JOBS */}
          {activeTab === 'find-jobs' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs">
                <h2 className="text-lg font-bold text-[#111827] mb-3">Explore Available Jobs</h2>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Search by job title, skills, or company..." 
                    className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[#E5E7EB] outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />
                  <button className="workzo-btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
                    Search
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {recommendedJobs.map((job) => (
                  <div key={job.id} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-orange-200 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">{job.title}</h3>
                      <p className="text-xs text-[#71717A] mt-1">{job.company} • {job.location} • {job.salary} • {job.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggleSaveJob(job.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                          job.saved ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-white text-[#71717A] border-[#E5E7EB]'
                        }`}
                      >
                        {job.saved ? 'Saved' : 'Save'}
                      </button>
                      <button className="workzo-btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer">
                        1-Click Apply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MY APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">All Submitted Applications</h2>
              <div className="divide-y divide-[#E5E7EB]">
                {applications.map((app) => (
                  <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-[#111827]">{app.role}</h3>
                      <p className="text-xs text-[#71717A] mt-0.5">{app.company} • Applied on {app.appliedDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto ${
                      app.statusType === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      app.statusType === 'warning' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                      app.statusType === 'info' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: SAVED JOBS */}
          {activeTab === 'saved-jobs' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Bookmarked Jobs</h2>
              {recommendedJobs.filter(j => j.saved).length === 0 ? (
                <p className="text-xs text-[#71717A]">No saved jobs yet.</p>
              ) : (
                <div className="space-y-3">
                  {recommendedJobs.filter(j => j.saved).map((job) => (
                    <div key={job.id} className="p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#111827]">{job.title}</h3>
                        <p className="text-xs text-[#71717A]">{job.company} • {job.location}</p>
                      </div>
                      <button onClick={() => toggleSaveJob(job.id)} className="text-xs text-red-600 hover:underline">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: INTERVIEWS */}
          {activeTab === 'interviews' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Scheduled Interviews</h2>
              <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/30 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#111827]">Senior React Developer • Veloce Labs</h3>
                  <p className="text-xs text-[#71717A] mt-0.5">Monday, Oct 6 at 10:30 AM (PST) • Technical Round</p>
                </div>
                <button className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold">
                  Join Room
                </button>
              </div>
            </div>
          )}

          {/* TAB: MY PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-5">
              <h2 className="text-lg font-bold text-[#111827]">Personal & Professional Profile</h2>
              <div className="flex items-center gap-4">
                <img src={candidate.avatar} alt={candidate.name} className="w-16 h-16 rounded-full object-cover border" />
                <div>
                  <h3 className="text-base font-bold text-[#111827]">{candidate.name}</h3>
                  <p className="text-xs text-[#71717A]">{candidate.title} • {candidate.location}</p>
                  <p className="text-xs text-[#71717A] mt-0.5">{candidate.email}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-[#FAFAF9] border border-[#E5E7EB] rounded-lg text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1">Experience</h4>
                <p className="text-xs text-[#111827]">{candidate.experience}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#71717A] mb-1">Education</h4>
                <p className="text-xs text-[#111827]">{candidate.education}</p>
              </div>
            </div>
          )}

          {/* TAB: MY RESUME */}
          {activeTab === 'resume' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Resume Management</h2>
              <div className="p-5 border border-dashed border-[#E5E7EB] rounded-2xl text-center">
                <FileText className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-[#111827]">Alex_Rivera_Senior_Frontend_Resume.pdf</p>
                <p className="text-xs text-[#71717A] mt-0.5">Uploaded on Sep 28, 2026 • 240 KB</p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button className="px-4 py-2 text-xs font-semibold border border-[#E5E7EB] rounded-xl hover:bg-slate-50">
                    Preview Resume
                  </button>
                  <button className="workzo-btn-primary px-4 py-2 text-xs font-semibold rounded-xl">
                    Replace Resume
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VERIFICATION */}
          {activeTab === 'verification' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-[#111827]">Candidate Verification Status</h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111827]">Email Address ({candidate.email})</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">Verified</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111827]">Government ID / Identity Verification</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">Verified</span>
                </div>
                <div className="p-3.5 rounded-xl border border-[#E5E7EB] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#111827]">Education Credentials</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">Verified</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-[#111827]">Notifications Feed</h2>
              <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl text-xs">
                <p className="font-bold text-[#111827]">Interview Scheduled</p>
                <p className="text-[#71717A] mt-0.5">Veloce Labs scheduled a Technical Round for Monday at 10:30 AM.</p>
              </div>
              <div className="p-3 bg-slate-50 border border-[#E5E7EB] rounded-xl text-xs">
                <p className="font-bold text-[#111827]">Application Viewed</p>
                <p className="text-[#71717A] mt-0.5">Starlight Studio reviewed your candidate resume.</p>
              </div>
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
                  <p className="text-[#71717A]">Your profile is currently visible to verified employers on WORKZO.</p>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-[#E5E7EB] bg-white py-5 px-8 text-xs text-[#71717A] flex items-center justify-between">
          <span>WORKZO Candidate Portal</span>
          <Link to="/" className="hover:text-orange-600">Home</Link>
        </footer>

      </div>

    </div>
  );
}
