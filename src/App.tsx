import { useState, useEffect } from "react";
import { Mail, FileText, Palette, ChevronLeft, ChevronRight, ArrowLeft, ExternalLink, Download, Play } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BannerParticles from "./components/BannerParticles";
import CommandMenu from "./components/CommandMenu";
import ExperienceList from "./components/ExperienceList";
import ProjectsGrid, { TechIcons } from "./components/ProjectsGrid";
import projectsData from "./data/projects.json";
import skillsData from "./data/skills.json";
import profileData from "./data/profile.json";
import socialsData from "./data/socials.json";
import configData from "./data/config.json";
import type { SkillItem, SocialItem } from "./data/types";
import GithubGraph from "./components/GithubGraph";
import OpenSourceContributions from "./components/OpenSourceContributions";
import BlogList from "./components/BlogList";
import BlogPost from "./components/BlogPost";
import { ImageTrail } from "./components/ui/image-trail";
import { trailImages } from "./components/trail-images";
import Preloader from "./components/Preloader";

// Component for structural dotted section grids
const SectionDivider = ({ position = "top" }: { position?: "top" | "bottom" }) => {
  const borderClass = position === "top" ? "border-t" : "border-b";
  const translateClass = position === "top" ? "-translate-y-1/2" : "translate-y-1/2";
  return (
    <>
      <div 
        className={`absolute ${position}-0 left-[-100vw] right-[-100vw] h-0 ${borderClass} border-[var(--border-color)] pointer-events-none`} 
        style={{ 
          maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
          WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
        }}
      />
      <div className={`absolute ${position}-0 -left-4 w-[2px] h-[2px] bg-[var(--crosshair-color)] -translate-x-1/2 ${translateClass} pointer-events-none z-20`} />
      <div className={`absolute ${position}-0 -right-4 w-[2px] h-[2px] bg-[var(--crosshair-color)] translate-x-1/2 ${translateClass} pointer-events-none z-20`} />
    </>
  );
};

const videos = configData.videos;

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={props.className}
    style={props.style}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const getSocialsList = (theme: string) =>
  socialsData.map((s: SocialItem) => ({
    ...s,
    brandColor: theme === "light" ? s.brandColorLight : s.brandColorDark,
  }));

type Theme = "dark" | "light" | "cyberpunk" | "retro" | "ibm";

export default function App() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("experience");
  const [time, setTime] = useState("");
  const [videoIndex, setVideoIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [view, setView] = useState<"portfolio" | "contact" | "resume" | "projects" | "pull-requests" | "blog-post">("portfolio");
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitStatus("sending");
    setTimeout(() => {
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 4000);
    }, 1200);
  };

  // Select a random video index on component mount
  useEffect(() => {
    setVideoIndex(Math.floor(Math.random() * videos.length));
  }, []);

  const handleNextVideo = () => {
    setDirection(1);
    setVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setDirection(-1);
    setVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };



  const handleDragEnd = (_event: any, info: any) => {
    const dragDistance = info.offset.x;
    const dragVelocity = info.velocity.x;
    if (dragDistance < -60 || dragVelocity < -600) {
      handleNextVideo();
    } else if (dragDistance > 60 || dragVelocity > 600) {
      handlePrevVideo();
    }
  };

  // Sync clock time with periods
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, "0");
      setTime(`${pad(now.getHours())}.${pad(now.getMinutes())}.${pad(now.getSeconds())}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set theme stylesheet classes on body
  useEffect(() => {
    // Clear all theme classes
    document.body.classList.remove("light-theme", "cyberpunk-theme", "retro-theme", "ibm-theme");
    
    if (theme === "light") {
      document.body.classList.add("light-theme");
      document.documentElement.classList.remove("dark");
    } else if (theme === "cyberpunk") {
      document.body.classList.add("cyberpunk-theme");
      document.documentElement.classList.add("dark");
    } else if (theme === "retro") {
      document.body.classList.add("retro-theme");
      document.documentElement.classList.add("dark");
    } else if (theme === "ibm") {
      document.body.classList.add("ibm-theme");
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  const cycleTheme = () => {
    const themes: Theme[] = ["dark", "light", "cyberpunk", "retro", "ibm"];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIdx]);
  };

  const getIconColor = () => {
    if (theme === "cyberpunk") return "d946ef";
    if (theme === "retro") return "22c55e";
    if (theme === "ibm") return "0f62fe";
    return "71717a";
  };

  // Hook command palette shortcut keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandMenuOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Play sound on button/link hover or click globally
  useEffect(() => {
    const hoverAudio = new Audio("/button.mp3");
    const clickAudio = new Audio("/button.mp3");
    hoverAudio.volume = 0.25;
    clickAudio.volume = 0.4;

    let lastHoveredElement: HTMLElement | null = null;

    const playSound = (audio: HTMLAudioElement) => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const clickable = target.closest("button, a, [role='button'], .cursor-pointer") as HTMLElement | null;
      if (clickable) {
        if (clickable !== lastHoveredElement) {
          lastHoveredElement = clickable;
          playSound(hoverAudio);
        }
      } else {
        lastHoveredElement = null;
      }
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const clickable = target.closest("button, a, [role='button'], .cursor-pointer");
      if (clickable) {
        playSound(clickAudio);
      }
    };

    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  // IntersectionObserver to highlight active sidebar index link on scroll
  useEffect(() => {
    const sections = configData.sectionIds;
    const observers = sections.map((id) => {
      const element = document.getElementById(id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      observer.observe(element);
      return { observer, element };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.element);
        }
      });
    };
  }, []);



  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sidebarSections = configData.sidebarSections;

  const skillsList: SkillItem[] = skillsData;

  return (
    <>
      <AnimatePresence mode="wait">
        {showPreloader && (
          <Preloader onComplete={() => setShowPreloader(false)} />
        )}
      </AnimatePresence>

      <ImageTrail
      images={trailImages}
      threshold={50}
      minDelay={30}
      duration={1000}
      maxItems={10}
      rotationRange={30}
      imageClassName="w-20 md:w-28 rounded-md"
      className="min-h-screen w-full bg-[var(--bg-color)] relative overflow-x-hidden transition-colors duration-300"
    >
      
      {/* 1. FIXED VIEWPORT NAVIGATION OVERLAY (Sticky Index Menu Sidebar) */}
      <div className="fixed inset-0 z-50 pointer-events-none hidden lg:block">
        <nav className="absolute top-[22vh] left-[calc(70%+32px)] pointer-events-auto flex flex-col gap-4 mt-2">
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-1">
            {configData.sectionHeaders.index}
          </h3>
          {sidebarSections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`text-[12px] font-medium tracking-[0.05em] transition-all duration-300 ease-out flex items-center gap-3 cursor-pointer text-left ${
                activeSection === sec.id
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)] hover:text-zinc-600 dark:hover:text-zinc-400"
              }`}
            >
              <span 
                className={`h-[1px] transition-all duration-300 ease-out bg-zinc-800 dark:bg-zinc-200 ${
                  activeSection === sec.id ? "w-4" : "w-0 bg-transparent"
                }`}
              />
              {sec.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 2. BACKGROUND GRID DIVISION LINES */}
      <div 
        className="absolute top-0 bottom-0 left-[30%] w-0 border-r border-[var(--border-color)] pointer-events-none hidden md:block" 
        style={{ 
          maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', 
          WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' 
        }}
      />
      <div 
        className="absolute top-0 bottom-0 right-[30%] w-0 border-r border-[var(--border-color)] pointer-events-none hidden md:block" 
        style={{ 
          maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', 
          WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' 
        }}
      />
      <div 
        className="absolute left-0 right-0 top-[22vh] h-0 border-b border-[var(--border-color)] pointer-events-none" 
        style={{ 
          maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
          WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
        }}
      />
      <div 
        className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-[var(--border-color)] pointer-events-none" 
        style={{ 
          maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
          WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
        }}
      />

      {/* Grid crosshair dots at intersections */}
      <div className="absolute w-[2px] h-[2px] bg-[var(--crosshair-color)] pointer-events-none z-10 hidden md:block" style={{ top: '22vh', left: '30%', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute w-[2px] h-[2px] bg-[var(--crosshair-color)] pointer-events-none z-10 hidden md:block" style={{ top: '22vh', right: '30%', transform: 'translate(50%, -50%)' }} />
      <div className="absolute w-[2px] h-[2px] bg-[var(--crosshair-color)] pointer-events-none z-10 hidden md:block" style={{ top: 'calc(22vh + 112px)', left: '30%', transform: 'translate(-50%, -50%)' }} />
      <div className="absolute w-[2px] h-[2px] bg-[var(--crosshair-color)] pointer-events-none z-10 hidden md:block" style={{ top: 'calc(22vh + 112px)', right: '30%', transform: 'translate(50%, -50%)' }} />

      {/* 3. HERO STARFIELD BANNER HEADER */}
      <div 
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
        className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[22vh] z-30 pointer-events-auto overflow-hidden bg-[var(--bg-color)] shadow-[0_4px_12px_rgba(2,6,23,0.04)] dark:shadow-[0_4px_12px_rgba(2,6,23,0.10)] flex items-center justify-center"
      >
        
        {/* Video Slider Container */}
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={videoIndex}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? "100%" : "-100%",
                  opacity: 0
                }),
                center: {
                  x: 0,
                  opacity: 0.9
                },
                exit: (dir: number) => ({
                  x: dir < 0 ? "100%" : "-100%",
                  opacity: 0
                })
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing select-none"
            >
              <video
                src={videos[videoIndex]}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel controls (Light transparent, hidden by default, visible on hover - stacked on top with z-50) */}
        <button 
          onClick={handlePrevVideo}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/25 backdrop-blur-md cursor-pointer transition-all active:scale-95 shadow-md duration-300 ${
            isBannerHovered ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-90"
          }`}
          aria-label="Previous Video"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button 
          onClick={handleNextVideo}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/25 backdrop-blur-md cursor-pointer transition-all active:scale-95 shadow-md duration-300 ${
            isBannerHovered ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-90"
          }`}
          aria-label="Next Video"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Particle Canvas Overlay */}
        <BannerParticles />
        
        {/* Banner fading gradients */}
        <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none z-[5] bg-gradient-to-t from-white/90 to-transparent dark:from-black/50 dark:to-transparent" />
        <div className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-r from-white/90 to-transparent dark:from-black/40 dark:to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-20 bg-gradient-to-l from-white/90 to-transparent dark:from-black/40 dark:to-transparent" />
        
        {/* Clock Overlay */}
        <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
          <div className="text-[20px] sm:text-[24px] tracking-[0.15em] text-[var(--text-muted)] font-doto font-bold select-none">
            {time}
          </div>
        </div>
      </div>

      {/* 4. BIO PROFILE BAR & CONTROLS OR CONTACT HEADER */}
      {view === "portfolio" ? (
        <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50">
          <div className="flex w-full items-center justify-between">
            
            {/* Avatar and Name */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative p-[3px] rounded-[6px] sm:rounded-[8px] border-[1.5px] border-[var(--border-color)] shrink-0 bg-[var(--bg-color)]">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-[3px] sm:rounded-[5px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img 
                    src={profileData.avatar}
                    alt="Profile" 
                    className="h-full w-full origin-center translate-y-4 scale-[1.48] object-cover opacity-90 grayscale contrast-100 mix-blend-multiply dark:mix-blend-normal"
                  />
                </div>
              </div>
              
              <div className="flex flex-col justify-center pt-8 text-left">
                <h1 className="text-[20px] sm:text-[24px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                  {profileData.name}
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">{profileData.tagline}</p>
              </div>
            </div>

            {/* Theme toggler and Command menu activator */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
              <button 
                onClick={() => setIsCommandMenuOpen(true)}
                className="relative group cursor-pointer transition-all duration-300 active:scale-95"
              >
                <div className="absolute -inset-[4.5px] border border-[var(--border-color)] rounded-[9px] pointer-events-none transition-colors duration-300 group-hover:border-[var(--border-color)] dark:group-hover:border-white/10" />
                <div className="relative flex items-center gap-1.5 px-3 py-1 bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-[5px] text-[11px] font-medium transition-all duration-300 border border-[var(--border-color)] shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 font-mono">
                  <span className="leading-none mt-[0.5px]">⌘</span>
                  <span className="leading-none mt-[0.5px]">K</span>
                </div>
              </button>
              
              <button 
                onClick={cycleTheme}
                className="flex items-center gap-1.5 p-1 text-[var(--text-primary)] hover:opacity-80 transition-opacity cursor-pointer"
                title={`Active Theme: ${theme}`}
                aria-label="Cycle Theme"
              >
                <Palette className="w-[18px] h-[18px]" />
                <span className="text-[10px] font-mono font-bold select-none">{theme.toUpperCase()}</span>
              </button>
            </div>

          </div>
        </div>
      ) : (
        <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50">
          <div className="flex w-full items-center">
            {/* Back Button */}
            <button 
              onClick={() => { setView("portfolio"); setActiveBlogSlug(null); }}
              className="p-2 border border-[var(--border-color)] rounded-[6px] text-[var(--text-primary)] hover:bg-[var(--badge-bg)] cursor-pointer mr-4 active:scale-95 transition-all animate-fade-in"
              title="Back to Portfolio"
              aria-label="Back to Portfolio"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex flex-col justify-center text-left">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-[var(--text-primary)] tracking-tight leading-none mb-1 animate-fade-in">
                {configData.viewHeaders[view as keyof typeof configData.viewHeaders]?.title ?? "Resume"}
              </h1>
              <p className="text-[12px] text-[var(--text-secondary)] animate-fade-in">
                {configData.viewHeaders[view as keyof typeof configData.viewHeaders]?.subtitle ?? profileData.name}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* 5. MAIN CONTENT COLUMN BLOCK (Bounded exactly by the lines) */}
      <div className="ml-0 mr-0 md:ml-[30%] md:mr-[30%] pt-[calc(22vh+112px)] pb-24 px-4 flex flex-col z-10 relative min-h-screen">
        
        {view === "portfolio" && (
          <>
            {/* Intro bio sentences */}
            <p className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] leading-relaxed mt-4 text-left">
              {profileData.bio[0]}
            </p>
            <ul className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] leading-relaxed mt-4 pl-4 text-left space-y-1">
              {profileData.bioHighlights.map((item, i) => (
                <li key={i} className="flex gap-1.5">
                  <span>•</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA Actions */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <button 
                onClick={() => {
                  setView("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative block rounded-[4px] text-center text-[12px] font-medium tracking-tight px-3 py-1.5 text-neutral-50 dark:text-neutral-950 cursor-pointer"
              >
                <span aria-hidden="true" className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200 bg-[var(--text-primary)] hover:opacity-90 border border-[var(--border-color)]" />
                <span className="relative flex items-center gap-1.5 font-semibold text-[var(--bg-color)]">
                  <Mail className="w-3.5 h-3.5" />
                  {configData.buttons.getInTouch}
                </span>
              </button>
              
              <button 
                onClick={() => {
                  setView("resume");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="group relative block rounded-[4px] text-center text-[12px] font-medium tracking-tight px-3 py-1.5 text-neutral-900 dark:text-neutral-300 cursor-pointer"
              >
                <span aria-hidden="true" className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200 bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)]" />
                <span className="relative flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                  <FileText className="w-3.5 h-3.5" />
                  {configData.buttons.resume}
                </span>
              </button>
            </div>

            {/* Direct Social Links */}
            <div className="mt-6 text-left">
              <h2 className="text-[13px] text-[var(--text-muted)] mb-2 font-mono">
                {configData.socialsSection.portfolioLabel}
              </h2>
              <div className="flex flex-wrap gap-2">
                {getSocialsList(theme).map((social) => (
                  <a 
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-[4px] px-3 py-1.5 text-[12px] text-neutral-900 dark:text-neutral-300"
                  >
                    <span aria-hidden="true" className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200 bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)]" />
                    <span className="relative flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                      {social.hasCustomIcon ? (
                        <LinkedinIcon className="w-3.5 h-3.5 text-[#0a66c2] group-hover:scale-110 transition-transform duration-200" />
                      ) : (
                        <img src={`https://cdn.simpleicons.org/${social.slug}/${social.brandColor}`} alt="" className="w-3.5 h-3.5 opacity-90 group-hover:scale-110 transition-all duration-200" />
                      )}
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* 6. EXPERIENCES SECTION */}
            <section id="experience" className="mt-16 text-left relative pt-12">
              <SectionDivider position="top" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] text-[var(--text-muted)] uppercase mb-6">
                {configData.sectionHeaders.experiences}
              </h2>
              <ExperienceList />
            </section>

            {/* 7. PROJECTS SECTION */}
            <section id="projects" className="mt-16 text-left relative pt-12">
              <SectionDivider position="top" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] text-[var(--text-muted)] uppercase mb-6">
                {configData.sectionHeaders.projects}
              </h2>
              <ProjectsGrid theme={theme} />
              
              {/* Center View All Button */}
              <div className="flex justify-center mt-8">
                <button 
                  onClick={() => {
                    setView("projects");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-5 py-2 border border-[var(--border-color)] rounded-[6px] text-xs font-mono font-bold bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                >
                  {configData.buttons.viewAll}
                </button>
              </div>
            </section>

            {/* 8. OPEN SOURCE CONTRIBUTIONS SECTION */}
            <section id="open-source" className="mt-16 text-left relative pt-12 flex flex-col gap-10">
              <SectionDivider position="top" />
              <GithubGraph />
              <div className="relative pt-6 border-t border-[var(--border-color)] border-dashed">
                <OpenSourceContributions setView={setView} />
              </div>
            </section>

            {/* 9. SKILLS HEATMAP SECTION */}
            <section id="skills" className="mt-16 text-left relative pt-12">
              <SectionDivider position="top" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] text-[var(--text-muted)] uppercase mb-6">
                {configData.sectionHeaders.skills}
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {skillsList.map((skill) => (
                  <div 
                    key={skill.name}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--badge-bg)] border border-[var(--border-color)] rounded-[4px] text-[12px] font-mono text-[var(--text-primary)] shadow-sm"
                  >
                    <img src={`https://cdn.simpleicons.org/${skill.slug}/${getIconColor()}`} alt="" className="w-3 h-3 opacity-80" />
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>



            {/* 11. BLOG FEEDS SECTION */}
            <section id="blogs" className="mt-16 text-left relative pt-12 mb-8">
              <SectionDivider position="top" />
              <h2 className="text-[10px] font-mono tracking-[0.2em] text-[var(--text-muted)] uppercase mb-6">
                {configData.sectionHeaders.blogs}
              </h2>
              <BlogList onSelectBlog={(slug) => {
                setActiveBlogSlug(slug);
                setView("blog-post");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} />
            </section>

            {/* 12. FOOTER ALEX HORMOZI QUOTE */}
            <footer className="mt-16 relative pt-12 text-center flex flex-col items-center">
              <SectionDivider position="top" />
              <blockquote className="text-[15px] italic text-[var(--text-muted)] max-w-md font-serif leading-relaxed">
                &ldquo;{configData.footer.quote}&rdquo;
              </blockquote>
              <cite className="text-[10px] tracking-[0.2em] font-mono uppercase text-[var(--text-muted)] mt-2 block not-italic">
                {configData.footer.author}
              </cite>
            </footer>
          </>
        )}

        {view === "contact" && (
          /* CONTACT FORM CONTENT */
          <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              
              {/* Full Name */}
              <div className="flex flex-col gap-1.5 py-6 border-b border-[var(--border-color)]">
                <label className="text-[10px] font-bold font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  {configData.contactForm.nameLabel}
                </label>
                <input 
                  type="text"
                  required
                  placeholder={configData.contactForm.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-transparent border-none outline-none text-[14px] text-[var(--text-primary)] placeholder:text-zinc-600 dark:placeholder:text-zinc-500 py-1 px-0 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1.5 py-6 border-b border-[var(--border-color)]">
                <label className="text-[10px] font-bold font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  {configData.contactForm.emailLabel}
                </label>
                <input 
                  type="email"
                  required
                  placeholder={configData.contactForm.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-transparent border-none outline-none text-[14px] text-[var(--text-primary)] placeholder:text-zinc-600 dark:placeholder:text-zinc-500 py-1 px-0 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 py-6 border-b border-[var(--border-color)]">
                <label className="text-[10px] font-bold font-mono tracking-widest text-[var(--text-muted)] uppercase">
                  {configData.contactForm.messageLabel}
                </label>
                <textarea 
                  required
                  rows={4}
                  placeholder={configData.contactForm.messagePlaceholder}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full bg-transparent border-none outline-none text-[14px] text-[var(--text-primary)] placeholder:text-zinc-600 dark:placeholder:text-zinc-500 py-1 px-0 resize-none focus:outline-none focus:ring-0"
                />
              </div>

              {/* Status Message overlay */}
              {submitStatus === "success" && (
                <div className="mt-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono">
                  {configData.contactForm.successMessage}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={submitStatus === "sending"}
                className="mx-auto mt-12 px-6 py-2 border border-[var(--border-color)] rounded-[6px] text-xs font-mono font-bold bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all shadow-md disabled:opacity-50"
              >
                {submitStatus === "sending" ? configData.contactForm.sendingLabel : configData.contactForm.sendLabel}
              </button>
            </form>

            {/* Socials segment at bottom of Contact page */}
            <div className="mt-16 text-left">
              <h2 className="text-[13px] text-[var(--text-muted)] mb-2 font-mono">
                {configData.socialsSection.contactLabel}
              </h2>
              <div className="flex flex-wrap gap-2">
                {getSocialsList(theme).map((social) => (
                  <a 
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-[4px] px-3 py-1.5 text-[12px]"
                  >
                    <span aria-hidden="true" className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200 bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)]" />
                    <span className="relative flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-[var(--text-primary)]">
                      {social.hasCustomIcon ? (
                        <LinkedinIcon className="w-3.5 h-3.5 text-[#0a66c2] mr-1.5" />
                      ) : (
                        <img src={`https://cdn.simpleicons.org/${social.slug}/${social.brandColor}`} alt="" className="w-3.5 h-3.5 opacity-90 mr-1.5" />
                      )}
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "resume" && (
          /* RESUME PDF VIEW */
          <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
            {/* Header Document bar */}
            <div className="flex items-center justify-between p-4 bg-[var(--badge-bg)] border border-[var(--border-color)] border-b-0 rounded-t-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-500" />
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-sm text-[var(--text-primary)]">
                    {profileData.resume.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    {configData.resume.pdfLabel}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a 
                  href={profileData.resume.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 border border-[var(--border-color)] rounded-[6px] text-[var(--text-primary)] hover:bg-[var(--card-hover-bg)] cursor-pointer active:scale-95 transition-all"
                  title={configData.resume.openPdfTooltip}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                
                <a 
                  href={profileData.resume.docx} 
                  download 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--text-primary)] hover:opacity-90 text-[var(--bg-color)] border border-[var(--border-color)] rounded-[6px] text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all shadow-md"
                  title={configData.resume.downloadDocxTooltip}
                >
                  <Download className="w-3.5 h-3.5" />
                  {configData.buttons.download}
                </a>
              </div>
            </div>

            {/* Embedded PDF iframe */}
            <div className="w-full border border-[var(--border-color)] rounded-b-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-md">
              <iframe 
                src={`${profileData.resume.pdf}#toolbar=0`} 
                className="w-full h-[750px] border-none"
                title={configData.resume.pdfPreviewTitle}
              />
            </div>

            {/* Raw txt format download option at bottom */}
            <div className="mt-12 text-left">
              <h2 className="text-[13px] text-[var(--text-muted)] mb-2 font-mono">
                {configData.resume.lookingForAnother}
              </h2>
              <div className="flex flex-wrap gap-2">
                <a 
                  href={profileData.resume.txt} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group relative block rounded-[4px] px-3 py-1.5 text-[12px]"
                >
                  <span aria-hidden="true" className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200 bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)]" />
                  <span className="relative flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-[var(--text-primary)]">
                    <FileText className="w-3.5 h-3.5" />
                    {configData.resume.viewRawText}
                  </span>
                </a>
              </div>
            </div>
          </div>
        )}

        {view === "projects" && (
          /* ALL PROJECTS FULL ARCHIVE VIEW */
          <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
            {/* Scrollable Container with max-height 780px and custom scrollbar */}
            <div className="max-h-[780px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10 text-left animate-fade-in">
                {projectsData.map((proj, idx) => (
                  <div key={idx} className="group relative flex flex-col cursor-pointer w-full">
                    {/* Card Preview Mockup */}
                    <div className="relative aspect-[1.6/1] w-full rounded-xl overflow-hidden border border-[var(--border-color)] bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                      {/* Gradient background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${proj.previewColor} opacity-40 group-hover:opacity-60 transition-opacity duration-300`} />
                      
                      {/* Grid grid background */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

                      {/* Play overlay button */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/40 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm shadow-xl">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </div>

                      {/* Miniature app preview box */}
                      <div className="absolute bottom-0 left-1/2 w-[85%] h-[75%] rounded-t-[10px] bg-white dark:bg-[#0a0a0a] border border-black/5 dark:border-white/[0.15] border-b-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-20 transition-transform duration-300 group-hover:translate-y-1 -translate-x-1/2 overflow-hidden p-3 font-mono text-[8px] text-zinc-400 select-none">
                        <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-900 pb-2 mb-2">
                          <div className="size-1.5 rounded-full bg-red-400" />
                          <div className="size-1.5 rounded-full bg-amber-400" />
                          <div className="size-1.5 rounded-full bg-emerald-400" />
                          <span className="text-[6px] text-zinc-500 pl-2">localhost:3000</span>
                        </div>
                        <p className="text-[7px] font-bold text-[var(--text-primary)]">{proj.title}.spec</p>
                        <pre className="text-zinc-400 mt-1.5 leading-normal truncate">import {"{ components }"} from "./ui";</pre>
                        <pre className="text-zinc-500 leading-normal truncate">const dev = await launch();</pre>
                        <pre className="text-emerald-500 leading-normal truncate">&gt; compiling component tree...</pre>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-4 flex flex-col px-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                        <h3 className="text-[15px] font-bold text-[var(--text-primary)] leading-tight">
                          {proj.title}
                        </h3>
                        
                        {/* Status Badge */}
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[var(--border-color)] bg-white dark:bg-zinc-900/50 w-fit shrink-0">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            proj.status === "Live" ? "bg-emerald-500 animate-pulse" :
                            proj.status === "Building" ? "bg-red-500" : "bg-zinc-400"
                          }`} />
                          <span className="text-[10px] font-mono font-medium text-[var(--text-secondary)]">
                            {proj.status}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-2 text-[13px] text-[var(--text-secondary)] leading-relaxed pr-2">
                        {proj.description}
                      </p>

                      {/* Bottom Actions */}
                      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[var(--border-color)]">
                        <TechIcons technologies={proj.technologies} theme={theme} />
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] font-medium text-zinc-400 hover:text-zinc-900 dark:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center gap-0.5"
                        >
                          {configData.buttons.viewProject}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "pull-requests" && (
          /* ALL PRs ARCHIVE VIEW */
          <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
            <OpenSourceContributions isFullArchive={true} setView={setView} />
          </div>
        )}
        {view === "blog-post" && (
          /* BLOG POST DETAILED VIEW */
          <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
            <BlogPost slug={activeBlogSlug || ""} />
          </div>
        )}
      </div>

      {/* 13. COMMAND PALETTE DIALOG OVERLAY */}
      <CommandMenu 
        isOpen={isCommandMenuOpen}
        onClose={() => setIsCommandMenuOpen(false)}
        setTheme={setTheme}
        scrollToSection={scrollToSection}
        setView={setView}
      />

    </ImageTrail>
    </>
  );
}
