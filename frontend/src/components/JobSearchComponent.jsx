import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Heart, 
  CheckCircle2, 
  Briefcase, 
  X, 
  SlidersHorizontal, 
  Sparkles, 
  Calendar, 
  IndianRupee, 
  DollarSign, 
  Building2, 
  Clock, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Comprehensive default job listings matching user specifications
export const DEFAULT_JOBS = [
  {
    id: 101,
    title: 'Java Full Stack Developer',
    company: 'ABC Technologies',
    isVerified: true,
    location: 'Chennai',
    workMode: 'Hybrid',
    salary: '₹5–8 LPA',
    salaryMin: 5,
    salaryMax: 8,
    type: 'Full Time',
    experience: '2–5 Years',
    skills: ['Java', 'Spring Boot', 'React', 'SQL'],
    postedText: 'Posted 2 days ago',
    postedDaysAgo: 2,
    description: 'We are seeking a proactive Java Full Stack Developer to build high-performance microservices, robust REST APIs, and dynamic React user interfaces. You will work in a fast-paced agile pod delivering enterprise-grade web applications.',
    responsibilities: [
      'Design, build, and maintain efficient, reusable, and reliable Java & Spring Boot microservices.',
      'Develop modern, responsive frontend components using React and state management libraries.',
      'Write optimized SQL queries, database migrations, and stored procedures.',
      'Collaborate with product managers and QA to ensure seamless CI/CD releases.'
    ],
    requirements: [
      '2 to 5 years of hands-on experience in Java, Spring Boot, and relational databases (SQL).',
      'Strong proficiency in React.js, JavaScript (ES6+), and HTML5/CSS3.',
      'Experience with RESTful APIs, Git, and Docker.',
      'Good understanding of database indexing and performance tuning.'
    ]
  },
  {
    id: 102,
    title: 'Senior Frontend Engineer',
    company: 'Veloce Labs',
    isVerified: true,
    location: 'Bangalore',
    workMode: 'Remote',
    salary: '₹18–26 LPA',
    salaryMin: 18,
    salaryMax: 26,
    type: 'Full Time',
    experience: '5+ Years',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'SQL'],
    postedText: 'Posted today',
    postedDaysAgo: 0,
    description: 'Lead the next generation of our flagship SaaS frontend. You will architect modular component systems, optimize web core vitals, and work closely with design leadership.',
    responsibilities: [
      'Architect resilient frontend architectures using React, TypeScript, and modern build tooling.',
      'Champion web performance, accessibility (a11y), and code maintainability.',
      'Mentor mid-level engineers and conduct comprehensive architectural code reviews.'
    ],
    requirements: [
      '5+ years of extensive experience building scalable Single Page Applications.',
      'Deep mastery of React internals, TypeScript, and modern CSS frameworks.',
      'Proven track record in high-traffic web performance optimization.'
    ]
  },
  {
    id: 103,
    title: 'Python / AI Backend Engineer',
    company: 'DataPulse AI',
    isVerified: true,
    location: 'Hyderabad',
    workMode: 'Hybrid',
    salary: '₹12–20 LPA',
    salaryMin: 12,
    salaryMax: 20,
    type: 'Full Time',
    experience: '2–5 Years',
    skills: ['Python', 'SQL', 'FastAPI', 'React'],
    postedText: 'Posted 3 days ago',
    postedDaysAgo: 3,
    description: 'Join our AI engineering squad developing real-time inference pipelines, asynchronous APIs, and intelligent data aggregation engines.',
    responsibilities: [
      'Develop asynchronous backend services with FastAPI and Python.',
      'Design complex SQL schemas, vector search stores, and data caching layers.',
      'Integrate LLM API gateways and background batch processing workers.'
    ],
    requirements: [
      '2 to 5 years of Python backend engineering with SQL/PostgreSQL.',
      'Familiarity with FastAPI/Django and asynchronous programming.',
      'Experience building or consuming RESTful APIs.'
    ]
  },
  {
    id: 104,
    title: 'Junior Java Developer (Fresher)',
    company: 'CogniSpark Solutions',
    isVerified: true,
    location: 'Chennai',
    workMode: 'On-site',
    salary: '₹4–6 LPA',
    salaryMin: 4,
    salaryMax: 6,
    type: 'Full Time',
    experience: 'Fresher',
    skills: ['Java', 'SQL', 'Spring Boot'],
    postedText: 'Posted 4 days ago',
    postedDaysAgo: 4,
    description: 'Great launchpad for fresh engineering graduates with strong core Java fundamentals and knowledge of SQL relational databases.',
    responsibilities: [
      'Assist senior engineers in writing clean Java code and unit tests.',
      'Implement database CRUD queries and maintain API documentation.',
      'Participate in daily standups and sprint retrospectives.'
    ],
    requirements: [
      'B.Tech/B.E. or MCA in Computer Science or related IT discipline.',
      'Strong problem-solving skills in Core Java and Object-Oriented Design.',
      'Basic knowledge of SQL queries and relational databases.'
    ]
  },
  {
    id: 105,
    title: 'React & Frontend Intern',
    company: 'FinTech Labs',
    isVerified: true,
    location: 'Bangalore',
    workMode: 'Remote',
    salary: '₹25k–₹40k / mo',
    salaryMin: 3,
    salaryMax: 5,
    type: 'Internship',
    experience: 'Fresher',
    skills: ['React', 'JavaScript', 'HTML/CSS'],
    postedText: 'Posted today',
    postedDaysAgo: 0,
    description: 'Paid 6-month internship with mentorship from senior developers. Opportunity for full-time conversion based on performance.',
    responsibilities: [
      'Build reusable UI components in React and modern CSS.',
      'Fix UI bugs, improve responsiveness, and integrate REST endpoints.'
    ],
    requirements: [
      'Final year student or recent graduate with passion for web design and frontend tech.',
      'Hands-on portfolio or GitHub repositories showcasing React projects.'
    ]
  },
  {
    id: 106,
    title: 'Full Stack React & Node Developer',
    company: 'Zenith Digital',
    isVerified: true,
    location: 'Mumbai',
    workMode: 'Remote',
    salary: '₹10–16 LPA',
    salaryMin: 10,
    salaryMax: 16,
    type: 'Full Time',
    experience: '2–5 Years',
    skills: ['React', 'SQL', 'Python', 'Node.js'],
    postedText: 'Posted 1 day ago',
    postedDaysAgo: 1,
    description: 'Join a cross-functional team building innovative customer loyalty and retail checkout systems across web and mobile platforms.',
    responsibilities: [
      'Deliver features across the entire stack from database schema to UI components.',
      'Coordinate with product designers to implement pixel-perfect user journeys.'
    ],
    requirements: [
      'Strong proficiency in React and Node.js or Python.',
      'Experience with SQL database queries and caching.'
    ]
  },
  {
    id: 107,
    title: 'Cloud DevOps Specialist',
    company: 'CloudScale Networks',
    isVerified: true,
    location: 'Pune',
    workMode: 'Hybrid',
    salary: '₹14–22 LPA',
    salaryMin: 14,
    salaryMax: 22,
    type: 'Contract',
    experience: '5+ Years',
    skills: ['Python', 'SQL', 'Docker', 'Kubernetes'],
    postedText: 'Posted 5 days ago',
    postedDaysAgo: 5,
    description: 'Lead containerization, infrastructure-as-code automation, and automated deployment pipelines for enterprise multi-cloud setups.',
    responsibilities: [
      'Maintain Kubernetes clusters and automated CI/CD pipelines.',
      'Automate cloud infrastructure monitoring, alerting, and cost optimization.'
    ],
    requirements: [
      '5+ years in DevOps / SRE role with Kubernetes and Cloud infrastructure.',
      'Scripting proficiency in Python or Bash.'
    ]
  },
  {
    id: 108,
    title: 'Software Development Engineer in Test (SDET)',
    company: 'Apex Systems',
    isVerified: true,
    location: 'Delhi NCR',
    workMode: 'Hybrid',
    salary: '₹8–13 LPA',
    salaryMin: 8,
    salaryMax: 13,
    type: 'Full Time',
    experience: '0–2 Years',
    skills: ['Java', 'Python', 'SQL'],
    postedText: 'Posted 6 days ago',
    postedDaysAgo: 6,
    description: 'Build automated test suites, end-to-end integration harnesses, and continuous performance regression monitors.',
    responsibilities: [
      'Develop automated test frameworks in Java or Python.',
      'Perform API automation and validate SQL database consistency.'
    ],
    requirements: [
      '0 to 2 years experience in automated testing with Java or Python.',
      'Solid understanding of QA methodologies and test planning.'
    ]
  }
];

export default function JobSearchComponent({ 
  onApply, 
  appliedJobIds = [], 
  onSave, 
  savedJobIds = [],
  isDashboardEmbedded = false 
}) {
  const navigate = useNavigate();

  // Top Search Inputs
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // Active Submitted Search Terms
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  // Filter States
  const [jobType, setJobType] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [experience, setExperience] = useState('All');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [postedDate, setPostedDate] = useState('All');

  // Sort State
  const [sortBy, setSortBy] = useState('relevance');

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Job Details Modal State
  const [selectedJob, setSelectedJob] = useState(null);

  // Local Save / Apply State (Synchronized with localStorage)
  const [localSavedIds, setLocalSavedIds] = useState(() => {
    if (savedJobIds.length > 0) return savedJobIds;
    try {
      const saved = JSON.parse(localStorage.getItem('workzo_candidate_saved_jobs') || '[]');
      return saved.map(j => j.id);
    } catch {
      return [];
    }
  });

  const [localAppliedIds, setLocalAppliedIds] = useState(() => {
    if (appliedJobIds.length > 0) return appliedJobIds;
    try {
      const apps = JSON.parse(localStorage.getItem('workzo_candidate_applications') || '[]');
      return apps.map(a => a.jobId);
    } catch {
      return [];
    }
  });

  // Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2800);
  };

  // Combine Default Jobs with any Employer-created jobs from localStorage
  const allAvailableJobs = useMemo(() => {
    try {
      const employerJobs = JSON.parse(localStorage.getItem('workzo_employer_jobs') || '[]');
      if (Array.isArray(employerJobs) && employerJobs.length > 0) {
        const mapped = employerJobs.map(ej => ({
          id: ej.id,
          title: ej.title,
          company: ej.company || 'Verified Employer',
          isVerified: true,
          location: ej.location || 'Remote',
          workMode: ej.location?.toLowerCase().includes('remote') ? 'Remote' : (ej.location?.toLowerCase().includes('hybrid') ? 'Hybrid' : 'On-site'),
          salary: ej.salary || 'Competitive',
          salaryMin: 6,
          salaryMax: 15,
          type: ej.type || 'Full Time',
          experience: '2–5 Years',
          skills: Array.isArray(ej.skills) && ej.skills.length > 0 ? ej.skills : ['Java', 'React', 'SQL'],
          postedText: ej.postedDate ? `Posted on ${ej.postedDate}` : 'Posted recently',
          postedDaysAgo: 1,
          description: ej.description || 'Exciting career opportunity with our engineering and product team.',
          responsibilities: [
            'Collaborate with product and design to craft scalable features.',
            'Maintain high code quality and participate in peer reviews.'
          ],
          requirements: [
            'Proven experience in modern web software engineering.',
            'Clear communication skills and agile team experience.'
          ]
        }));
        
        // Merge without duplicating IDs
        const existingIds = new Set(DEFAULT_JOBS.map(j => j.id));
        const filteredEmployerJobs = mapped.filter(j => !existingIds.has(j.id));
        return [...filteredEmployerJobs, ...DEFAULT_JOBS];
      }
    } catch (_) {}
    return DEFAULT_JOBS;
  }, []);

  // Top Search Handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchQuery(searchInput.trim());
    setLocationQuery(locationInput.trim());
  };

  // Toggle Skill Filter Chip
  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Clear All Filters
  const handleClearFilters = () => {
    setSearchInput('');
    setLocationInput('');
    setSearchQuery('');
    setLocationQuery('');
    setJobType('All');
    setWorkMode('All');
    setExperience('All');
    setSalaryMin('');
    setSalaryMax('');
    setSelectedSkills([]);
    setPostedDate('All');
    setSortBy('relevance');
    showToast('Filters cleared');
  };

  // Filter & Sort Pipeline
  const filteredJobs = useMemo(() => {
    let result = allAvailableJobs.filter(job => {
      // 1. Title or Skill Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.company.toLowerCase().includes(q);
        const matchesSkills = job.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }

      // 2. Location Query
      if (locationQuery) {
        const loc = locationQuery.toLowerCase();
        const matchesLoc = job.location.toLowerCase().includes(loc);
        const matchesMode = job.workMode.toLowerCase().includes(loc);
        if (!matchesLoc && !matchesMode) return false;
      }

      // 3. Job Type
      if (jobType !== 'All') {
        const normJobType = job.type.toLowerCase().replace(/[- ]/g, '');
        const normFilter = jobType.toLowerCase().replace(/[- ]/g, '');
        if (normJobType !== normFilter) return false;
      }

      // 4. Work Mode
      if (workMode !== 'All') {
        if (job.workMode.toLowerCase() !== workMode.toLowerCase()) return false;
      }

      // 5. Experience
      if (experience !== 'All') {
        if (job.experience !== experience) return false;
      }

      // 6. Salary Filter (LPA)
      if (salaryMin) {
        const minVal = parseFloat(salaryMin);
        if (!isNaN(minVal) && job.salaryMax < minVal) return false;
      }
      if (salaryMax) {
        const maxVal = parseFloat(salaryMax);
        if (!isNaN(maxVal) && job.salaryMin > maxVal) return false;
      }

      // 7. Skills Selected
      if (selectedSkills.length > 0) {
        // Job must contain at least one of the selected skills
        const hasSkill = selectedSkills.some(reqSkill => 
          job.skills.some(js => js.toLowerCase() === reqSkill.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      // 8. Posted Date
      if (postedDate === 'Today') {
        if (job.postedDaysAgo > 0) return false;
      } else if (postedDate === 'Last 7 Days') {
        if (job.postedDaysAgo > 7) return false;
      } else if (postedDate === 'Last 30 Days') {
        if (job.postedDaysAgo > 30) return false;
      }

      return true;
    });

    // Sort Pipeline
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') {
        return a.postedDaysAgo - b.postedDaysAgo;
      }
      if (sortBy === 'salaryHigh') {
        return b.salaryMax - a.salaryMax;
      }
      if (sortBy === 'salaryLow') {
        return a.salaryMin - b.salaryMin;
      }
      // 'relevance' (default)
      return 0;
    });

    return result;
  }, [allAvailableJobs, searchQuery, locationQuery, jobType, workMode, experience, salaryMin, salaryMax, selectedSkills, postedDate, sortBy]);

  // Handle Save / Bookmark Job
  const handleToggleSave = (job, e) => {
    if (e) e.stopPropagation();
    const isSaved = localSavedIds.includes(job.id);
    let nextIds;
    if (isSaved) {
      nextIds = localSavedIds.filter(id => id !== job.id);
      showToast(`Removed "${job.title}" from saved jobs`);
    } else {
      nextIds = [...localSavedIds, job.id];
      showToast(`Saved "${job.title}" to bookmarked jobs ♡`);
    }
    setLocalSavedIds(nextIds);

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('workzo_candidate_saved_jobs') || '[]');
      let updated;
      if (isSaved) {
        updated = existing.filter(j => j.id !== job.id);
      } else {
        updated = [...existing, job];
      }
      localStorage.setItem('workzo_candidate_saved_jobs', JSON.stringify(updated));
    } catch (_) {}

    if (onSave) onSave(job);
  };

  // Handle Apply Now
  const handleApplyClick = (job, e) => {
    if (e) e.stopPropagation();
    if (localAppliedIds.includes(job.id)) {
      showToast('You have already applied to this job position.');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('workzo_token');
    const user = JSON.parse(localStorage.getItem('workzo_user') || '{}');

    if (!token) {
      // Guide visitor to log in or register as candidate
      showToast('Please sign in or create an account to submit your application.');
      setTimeout(() => {
        navigate('/login?role=candidate');
      }, 700);
      return;
    }

    if (user.role === 'employer') {
      showToast('Employer accounts cannot apply to jobs. Please switch to a Candidate account.');
      return;
    }

    // Apply action
    const nextApplied = [...localAppliedIds, job.id];
    setLocalAppliedIds(nextApplied);

    try {
      const existing = JSON.parse(localStorage.getItem('workzo_candidate_applications') || '[]');
      const newApp = {
        id: Date.now(),
        jobId: job.id,
        role: job.title,
        company: job.company,
        appliedDate: 'Today',
        status: 'Applied',
        statusType: 'neutral'
      };
      localStorage.setItem('workzo_candidate_applications', JSON.stringify([newApp, ...existing]));
    } catch (_) {}

    showToast(`Application submitted successfully for "${job.title}"! ✓`);

    if (onApply) onApply(job);
  };

  const popularSkillsList = ['Java', 'React', 'SQL', 'Python', 'Spring Boot', 'TypeScript', 'Node.js', 'FastAPI'];

  return (
    <div className="w-full space-y-6 font-sans">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111827] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700/60 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP JOB SEARCH BAR */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-3 sm:p-4 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-stretch gap-2.5">
          {/* Search Job Title or Skills */}
          <div className="flex-1 relative flex items-center rounded-xl bg-slate-50/80 border border-[#E5E7EB] hover:border-slate-300 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <Search className="w-4.5 h-4.5 text-[#71717A] absolute left-3.5 pointer-events-none" />
            <input 
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search job title or skills (e.g. Java, React, SQL)"
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-[#111827] placeholder-[#A1A1AA] bg-transparent outline-none font-medium"
            />
            {searchInput && (
              <button 
                type="button" 
                onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Location Input */}
          <div className="sm:w-72 relative flex items-center rounded-xl bg-slate-50/80 border border-[#E5E7EB] hover:border-slate-300 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <MapPin className="w-4.5 h-4.5 text-[#71717A] absolute left-3.5 pointer-events-none" />
            <input 
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Location (e.g. Chennai, Remote)"
              className="w-full pl-10 pr-4 py-3 text-xs sm:text-sm text-[#111827] placeholder-[#A1A1AA] bg-transparent outline-none font-medium"
            />
            {locationInput && (
              <button 
                type="button" 
                onClick={() => { setLocationInput(''); setLocationQuery(''); }}
                className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Button & Mobile Filter Trigger */}
          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-initial workzo-btn-primary px-7 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden p-3 rounded-xl border border-[#E5E7EB] bg-slate-50 text-[#111827] flex items-center gap-1.5 text-xs font-bold hover:bg-slate-100 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <span>Filters</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. MAIN CONTENT LAYOUT: FILTERS (LEFT) + RESULTS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================== */}
        {/* FILTER PANEL (FILTER JOBS)                               */}
        {/* ======================================================== */}
        <aside className={`
          lg:col-span-4 xl:col-span-3 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-2xs space-y-6
          ${mobileFilterOpen ? 'block' : 'hidden lg:block'}
        `}>
          {/* Panel Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-orange-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#111827]">
                FILTER JOBS
              </h3>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 hover:underline cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          {/* Filter 1: Job Type */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide">
              Job Type
            </label>
            <div className="space-y-1.5 text-xs text-[#4B5563]">
              {['All', 'Full Time', 'Part Time', 'Internship', 'Contract'].map((type) => (
                <label 
                  key={type} 
                  className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input 
                    type="radio" 
                    name="jobType"
                    checked={jobType === type}
                    onChange={() => setJobType(type)}
                    className="w-3.5 h-3.5 text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
                  />
                  <span className={jobType === type ? 'font-bold text-[#111827]' : 'font-medium'}>
                    {type === 'All' ? 'All Types' : type}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter 2: Work Mode */}
          <div className="space-y-2.5 pt-3 border-t border-[#E5E7EB]">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide">
              Work Mode
            </label>
            <div className="space-y-1.5 text-xs text-[#4B5563]">
              {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                <label 
                  key={mode} 
                  className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input 
                    type="radio" 
                    name="workMode"
                    checked={workMode === mode}
                    onChange={() => setWorkMode(mode)}
                    className="w-3.5 h-3.5 text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
                  />
                  <span className={workMode === mode ? 'font-bold text-[#111827]' : 'font-medium'}>
                    {mode === 'All' ? 'All Modes' : mode}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter 3: Experience */}
          <div className="space-y-2.5 pt-3 border-t border-[#E5E7EB]">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide">
              Experience
            </label>
            <div className="space-y-1.5 text-xs text-[#4B5563]">
              {['All', 'Fresher', '0–2 Years', '2–5 Years', '5+ Years'].map((exp) => (
                <label 
                  key={exp} 
                  className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input 
                    type="radio" 
                    name="experience"
                    checked={experience === exp}
                    onChange={() => setExperience(exp)}
                    className="w-3.5 h-3.5 text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
                  />
                  <span className={experience === exp ? 'font-bold text-[#111827]' : 'font-medium'}>
                    {exp === 'All' ? 'Any Experience' : exp}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter 4: Salary Range (LPA) */}
          <div className="space-y-2.5 pt-3 border-t border-[#E5E7EB]">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide">
              Salary (LPA)
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="number"
                  placeholder="Minimum"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#E5E7EB] bg-slate-50/70 text-[#111827] outline-none focus:border-orange-500 focus:bg-white text-center font-medium"
                />
              </div>
              <span className="text-xs text-[#A1A1AA] font-bold">—</span>
              <div className="relative flex-1">
                <input 
                  type="number"
                  placeholder="Maximum"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  className="w-full p-2 text-xs rounded-xl border border-[#E5E7EB] bg-slate-50/70 text-[#111827] outline-none focus:border-orange-500 focus:bg-white text-center font-medium"
                />
              </div>
            </div>
          </div>

          {/* Filter 5: Skills */}
          <div className="space-y-2.5 pt-3 border-t border-[#E5E7EB]">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide">
              Skills
            </label>
            <div className="flex flex-wrap gap-1.5">
              {popularSkillsList.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                      active
                        ? 'bg-orange-500 text-white border-orange-500 shadow-3xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-[#4B5563] border-[#E5E7EB]'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter 6: Posted Date */}
          <div className="space-y-2.5 pt-3 border-t border-[#E5E7EB]">
            <label className="block text-xs font-bold text-[#111827] uppercase tracking-wide">
              Posted
            </label>
            <div className="space-y-1.5 text-xs text-[#4B5563]">
              {['All', 'Today', 'Last 7 Days', 'Last 30 Days'].map((date) => (
                <label 
                  key={date} 
                  className="flex items-center gap-2.5 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <input 
                    type="radio" 
                    name="postedDate"
                    checked={postedDate === date}
                    onChange={() => setPostedDate(date)}
                    className="w-3.5 h-3.5 text-orange-600 border-slate-300 focus:ring-orange-500 cursor-pointer accent-orange-600"
                  />
                  <span className={postedDate === date ? 'font-bold text-[#111827]' : 'font-medium'}>
                    {date === 'All' ? 'Any Time' : date}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Clear Filters Button at the bottom */}
          <div className="pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E5E7EB] hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-[#4B5563] hover:text-[#111827] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* JOB RESULTS (RIGHT)                                     */}
        {/* ======================================================== */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-4">
          
          {/* Results Sort Bar */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div>
              <p className="text-sm font-extrabold text-[#111827]">
                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
              </p>
              {(searchQuery || locationQuery || jobType !== 'All' || workMode !== 'All' || selectedSkills.length > 0) && (
                <p className="text-[11px] text-[#71717A] mt-0.5">
                  Filtered by active search and filter constraints.
                </p>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <label htmlFor="jobSortSelect" className="text-xs font-semibold text-[#71717A] whitespace-nowrap">
                Sort by:
              </label>
              <div className="relative">
                <select
                  id="jobSortSelect"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-slate-50 border border-[#E5E7EB] hover:border-slate-300 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-bold text-[#111827] outline-none focus:border-orange-500 cursor-pointer shadow-3xs"
                >
                  <option value="relevance">Relevance</option>
                  <option value="newest">Newest</option>
                  <option value="salaryHigh">Salary High → Low</option>
                  <option value="salaryLow">Salary Low → High</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Job Results List */}
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E5E7EB] p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#111827]">No Jobs Match Your Filters</h3>
              <p className="text-xs text-[#71717A] max-w-sm mx-auto">
                Try loosening your filters, removing skills, or clearing your search criteria to see all open jobs.
              </p>
              <button
                type="button"
                onClick={handleClearFilters}
                className="workzo-btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shadow-xs mt-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredJobs.map((job) => {
                const isSaved = localSavedIds.includes(job.id);
                const isApplied = localAppliedIds.includes(job.id);

                return (
                  <article 
                    key={job.id} 
                    className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-orange-300 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
                  >
                    <div>
                      {/* Top Row: Title + Save Heart */}
                      <div className="flex items-start justify-between gap-3">
                        <h4 
                          onClick={() => setSelectedJob(job)}
                          className="text-base sm:text-lg font-bold text-[#111827] hover:text-orange-600 cursor-pointer transition-colors"
                        >
                          {job.title}
                        </h4>

                        <button
                          type="button"
                          onClick={(e) => handleToggleSave(job, e)}
                          className={`p-2 rounded-xl border text-xs cursor-pointer transition-all duration-150 shrink-0 ${
                            isSaved
                              ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                              : 'bg-white border-[#E5E7EB] text-slate-400 hover:text-rose-500 hover:border-rose-200'
                          }`}
                          title={isSaved ? "Saved Job" : "Save this Job"}
                          aria-label={isSaved ? "Saved Job" : "Save this Job"}
                        >
                          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Second Row: Company + Verified Checkmark */}
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-xs sm:text-sm font-semibold text-[#111827]">
                          {job.company}
                        </span>
                        {job.isVerified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified ✓</span>
                          </span>
                        )}
                      </div>

                      {/* Third Row: Location • Work Mode */}
                      <p className="text-xs text-[#71717A] mt-2 flex items-center gap-1.5 flex-wrap font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#4B5563]">{job.workMode}</span>
                      </p>

                      {/* Fourth Row: Salary • Job Type */}
                      <p className="text-xs text-[#111827] mt-1.5 flex items-center gap-1.5 flex-wrap font-bold">
                        <span className="text-orange-600">{job.salary}</span>
                        <span className="text-[#A1A1AA] font-normal">•</span>
                        <span className="text-[#4B5563] font-semibold">{job.type}</span>
                        {job.experience && (
                          <>
                            <span className="text-[#A1A1AA] font-normal">•</span>
                            <span className="text-[11px] font-medium text-[#71717A] bg-slate-100 px-2 py-0.2 rounded-md">
                              {job.experience}
                            </span>
                          </>
                        )}
                      </p>

                      {/* Fifth Row: Skills Badges */}
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        {job.skills.map((skill, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-[#4B5563] border border-slate-200/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Row: Posted Date + Actions */}
                    <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{job.postedText}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        {/* [ View Job ] Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedJob(job)}
                          className="px-4 py-2 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-xs font-bold text-[#111827] transition-colors cursor-pointer"
                        >
                          View Job
                        </button>

                        {/* [ Apply Now ] Button */}
                        <button
                          type="button"
                          onClick={(e) => handleApplyClick(job, e)}
                          disabled={isApplied}
                          className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
                            isApplied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                              : 'workzo-btn-primary active:scale-95'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Applied ✓</span>
                            </>
                          ) : (
                            <>
                              <span>Apply Now</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. VIEW JOB DETAILS MODAL                                */}
      {/* ======================================================== */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setSelectedJob(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                  {selectedJob.type}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-[#4B5563]">
                  {selectedJob.workMode}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] mt-2">
                {selectedJob.title}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-[#4B5563]">{selectedJob.company}</span>
                {selectedJob.isVerified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.2 rounded-md">
                    Verified Employer ✓
                  </span>
                )}
              </div>
            </div>

            {/* Key Information Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-slate-50 border border-[#E5E7EB] rounded-2xl text-xs">
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold block">Salary</span>
                <span className="font-extrabold text-orange-600 mt-0.5 block">{selectedJob.salary}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold block">Location</span>
                <span className="font-bold text-[#111827] mt-0.5 block">{selectedJob.location}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold block">Experience</span>
                <span className="font-bold text-[#111827] mt-0.5 block">{selectedJob.experience || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#A1A1AA] uppercase font-bold block">Posted</span>
                <span className="font-bold text-[#111827] mt-0.5 block">{selectedJob.postedText}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                Job Overview
              </h4>
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {selectedJob.description}
              </p>
            </div>

            {/* Key Responsibilities */}
            {selectedJob.responsibilities && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Key Responsibilities
                </h4>
                <ul className="space-y-1.5 text-xs text-[#4B5563]">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {selectedJob.requirements && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Required Qualifications
                </h4>
                <ul className="space-y-1.5 text-xs text-[#4B5563]">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
                Skills & Technologies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob.skills.map((s, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => handleToggleSave(selectedJob, e)}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors ${
                  localSavedIds.includes(selectedJob.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-[#E5E7EB] text-[#71717A] hover:bg-slate-50'
                }`}
              >
                <Heart className={`w-4 h-4 ${localSavedIds.includes(selectedJob.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{localSavedIds.includes(selectedJob.id) ? 'Saved' : 'Save for Later'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] hover:bg-slate-50 text-xs font-semibold text-[#4B5563] cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    handleApplyClick(selectedJob, e);
                  }}
                  disabled={localAppliedIds.includes(selectedJob.id)}
                  className={`workzo-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm ${
                    localAppliedIds.includes(selectedJob.id) ? 'opacity-80' : ''
                  }`}
                >
                  {localAppliedIds.includes(selectedJob.id) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Applied Already ✓</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
