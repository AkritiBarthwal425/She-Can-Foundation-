'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Moon,
  Sun,
  Menu,
  X,
  Heart,
  Award,
  Users,
  MapPin,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Laptop,
  Compass,
  Check,
  Building,
  GraduationCap,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Sparkles,
  Globe,
  Info,
  Calendar
} from 'lucide-react';

interface Supporter {
  id: string;
  name: string;
  location: string;
  role: string;
  time: string;
}

interface CountryHub {
  id: 'cambodia' | 'rwanda' | 'guatemala' | 'liberia';
  name: string;
  emoji: string;
  flag: string;
  yearLaunched: string;
  scholarsCount: string;
  successStory: string;
  statText: string;
  primaryFocus: string;
}

export default function Page() {
  // Navigation & Menu States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Theme Setting
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Hero delay texts fade animation
  const [heroMounted, setHeroMounted] = useState(false);

  // Stats Counting Trigger state
  const statsSectionRef = useRef<HTMLDivElement>(null);
  const [statsTriggered, setStatsTriggered] = useState(false);
  const [statCounts, setStatCounts] = useState({
    scholars: 0,
    scholarships: 0,
    mentors: 0,
    returnRate: 0
  });

  // Country Selection State for Interactive Hub
  const [activeCountry, setActiveCountry] = useState<'cambodia' | 'rwanda' | 'guatemala' | 'liberia'>('cambodia');

  // Testimonials Slider State
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Partner College Info Modal State
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);

  // Volunteer form input states
  const [formInputs, setFormInputs] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'Academic Co-Pilot'
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [formStep, setFormStep] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formStatusText, setFormStatusText] = useState('');

  // Live Pledge Wall of Support (Allies & Mentors pledging)
  const [supporters, setSupporters] = useState<Supporter[]>([
    {
      id: '1',
      name: 'Sarah M.',
      location: 'Boston, MA',
      role: 'Life Transition Mentor',
      time: '15 mins ago'
    },
    {
      id: '2',
      name: 'David K.',
      location: 'San Francisco, CA',
      role: 'Academic Co-Pilot',
      time: '2 hours ago'
    },
    {
      id: '3',
      name: 'Ana G.',
      location: 'Austin, TX',
      role: 'University Coach',
      time: '5 hours ago'
    },
    {
      id: '4',
      name: 'Dr. John L.',
      location: 'New York, NY',
      role: 'Leadership Ally',
      time: '1 day ago'
    }
  ]);

  // Handle Scroll to adjust navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme Logic
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme === 'dark' || (!storedTheme && systemPrefersDark) ? 'dark' : 'light';

    const handle = requestAnimationFrame(() => {
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Hero text fade entry on mount
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setHeroMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  // Intersection Observer for counting stats animation
  useEffect(() => {
    const currentRef = statsSectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsTriggered) {
          setStatsTriggered(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [statsTriggered]);

  // Stat Counter Animation Logic
  useEffect(() => {
    if (!statsTriggered) return;

    const duration = 2000; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing out function
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);

      setStatCounts({
        scholars: Math.floor(easedProgress * 140),
        scholarships: Math.floor(easedProgress * 21),
        mentors: Math.floor(easedProgress * 650),
        returnRate: Math.floor(easedProgress * 90)
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setStatCounts({
          scholars: 140,
          scholarships: 21,
          mentors: 650,
          returnRate: 90
        });
      }
    };

    requestAnimationFrame(animate);
  }, [statsTriggered]);

  // Testimonials rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Volunteer Submission Handler
  const handleVolunteerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const { fullName, email, phone, role } = formInputs;

    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Please fill out all fields carefully.');
      return;
    }

    setFormStep('submitting');
    setFormStatusText('Linking with SHE-CAN mentor alliance matrix...');

    setTimeout(() => {
      setFormStatusText('Pre-registering support profile in leadership tract...');
      setTimeout(() => {
        setFormStatusText('Success! Updating Live Pledge Wall...');
        setTimeout(() => {
          setFormStep('success');
          // Add to local list of supporters
          const newSupporter: Supporter = {
            id: Date.now().toString(),
            name: fullName.length > 15 ? `${fullName.slice(0, 13)}...` : fullName,
            location: 'Mentor Candidate',
            role: role,
            time: 'Just now'
          };
          setSupporters((prev) => [newSupporter, ...prev]);
        }, 1000);
      }, 1000);
    }, 1200);
  };

  const resetForm = () => {
    setFormInputs({
      fullName: '',
      email: '',
      phone: '',
      role: 'Academic Co-Pilot'
    });
    setFormStep('idle');
  };

  const testimonials = [
    {
      text: "At Lafayette College, I didn't just earn a degree in Engineering; I learned I have a voice that can reshape Cambodia&apos;s clean energy regulations. My squad of 5 US mentors was there for my first winter coat, my final thesis defense, and my triumphant return to Phnom Penh.",
      name: "Sokanha Ly",
      role: "Global Scholar Graduate & Clean Tech Officer",
      location: "Cambodia Hub (Lafayette College '22)",
      initials: "SL"
    },
    {
      text: "Being supported by 5 distinct US mentors felt like having a personal board of directors. Throughout my hours at Bucknell, they reviewed essays, helped me land software engineering internships, and gave me the mental framework to return home and scale agricultural tech.",
      name: "Nadine Rugoji",
      role: "AgriTech Systems Lead",
      location: "Rwanda Hub (Bucknell University '21)",
      initials: "NR"
    },
    {
      text: "Guatemala&apos;s rural women have immense promise but zero infrastructure support. SHE-CAN broke the financial glass ceiling, securing my full-tuition scholarship. Major in International Affairs at Lewis & Clark empowered me to establish civic academies for rural girls.",
      name: "Gabriela Alvarado",
      role: "Civic Advocacy Advisor & Entrepreneur",
      location: "Guatemala Hub (Lewis & Clark '23)",
      initials: "GA"
    }
  ];

  const countryHubs: CountryHub[] = [
    {
      id: 'cambodia',
      name: 'Cambodia',
      emoji: '🇰🇭',
      flag: 'https://picsum.photos/seed/cambodiamini/400/250',
      yearLaunched: '2014',
      scholarsCount: '45+ Scholars Guided',
      successStory: 'Sokanha Ly graduated in engineering and returned to lead energy policy projects.',
      statText: '95% Graduation Rate',
      primaryFocus: 'STEM Academics, Policy Development, Solar Microgrids'
    },
    {
      id: 'rwanda',
      name: 'Rwanda',
      emoji: '🇷🇼',
      flag: 'https://picsum.photos/seed/rwandamini/400/250',
      yearLaunched: '2011',
      scholarsCount: '58+ Scholars Guided',
      successStory: 'Diane Umuhoza entered biomedical engineering and advises public health ministries in Kigali.',
      statText: '100% Return-to-Lead Ratio',
      primaryFocus: 'Biomedical, Agricultural Science, Civil Governance'
    },
    {
      id: 'guatemala',
      name: 'Guatemala',
      emoji: '🇬🇹',
      flag: 'https://picsum.photos/seed/guatemalamini/400/250',
      yearLaunched: '2018',
      scholarsCount: '22+ Scholars Guided',
      successStory: 'Debora Ortiz majored in Economics and founded a micro-finance cooperative for rural handcrafters.',
      statText: 'Expanding Regional Cohorts',
      primaryFocus: 'Social Entrepreneurship, Indigenous Rights, Economic Modeling'
    },
    {
      id: 'liberia',
      name: 'Liberia',
      emoji: '🇱🇷',
      flag: 'https://picsum.photos/seed/liberiamini/400/250',
      yearLaunched: '2020',
      scholarsCount: '15+ Scholars Guided',
      successStory: 'Princess Tarloh is studying public health with a focus on rebuilding maternal clinical hubs.',
      statText: 'Rising Medical Vanguard',
      primaryFocus: 'Epidemiological Research, Healthcare Administration, Clean Sanitation'
    }
  ];

  const partnerColleges = [
    { name: 'Lafayette College', location: 'Easton, PA', description: 'Strong partner in Engineering, Economics, and STEM leadership tracks.' },
    { name: 'Bucknell University', location: 'Lewisburg, PA', description: 'Hosts business administration and software technology cohorts.' },
    { name: 'Syracuse University', location: 'Syracuse, NY', description: 'Empowers scholars focused on journalism, policy, and public affairs.' },
    { name: 'Lehigh University', location: 'Bethlehem, PA', description: 'STEM incubator, backing technical and entrepreneurial leadership.' },
    { name: 'Lewis & Clark College', location: 'Portland, OR', description: 'Hub for international relations, global research, and climate science.' },
    { name: 'Muhlenberg College', location: 'Allentown, PA', description: 'Liberal arts powerhouse promoting local public engagement.' },
    { name: 'Gettysburg College', location: 'Gettysburg, PA', description: 'Fostering profound civic engagement, political modeling, and writing.' },
    { name: 'University of San Francisco', location: 'San Francisco, CA', description: 'Close ties to the S.F. leadership base, tech hubs, and corporate shadows.' }
  ];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-white text-text-dark dark:bg-slate-950 dark:text-gray-100 flex flex-col">
      
      {/* NAVBAR */}
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-primary/95 dark:bg-slate-900/95 shadow-lg py-4 backdrop-blur-sm text-white'
            : 'bg-transparent py-6 text-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#home" id="nav-logo" className="flex items-center gap-2 group">
            <span className="text-2xl">🌸</span>
            <span className="font-display font-semibold tracking-tight text-xl text-white">
              S.H.E. - C.A.N. <span className="text-accent dark:text-accent font-bold">Foundation</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <a href="#home" className="hover:text-accent transition-colors duration-200">Home</a>
            <a href="#about" className="hover:text-accent transition-colors duration-200">Our Model</a>
            <a href="#countries" className="hover:text-accent transition-colors duration-200">Global Hubs</a>
            <a href="#colleges" className="hover:text-accent transition-colors duration-200">Universities</a>
            <a href="#volunteer" className="hover:text-accent transition-colors duration-200">Join Alliance</a>
          </nav>

          {/* Toolbar Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              id="theme-toggler"
              className="p-2 rounded-full border border-white/25 hover:bg-white/10 transition-colors cursor-pointer text-accent focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 animate-spin-slow" />}
            </button>
            <a
              href="#volunteer"
              id="nav-donate-btn"
              className="px-5 py-2.5 rounded-full bg-accent hover:bg-amber-500 text-text-dark hover:scale-105 transition-all text-sm font-semibold tracking-wide shadow-md hover:shadow-accent/40"
            >
              Become a Mentor
            </a>
          </div>

          {/* Mobile Hamburg Trigger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full border border-white/20 hover:bg-white/10"
              aria-label="Toggle Dark Mode Mobile"
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5 text-accent" /> : <Sun className="w-4.5 h-4.5 text-accent" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-hamburg"
              className="p-2 rounded-lg border border-white/25 hover:bg-white/10 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Slide-Down Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary-dark/95 backdrop-blur-md border-t border-white/10 text-white animate-fade-in">
            <nav className="flex flex-col px-6 py-6 gap-4 font-medium">
              <a
                href="#home"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-accent border-b border-white/5"
              >
                Home
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-accent border-b border-white/5"
              >
                Our Model
              </a>
              <a
                href="#countries"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-accent border-b border-white/5"
              >
                Global Hubs
              </a>
              <a
                href="#colleges"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-accent border-b border-white/5"
              >
                Universities
              </a>
              <a
                href="#volunteer"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-accent"
              >
                Join Alliance
              </a>
              <div className="mt-4 pt-4 border-t border-white/10 flex gap-4">
                <a
                  href="#volunteer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-full bg-accent text-text-dark font-semibold text-sm"
                >
                  Apply to Mentor
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 bg-gradient-to-br from-primary-dark via-primary to-slate-900 text-white"
      >
        {/* Animated Floating Circles Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" id="hero-floating-container">
          <div className="absolute w-[200px] h-[200px] rounded-full bg-accent/10 blur-2xl animate-float-1 left-[15%] bottom-[-100px]"></div>
          <div className="absolute w-[320px] h-[320px] rounded-full bg-primary-light/10 blur-3xl animate-float-2 left-[50%] bottom-[-150px]"></div>
          <div className="absolute w-[180px] h-[180px] rounded-full bg-lavender/5 blur-xl animate-float-3 left-[75%] bottom-[-80px]"></div>
          <div className="absolute w-[250px] h-[250px] rounded-full bg-indigo-500/10 blur-2xl animate-float-4 left-[30%] bottom-[-120px]"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          {/* Tagline Badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold uppercase tracking-widest text-[#f5f1fd] shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            S.H.E. - C.A.N. GLOBAL MISSION
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl leading-tight tracking-tight mb-6">
            <span className={`block transition-all duration-700 delay-100 ${heroMounted ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'}`}>
              Supporting Her Education
            </span>
            <span className={`block text-accent transition-all duration-700 delay-400 ${heroMounted ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'} my-1`}>
              In Cooperation With Allies
            </span>
            <span className={`block text-primary-light transition-all duration-700 delay-700 ${heroMounted ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-6'}`}>
              In New Nations
            </span>
          </h1>

          <p className="text-body-lg text-lg md:text-xl text-lavender max-w-3xl font-light mb-10 leading-relaxed">
            We equip high-potential young female leaders from post-conflict and developing nations with the mentorship, fully-funded U.S. university scholarships, and corporate tools required to return home as local reform catalysts.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-md">
            <a
              href="#volunteer"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent text-text-dark font-semibold shadow-xl hover:shadow-accent/40 active:scale-95 transition-all text-center hover:bg-amber-400 group duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                Join a Mentor Squad
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </span>
            </a>
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium active:scale-95 transition-all text-center duration-300"
            >
              The 5-Mentor Model
            </a>
          </div>

          {/* Quick info highlights */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full border-t border-white/10 pt-10 text-center">
            <div>
              <div className="text-sm font-semibold uppercase text-accent">Cambodia &bull; Rwanda</div>
              <div className="text-xs text-lavender/70 font-light mt-1">Our founding country Hubs</div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase text-accent">Guatemala &bull; Liberia</div>
              <div className="text-xs text-lavender/70 font-light mt-1">Empowering regional cohorts</div>
            </div>
            <div>
              <div className="text-sm font-semibold uppercase text-accent">90%+ Return Rate</div>
              <div className="text-xs text-lavender/70 font-light mt-1">Returning home to assume prominent office</div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS BAR SECTION */}
      <section
        id="impact"
        ref={statsSectionRef}
        className="relative z-20 py-16 bg-primary-dark text-white border-y border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 items-center text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            
            <div className="flex flex-col gap-2 pt-6 lg:pt-0">
              <span id="stat-count-scholars" className="font-display font-black text-4xl md:text-5xl text-accent">
                {statCounts.scholars}+
              </span>
              <span className="text-xs uppercase font-light tracking-widest text-[#f5f1fd]">
                Scholars Enrolled
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-6 lg:pt-0">
              <span id="stat-count-scholarships" className="font-display font-black text-4xl md:text-5xl text-accent">
                ${statCounts.scholarships}M+
              </span>
              <span className="text-xs uppercase font-light tracking-widest text-[#f5f1fd]">
                Scholarships Secured
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-6 lg:pt-0">
              <span id="stat-count-mentors" className="font-display font-black text-4xl md:text-5xl text-accent">
                {statCounts.mentors}+
              </span>
              <span className="text-xs uppercase font-light tracking-widest text-[#f5f1fd]">
                Mentor Co-Pilots Registered
              </span>
            </div>

            <div className="flex flex-col gap-2 pt-6 lg:pt-0">
              <span id="stat-count-returnRate" className="font-display font-black text-4xl md:text-5xl text-accent">
                {statCounts.returnRate}%
              </span>
              <span className="text-xs uppercase font-light tracking-widest text-[#f5f1fd]">
                Return Home to Lead Rate
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* DETAILED MISSION SECTION & FOUNDER CONTEXT */}
      <section id="about" className="py-24 px-6 bg-lavender/10 dark:bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Detailed visual side */}
          <div className="lg:col-span-5 flex justify-center order-2 lg:order-1 relative">
            <div className="relative group max-w-sm">
              <div className="absolute inset-0 bg-primary/20 dark:bg-primary-light/15 blur-xl rounded-2xl transform scale-95 group-hover:scale-105 transition-transform duration-500"></div>
              
              <div className="relative border-4 border-thin p-1 rounded-2xl bg-white dark:bg-slate-800 -rotate-2 hover:rotate-0 transition-all duration-500 shadow-2xl">
                <Image
                  src="https://picsum.photos/seed/scholars/600/500"
                  alt="Young Cambodian and African scholars smiling in a group"
                  width={600}
                  height={500}
                  referrerPolicy="no-referrer"
                  className="rounded-xl object-cover w-full aspect-[4/3] md:aspect-auto shadow-inner"
                />
                <div className="absolute bottom-5 left-5 bg-primary-dark/85 backdrop-blur-sm text-white text-xs px-3.5 py-2 rounded-lg font-sans tracking-tight shadow-md flex items-center gap-2">
                  <span className="text-accent">★</span>
                  <span>S.H.E. - C.A.N. Global Model</span>
                </div>
              </div>
              
              {/* Highlight badge of the 5-Coaches Squad */}
              <div className="absolute -bottom-4 right-4 md:-bottom-6 md:-right-6 bg-accent text-text-dark px-5 py-4 rounded-xl shadow-xl flex items-center gap-3 transform hover:scale-105 transition-transform">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <div className="font-bold text-lg leading-none">5 Mentors</div>
                  <div className="text-[10px] uppercase font-bold leading-tight tracking-wider text-text-dark/80">Support Squad Per Scholar</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed narrative side */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-block px-3.5 py-1 text-xs font-semibold bg-primary/10 dark:bg-primary-light/20 text-primary dark:text-primary-light rounded-md uppercase tracking-wide">
              Founding Philosophy
            </div>
            
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-text-dark dark:text-white leading-tight">
              One Extraordinary Woman At A Time
            </h2>

            <p className="text-text-gray dark:text-gray-300 text-base leading-relaxed font-light">
              In 2011, founder <strong>Barbara Bylenga</strong> witnessed a pressing regional crisis: millions of dollars were spent on primary schooling, but post-conflict economies had a tragic vacuum of female leaders at the peak decision-making tier. High-potential women lacked paths to top-tier higher education.
            </p>

            <p className="text-text-gray dark:text-gray-300 text-base leading-relaxed font-light">
              <strong>S.H.E. - C.A.N.</strong> was created to solve this by building a rigorous launch platform. We identify talented girls, pair them with a squad of <strong>5 US Mentors</strong>, and help them unlock full scholarships to prestigious US Liberal Arts colleges. Most importantly, we guide their strategic career reintegration back home.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl flex items-start gap-3 shadow-sm hover:border-primary-light transition-all">
                <Check className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-text-dark dark:text-white">US College Access</h4>
                  <p className="text-xs text-text-gray dark:text-gray-400 mt-1">Preparation for IELTS/TOEFL and common app guidance.</p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl flex items-start gap-3 shadow-sm hover:border-primary-light transition-all">
                <Check className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-text-dark dark:text-white">Active Mentor Squads</h4>
                  <p className="text-xs text-text-gray dark:text-gray-400 mt-1">Five seasoned mentors forming a tight 5-year supportive hub.</p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl flex items-start gap-3 shadow-sm hover:border-primary-light transition-all">
                <Check className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-text-dark dark:text-white">Internships & Career Coaching</h4>
                  <p className="text-xs text-text-gray dark:text-gray-400 mt-1">Connecting scholars with summer career development paths.</p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl flex items-start gap-3 shadow-sm hover:border-primary-light transition-all">
                <Check className="w-5 h-5 text-primary-light flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-text-dark dark:text-white">Return To Lead Strategy</h4>
                  <p className="text-xs text-text-gray dark:text-gray-400 mt-1">Supporting graduation transitions back to homeland hubs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE UNIQUE "SQUAD OF 5" MENTOR MODEL BREAKDOWN */}
      <section id="mentors" className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 text-xs font-semibold bg-accent/20 text-primary-dark dark:text-accent rounded-md uppercase tracking-wider">
              An Asymmetry For Success
            </div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-text-dark dark:text-white leading-tight">
              The 5-Mentor Team Model Explained
            </h2>
            <p className="text-text-gray dark:text-gray-300 font-light text-base">
              A single mentor is great, but a <strong>Team of 5 focused experts</strong> creates an unstoppable support mechanism. Every scholar is backed by coordinates mapping:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            <div className="p-6 bg-lavender/10 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-light/50 transition-all text-center space-y-4 shadow-sm flex flex-col justify-between">
              <span className="text-3xl block">📖</span>
              <h3 className="font-display font-bold text-sm text-text-dark dark:text-white">1. Academic & Test Prep Coach</h3>
              <p className="text-xs text-text-gray dark:text-gray-400 font-light leading-relaxed">
                Drives aggressive prep for IELTS/TOEFL examinations, tutoring, writing assignments, and mock critical reasoning tasks.
              </p>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-primary-light/20 text-primary-dark dark:text-lavender py-1 rounded-md">Preparatory Hub</span>
            </div>

            <div className="p-6 bg-lavender/10 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-light/50 transition-all text-center space-y-4 shadow-sm flex flex-col justify-between">
              <span className="text-3xl block">📋</span>
              <h3 className="font-display font-bold text-sm text-text-dark dark:text-white">2. University Application Specialist</h3>
              <p className="text-xs text-text-gray dark:text-gray-400 font-light leading-relaxed">
                Assists with personal statements, common application paperwork, choosing strategic campuses, and submitting scholarship forms.
              </p>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-primary-light/20 text-primary-dark dark:text-lavender py-1 rounded-md">Admissions Step</span>
            </div>

            <div className="p-6 bg-lavender/10 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-light/50 transition-all text-center space-y-4 shadow-sm flex flex-col justify-between">
              <span className="text-3xl block">✈️</span>
              <h3 className="font-display font-bold text-sm text-text-dark dark:text-white">3. Logistics & Transit Coordinator</h3>
              <p className="text-xs text-text-gray dark:text-gray-400 font-light leading-relaxed">
                Works on embassy visa schedules, medical documentation, travel routes, and organizing structural student gear.
              </p>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-primary-light/20 text-primary-dark dark:text-lavender py-1 rounded-md">Departure Step</span>
            </div>

            <div className="p-6 bg-lavender/10 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-light/50 transition-all text-center space-y-4 shadow-sm flex flex-col justify-between">
              <span className="text-3xl block">🧥</span>
              <h3 className="font-display font-bold text-sm text-text-dark dark:text-white">4. Life & Integration Advisor</h3>
              <p className="text-xs text-text-gray dark:text-gray-400 font-light leading-relaxed">
                Helps scholars buy winter clothes on campus arrival, navigate cell plans, set up banks, and handle local culture shifts.
              </p>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-primary-light/20 text-primary-dark dark:text-lavender py-1 rounded-md">Campus Onboarding</span>
            </div>

            <div className="p-6 bg-lavender/10 dark:bg-slate-900/60 rounded-2xl border border-gray-100 dark:border-slate-800 hover:border-primary-light/50 transition-all text-center space-y-4 shadow-sm flex flex-col justify-between">
              <span className="text-3xl block">💼</span>
              <h3 className="font-display font-bold text-sm text-text-dark dark:text-white">5. Leadership & Career Ally</h3>
              <p className="text-xs text-text-gray dark:text-gray-400 font-light leading-relaxed">
                Provides aid looking for summer internships, coordinates professional resume-building, and supports return-home strategies.
              </p>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-primary-light/20 text-primary-dark dark:text-lavender py-1 rounded-md">Future Leader</span>
            </div>

          </div>
        </div>
      </section>

      {/* INTERACTIVE COUNTRY HUBS SECTION */}
      <section id="countries" className="py-24 px-6 bg-slate-50 dark:bg-slate-900/20 border-y border-gray-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-light block">Our Impact Footprint</span>
              <h2 className="text-3xl md:text-5xl font-display font-extrabold text-text-dark dark:text-white tracking-tight">Active Country Hubs</h2>
              <p className="text-text-gray dark:text-gray-400 max-w-xl font-light text-sm">
                Click on each region to highlight operational metrics, local launching years, successful leadership bios, and localized focus curriculums.
              </p>
            </div>
            
            {/* Country Selector Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {countryHubs.map((country) => (
                <button
                  key={country.id}
                  onClick={() => setActiveCountry(country.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border ${
                    activeCountry === country.id
                      ? 'bg-primary text-white border-primary shadow-md transform scale-105'
                      : 'bg-white dark:bg-slate-800 text-text-dark dark:text-gray-300 border-gray-100 dark:border-slate-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{country.emoji}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Core Interactive Showcase Grid */}
          {countryHubs.filter(c => c.id === activeCountry).map((country) => (
            <div key={country.id} className="grid grid-cols-1 md:grid-cols-12 gap-10 bg-white dark:bg-slate-900 rounded-3xl p-8 border border-gray-100 dark:border-slate-800 shadow-xl items-center animate-fade-in">
              
              <div className="md:col-span-4 relative h-[250px] rounded-2xl overflow-hidden shadow-inner">
                <Image
                  src={country.flag}
                  alt={`${country.name} view representing scholars`}
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-5 text-white font-display text-xl font-bold">
                  {country.emoji} {country.name} Hub
                </div>
              </div>

              <div className="md:col-span-8 flex flex-col justify-between space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100/50 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-text-gray dark:text-gray-400 block uppercase font-bold tracking-wider">Launched</span>
                    <span className="font-display font-medium text-lg text-primary dark:text-primary-light block mt-1">{country.yearLaunched}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100/50 dark:border-slate-700 text-center">
                    <span className="text-[10px] text-text-gray dark:text-gray-400 block uppercase font-bold tracking-wider">Metrics</span>
                    <span className="font-display font-medium text-lg text-primary dark:text-primary-light block mt-1">{country.scholarsCount}</span>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-gray-100/50 dark:border-slate-700 text-center col-span-2">
                    <span className="text-[10px] text-text-gray dark:text-gray-400 block uppercase font-bold tracking-wider">Status Record</span>
                    <span className="font-display font-medium text-lg text-primary dark:text-primary-light block mt-1">{country.statText}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-bold text-accent tracking-widest">Notable Catalyst Highlight</h4>
                  <p className="text-sm text-text-gray dark:text-gray-200 leading-relaxed font-light italic">
                    &ldquo;{country.successStory}&rdquo;
                  </p>
                </div>

                <div className="p-4 bg-lavender/30 dark:bg-slate-800/60 rounded-xl border border-[#e2d6f7]/50 dark:border-slate-700 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎓</span>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-gray dark:text-gray-400 block">Core Major Tracks</span>
                      <p className="text-xs text-text-dark dark:text-white font-medium mt-0.5">{country.primaryFocus}</p>
                    </div>
                  </div>
                  <a href="#volunteer" className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-all">
                    Sponsor This Hub
                  </a>
                </div>

              </div>

            </div>
          ))}

        </div>
      </section>

      {/* PARTNER COLLEGES GRID SECTION */}
      <section id="colleges" className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-block px-3 py-1 text-xs font-semibold bg-accent/20 text-primary-dark dark:text-accent rounded-md uppercase tracking-wider">
              Educational Affiliations
            </div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl text-text-dark dark:text-white tracking-tight leading-none">
              U.S. University Partners
            </h2>
            <p className="text-text-gray dark:text-gray-300 font-light">
              Under special institutional agreements, our partner educational institutions cover a full, comprehensive tuition scholarship. Click on each partner for details on their strategic support pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerColleges.map((college, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedCollege(college.name)}
                className="group p-6 bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl hover:border-accent hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-lavender/50 dark:bg-slate-800 rounded-xl inline-block group-hover:bg-accent group-hover:text-text-dark transition-all">
                      <GraduationCap className="w-5 h-5 text-primary group-hover:text-text-dark transition-colors" />
                    </div>
                    <span className="text-[10px] font-semibold text-text-gray dark:text-gray-400 group-hover:text-accent font-mono transition-colors">
                      HQ Agreement
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-text-dark dark:text-white group-hover:text-primary-light transition-colors">
                    {college.name}
                  </h3>
                  <p className="text-xs text-text-gray dark:text-gray-400 font-light">
                    Located in <strong>{college.location}</strong>
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between text-[11px] font-semibold text-primary dark:text-primary-light border-t border-gray-100 dark:border-slate-800 mt-4">
                  <span>Explore Agreement</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER COLLEGE DETAIL MODAL */}
      {selectedCollege !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          {partnerColleges.filter(c => c.name === selectedCollege).map((college, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-8 shadow-2xl relative border border-gray-100 dark:border-slate-800 animate-slide-up">
              <button
                onClick={() => setSelectedCollege(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-text-gray transition-colors cursor-pointer focus:outline-none"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-3 bg-lavender/50 dark:bg-slate-800 rounded-xl inline-block mb-4">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>

              <h3 className="text-xl font-display font-extrabold text-text-dark dark:text-white mb-1">
                {college.name}
              </h3>
              <p className="text-xs text-text-gray dark:text-gray-400 mb-4">{college.location}</p>

              <div className="h-0.5 bg-gradient-to-r from-primary to-accent my-4" />

              <div className="space-y-4 text-xs font-light">
                <div className="p-3 bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-lg flex items-start gap-2 border border-amber-500/10">
                  <Sparkles className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                  <p>In partnership with S.H.E. - C.A.N., {college.name} secures a full-tuition, room and board undergraduate scholarship for exceptional matched candidates.</p>
                </div>
                <p className="text-text-gray dark:text-gray-300 leading-relaxed">
                  {college.description} Scholars enjoy premium integration, mental health resources on campus, academic tutoring, and structural support networks from their community of 5 US Mentors.
                </p>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-800 pt-4">
                <button
                  onClick={() => setSelectedCollege(null)}
                  className="px-4 py-2 border rounded-lg text-text-gray dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs"
                >
                  Close Detail
                </button>
                <a
                  href="#volunteer"
                  onClick={() => setSelectedCollege(null)}
                  className="px-4 py-2 bg-primary text-white font-medium rounded-lg text-xs hover:bg-primary-dark transition-colors"
                >
                  Join Support Squad
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TESTIMONIALS SECTION */}
      <section className="py-24 px-6 bg-lavender/20 dark:bg-slate-900 border-y border-purple-100/50 dark:border-slate-800 relative overflow-hidden">
        
        {/* quotation icon overlay */}
        <div className="absolute top-10 left-10 text-[200px] font-serif leading-none text-primary/10 select-none pointer-events-none">
          &ldquo;
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
          
          <div className="space-y-2">
            <span className="text-xs font-semibold tracking-wider uppercase text-primary-light">
              Echoes of Sovereignty
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-dark dark:text-white">
              Authentic Global Scholar Dialogues
            </h2>
          </div>

          {/* Slider box */}
          <div className="min-h-[240px] md:min-h-[190px] flex items-center justify-center">
            {testimonials.map((test, index) => (
              <div
                key={index}
                className={`transition-all duration-750 ease-in-out absolute max-w-3xl space-y-6 ${
                  currentTestimonial === index
                    ? 'opacity-100 transform scale-100 pointer-events-auto relative'
                    : 'opacity-0 transform scale-95 pointer-events-none absolute'
                }`}
              >
                <p className="text-base md:text-lg text-text-dark dark:text-gray-100 italic font-medium leading-relaxed">
                  &ldquo;{test.text}&rdquo;
                </p>

                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm tracking-widest shadow-md">
                    {test.initials}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-text-dark dark:text-white leading-none text-sm">
                      {test.name}
                    </h4>
                    <span className="text-xs text-text-gray dark:text-gray-400 font-light block mt-1">
                      {test.role} &bull; {test.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls indicators */}
          <div className="flex items-center justify-center gap-3">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentTestimonial === idx ? 'w-8 bg-primary' : 'w-2.5 bg-gray-300 dark:bg-slate-700'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* JOIN US / VOLUNTEER SECTION */}
      <section id="volunteer" className="py-24 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-stretch">
            
            {/* Left side: Join Form */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-accent/20 text-primary-dark dark:text-accent rounded-md uppercase tracking-wider">
                  Participate &amp; Mentor
                </span>
                <h2 className="font-display font-extrabold text-3xl md:text-4xl text-text-dark dark:text-white leading-tight">
                  Join a Strategic Support Alliance
                </h2>
                <p className="text-text-gray dark:text-gray-300 font-light text-sm">
                  We are looking for dedicated business executives, university developers, academic coaches, and community advisors across the United States and global hubs to form supportive core pilot groups.
                </p>
              </div>

              {formStep === 'idle' && (
                <form onSubmit={handleVolunteerSubmit} className="space-y-5 bg-lavender/10 dark:bg-slate-900 p-8 rounded-2xl border border-gray-100 dark:border-slate-800">
                  {errorMessage && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-100">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="volunteer-name" className="text-xs font-semibold uppercase tracking-wider text-text-gray dark:text-gray-300 block">
                        Full Name First &amp; Last
                      </label>
                      <input
                        type="text"
                        id="volunteer-name"
                        required
                        value={formInputs.fullName}
                        onChange={(e) => setFormInputs({ ...formInputs, fullName: e.target.value })}
                        placeholder="e.g. Ariti Barthwal"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="volunteer-email" className="text-xs font-semibold uppercase tracking-wider text-text-gray dark:text-gray-300 block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="volunteer-email"
                        required
                        value={formInputs.email}
                        onChange={(e) => setFormInputs({ ...formInputs, email: e.target.value })}
                        placeholder="you@domain.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="volunteer-phone" className="text-xs font-semibold uppercase tracking-wider text-text-gray dark:text-gray-300 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="volunteer-phone"
                        required
                        value={formInputs.phone}
                        onChange={(e) => setFormInputs({ ...formInputs, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="volunteer-role" className="text-xs font-semibold uppercase tracking-wider text-text-gray dark:text-gray-300 block">
                        Preferred Leadership Squad Tract
                      </label>
                      <select
                        id="volunteer-role"
                        value={formInputs.role}
                        onChange={(e) => setFormInputs({ ...formInputs, role: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-slate-800 text-sm"
                      >
                        <option value="Academic Co-Pilot">Academic &amp; Test Prep Coach</option>
                        <option value="University Application Specialist">Admissions &amp; Application Advisor</option>
                        <option value="Logistics Coordinator">Logistics &amp; Embassy Support</option>
                        <option value="Life Transition Mentor">Life &amp; On-Campus integration</option>
                        <option value="Leadership/Career Ally">Career / Interview Preparation Advisor</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-accent hover:bg-[#ebd04d] text-text-dark font-display font-semibold transition-all shadow-lg hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                    >
                      Pledge My Volunteer Support
                    </button>
                    <p className="text-[10px] text-text-gray text-center mt-3 font-light leading-relaxed">
                      By submitting, you pledge to contribute to our mission of S.H.E.-C.A.N. global female empowerment.
                    </p>
                  </div>
                </form>
              )}

              {formStep === 'submitting' && (
                <div className="flex flex-col items-center justify-center py-16 bg-lavender/15 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-8 rounded-2xl text-center space-y-6">
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-text-dark dark:text-white">Registering Pledge Profile...</h3>
                    <p className="text-sm text-text-gray dark:text-gray-400 font-mono text-xs">{formStatusText}</p>
                  </div>
                </div>
              )}

              {formStep === 'success' && (
                <div className="bg-[#f0fff4] dark:bg-emerald-950/20 border border-emerald-200/50 p-8 rounded-2xl text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                    ✓
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-2xl font-display font-extrabold text-emerald-800 dark:text-emerald-400">
                      Pledge Received! 🎉
                    </h3>
                    <p className="text-sm text-emerald-700/80 dark:text-gray-300 font-light">
                      Thank you so much, <strong className="font-semibold">{formInputs.fullName}</strong>. You have taken a beautiful step to empower young scholars. Our mentor onboarding lead will reach out to schedule an introductory call.
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Submit Another Coordinator Form
                  </button>
                </div>
              )}

              {/* LIVE PLEDGE WALL */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-text-dark dark:text-white">
                      Live Alliance Registration Stream
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-[#7c5cbf] font-semibold uppercase">SECURE SYNC</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {supporters.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 flex flex-col justify-between text-xs hover:border-accent group transition-colors animate-fade-in"
                    >
                      <div className="space-y-1">
                        <div className="font-bold text-text-dark dark:text-white flex items-center gap-1 text-[11px]">
                          🌸 {item.name}
                        </div>
                        <div className="text-[10px] text-text-gray dark:text-gray-400 font-medium">{item.role}</div>
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[9px] text-[#7a7583] dark:text-gray-400 font-mono">
                        <span>{item.location}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right side: Decorative Informative Sidebar */}
            <div className="lg:col-span-5 flex">
              <div className="w-full bg-gradient-to-br from-primary-dark via-[#442385] to-slate-900 text-white rounded-3xl p-8 flex flex-col justify-between border border-white/10 shadow-2xl relative overflow-hidden">
                
                {/* Background lighting accents */}
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-accent/25 rounded-full blur-2xl" />

                <div className="space-y-6">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-accent text-xl">
                    🌸
                  </div>

                  <h3 className="font-display font-extrabold text-2xl tracking-tight leading-tight">
                    Your Hours Can Reshape an Entire Era
                  </h3>

                  <p className="text-sm text-lavender leading-relaxed font-light">
                    Scholars from post-war and marginalized backgrounds enter college with formidable analytical drive but heavy cultural barriers. Seeing your strategic leadership, confidence, and integration tips provides them with an architectural map to scale the future.
                  </p>

                  <div className="space-y-3.5 pt-4">
                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                      <GraduationCap className="w-5 h-5 text-accent" />
                      <div className="text-xs font-light">
                        <strong>Lafayette &amp; Bucknell</strong> seeking additional campus onboarding coordinators.
                      </div>
                    </div>

                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                      <Users className="w-5 h-5 text-accent" />
                      <div className="text-xs font-light">
                        <strong>New Guatemala Cohort</strong> is looking for senior essay advisors to match.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6 mt-8 space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-accent block">
                    Volunteer Spotlights
                  </span>
                  <div className="text-xs italic text-lavender font-light">
                    &ldquo;Mentoring Sokanha with 4 other allies became the absolute highlight of my year. Watching her blossom from a shy applicant in Phnom Penh to an articulate engineer was incredibly profound.&rdquo;
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <div className="w-8 h-8 rounded-full bg-accent text-text-dark font-bold text-[10px] flex items-center justify-center">
                      MB
                    </div>
                    <div>
                      <h5 className="text-xs font-bold font-display">Marguerite B.</h5>
                      <span className="text-[10px] text-accent font-light">Senior Partner, Boston Hub</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-text-dark text-white border-t border-white/10 relative z-20">
        
        {/* Top footer details */}
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10">
          
          <div className="md:col-span-5 space-y-4">
            <a href="#home" className="flex items-center gap-2 text-2xl font-display font-semibold text-white">
              <span>🌸</span> S.H.E. - C.A.N. Foundation
            </a>
            <p className="text-sm text-gray-400 font-light leading-relaxed max-w-md">
              Supporting Her Education in Cooperation with Allies in New Nations is a registered 501(c)(3) global non-profit empowering high-potential female leaders from underrepresented regional hubs.
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-accent hover:text-text-dark flex items-center justify-center transition-all shadow-md cursor-pointer"
                aria-label="Instagram Handle"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-accent hover:text-text-dark flex items-center justify-center transition-all shadow-md cursor-pointer"
                aria-label="Twitter Header Link"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-accent hover:text-text-dark flex items-center justify-center transition-all shadow-md cursor-pointer"
                aria-label="Facebook Profile"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-accent hover:text-text-dark flex items-center justify-center transition-all shadow-md cursor-pointer"
                aria-label="Linkedin Company Link"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-accent">Active Country Hubs</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li><button onClick={() => setActiveCountry('cambodia')} className="hover:text-white hover:underline text-left cursor-pointer">Cambodia (Est. 2014)</button></li>
              <li><button onClick={() => setActiveCountry('rwanda')} className="hover:text-white hover:underline text-left cursor-pointer">Rwanda (Est. 2011)</button></li>
              <li><button onClick={() => setActiveCountry('guatemala')} className="hover:text-white hover:underline text-left cursor-pointer">Guatemala (Est. 2018)</button></li>
              <li><button onClick={() => setActiveCountry('liberia')} className="hover:text-white hover:underline text-left cursor-pointer">Liberia (Est. 2020)</button></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-accent">Navigation</h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-light">
              <li><a href="#home" className="hover:text-white hover:underline transition-colors">Home Landing</a></li>
              <li><a href="#about" className="hover:text-white hover:underline transition-colors">Our 5-Mentor Model</a></li>
              <li><a href="#countries" className="hover:text-white hover:underline transition-colors">Operational Country Hubs</a></li>
              <li><a href="#colleges" className="hover:text-white hover:underline transition-colors">U.S. University Partners</a></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-accent">Join the Movement</h4>
            <ul className="space-y-3 text-xs text-gray-400 font-light">
              <li className="flex items-center gap-2">
                <Info className="w-4 h-4 text-accent" />
                <span>CEO &amp; Founder: Barbara Bylenga</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent" />
                <span>San Francisco, CA &amp; East Coast Hubs</span>
              </li>
              <li className="p-3 bg-white/5 rounded-xl border border-white/10 text-[10px] text-gray-400 font-light">
                Registered 501(c)(3) NGO. All US contributions are 100% tax-deductible to the extent permitted by law.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom footer credit bar */}
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 font-light gap-4">
          <span>&copy; {new Date().getFullYear()} S.H.E. - C.A.N. Foundation. All rights reserved.</span>
          <span className="flex items-center gap-1 text-gray-400">
            Empowering women leaders from underrepresented nations to change their worlds.
          </span>
        </div>

      </footer>

    </div>
  );
}
