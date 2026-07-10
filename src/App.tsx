import { lazy, Suspense, useState, useEffect } from "react";
import { Mail, FileText, Palette, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import BannerParticles from "./components/BannerParticles";
import ExperienceList from "./components/ExperienceList";
import ProjectsGrid from "./components/ProjectsGrid";
import skillsData from "./data/skills.json";
import profileData from "./data/profile.json";
import socialsData from "./data/socials.json";
import configData from "./data/config.json";
import type { SkillItem, SocialItem } from "./data/types";
import GithubGraph from "./components/GithubGraph";
import OpenSourceContributions from "./components/OpenSourceContributions";
import BlogList from "./components/BlogList";
import QuotesCarousel from "./components/QuotesCarousel";
import { ImageTrail } from "./components/ui/image-trail";
import { trailImages } from "./components/trail-images";
import Preloader from "./components/Preloader";
import { highlightKeywords } from "./utils/text";
import SocialHoverCard from "./components/DeferredSocialHoverCard";

const BlogPost = lazy(() => import("./components/BlogPost"));
const CommandMenu = lazy(() => import("./components/CommandMenu"));
const ContactView = lazy(() => import("./components/ContactView"));
const ResumeView = lazy(() => import("./components/ResumeView"));
const ProjectsArchive = lazy(() => import("./components/ProjectsArchive"));

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
const posterFor = (video: string) => `/video/posters/${video.split("/").pop()!.replace(/\.mp4$/i, ".webp")}`;

function Clock() {
  const [time, setTime] = useState("");

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

  return <>{time}</>;
}

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
  const [theme, setTheme] = useState<Theme>("light");
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("experience");
  const [videoIndex, setVideoIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const [view, setView] = useState<"portfolio" | "contact" | "resume" | "projects" | "pull-requests" | "blog-post">("portfolio");
  const [activeBlogSlug, setActiveBlogSlug] = useState<string | null>(null);
  const [sessionTrailImages, setSessionTrailImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitStatus, setSubmitStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 120);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on load
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitStatus("sending");
    try {
      const response = await fetch("https://formsubmit.co/ajax/ashishkumar62649@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New Portfolio Message from ${formData.name}`
        })
      });
      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        throw new Error("FormSubmit submission response failed");
      }
    } catch (err) {
      console.error("Failed to send message via FormSubmit:", err);
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  // Select a random video; keep the complete trail image pool available.
  useEffect(() => {
    setVideoIndex(Math.floor(Math.random() * videos.length));
    setSessionTrailImages(trailImages);
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
    const themes: Theme[] = ["light", "dark", "cyberpunk", "retro", "ibm"];
    const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[nextIdx]);
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

  // Keep the sidebar index aligned with the section nearest the viewport.
  useEffect(() => {
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const targetY = window.innerHeight * 0.35;
      const current = configData.sectionIds
        .map((id) => ({ id, top: document.getElementById(id)?.getBoundingClientRect().top ?? Infinity }))
        .filter(({ top }) => top <= targetY)
        .at(-1);
      if (current) setActiveSection(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };
    updateActiveSection();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Dynamic browser tab title manager
  useEffect(() => {
    let title = "Ashish Kumar";
    
    if (view === "resume") {
      title = "Ashish Kumar | Resume";
    } else if (view === "contact") {
      title = "Ashish Kumar | Contact";
    } else if (view === "projects") {
      title = "Ashish Kumar | Projects";
    } else if (view === "pull-requests") {
      title = "Ashish Kumar | Open Source";
    } else if (view === "blog-post") {
      title = "Ashish Kumar | Blog";
    } else {
      // If we are at the top of the landing page, show just "Ashish Kumar"
      if (isAtTop) {
        title = "Ashish Kumar";
      } else {
        if (activeSection === "experience") {
          title = "Ashish Kumar | Experience";
        } else if (activeSection === "projects") {
          title = "Ashish Kumar | Projects";
        } else if (activeSection === "open-source") {
          title = "Ashish Kumar | Open Source";
        } else if (activeSection === "skills") {
          title = "Ashish Kumar | Skills";
        } else if (activeSection === "blogs") {
          title = "Ashish Kumar | Blogs";
        } else {
          title = "Ashish Kumar | Portfolio";
        }
      }
    }
    
    document.title = title;
  }, [view, activeSection, isAtTop]);

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
      images={sessionTrailImages}
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
                poster={posterFor(videos[videoIndex])}
                preload="metadata"
                autoPlay
                muted
                playsInline
                onEnded={handleNextVideo}
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
            <Clock />
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
                <h1 className="text-[24px] sm:text-[28px] font-black text-[var(--text-primary)] tracking-tight leading-none mb-1.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                  {profileData.name}
                </h1>
                <p className="text-[13px] sm:text-[14px] font-semibold text-[var(--text-secondary)]">{profileData.tagline}</p>
              </div>
            </div>

            {/* Theme toggler */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
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
              {highlightKeywords(profileData.bio[0])}
            </p>
            <ul className="text-[14px] sm:text-[15px] text-[var(--text-secondary)] leading-relaxed mt-4 pl-4 text-left space-y-1">
              {profileData.bioHighlights.map((item, i) => (
                <li key={i} className="flex gap-1.5">
                  <span>•</span>
                  <span>{highlightKeywords(item.text)}</span>
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
                  <SocialHoverCard key={social.name} platform={social.slug}>
                    <a 
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
                          <img src={`/icons/simple/${social.slug}-${social.brandColor}.svg`} alt="" className="w-3.5 h-3.5 opacity-90 group-hover:scale-110 transition-all duration-200" />
                        )}
                        {social.name}
                      </span>
                    </a>
                  </SocialHoverCard>
                ))}
              </div>
            </div>

            {/* 6. EXPERIENCES SECTION */}
            <section id="experience" className="mt-16 text-left relative pt-12">
              <SectionDivider position="top" />
              <h2 className="text-[13px] font-mono font-extrabold tracking-[0.25em] text-[var(--text-primary)] uppercase mb-6 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[var(--text-primary)] inline-block rounded-[1px]" />
                {configData.sectionHeaders.experiences}
              </h2>
              <ExperienceList />
            </section>

            {/* 7. PROJECTS SECTION */}
            <section id="projects" className="mt-16 text-left relative pt-12">
              <SectionDivider position="top" />
              <h2 className="text-[13px] font-mono font-extrabold tracking-[0.25em] text-[var(--text-primary)] uppercase mb-6 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[var(--text-primary)] inline-block rounded-[1px]" />
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
              <h2 className="text-[13px] font-mono font-extrabold tracking-[0.25em] text-[var(--text-primary)] uppercase mb-6 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[var(--text-primary)] inline-block rounded-[1px]" />
                {configData.sectionHeaders.skills}
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {skillsList.map((skill) => (
                  <div 
                    key={skill.name}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--badge-bg)] border border-[var(--border-color)] rounded-[4px] text-[12px] font-mono text-[var(--text-primary)] shadow-sm"
                  >
                    <img 
                      src={
                        (skill.slug === "microsoftexcel" || skill.slug === "powerbi")
                          ? `/icons/${skill.slug}.svg`
                          : `/icons/simple/${skill.slug}-${
                              (skill.slug === "nextdotjs" || skill.slug === "github")
                                ? (theme === "light" ? "000000" : "ffffff")
                                : skill.color
                            }.svg`
                      }
                      alt="" 
                      className="w-3.5 h-3.5 object-contain" 
                    />
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>



            {/* 11. BLOG FEEDS SECTION */}
            <section id="blogs" className="mt-16 text-left relative pt-12 mb-8">
              <SectionDivider position="top" />
              <h2 className="text-[13px] font-mono font-extrabold tracking-[0.25em] text-[var(--text-primary)] uppercase mb-6 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[var(--text-primary)] inline-block rounded-[1px]" />
                {configData.sectionHeaders.blogs}
              </h2>
              <BlogList onSelectBlog={(slug) => {
                setActiveBlogSlug(slug);
                setView("blog-post");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }} />
            </section>

            {/* 12. FOOTER QUOTE CAROUSEL */}
            <footer className="mt-16 relative pt-12 text-center flex flex-col items-center">
              <SectionDivider position="top" />
              <QuotesCarousel />
              <p className="mt-8 text-[10px] font-mono text-[var(--text-muted)]">
                © {new Date().getFullYear()} Ashish Kumar. All rights reserved. ·{" "}
                <a
                  href="https://github.com/ashishkumar62649/Portfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-[var(--text-primary)] transition-colors"
                >
                  View source on GitHub
                </a>
              </p>
            </footer>
          </>
        )}

        {view === "contact" && (
          <Suspense fallback={null}>
            <ContactView theme={theme} formData={formData} setFormData={setFormData} submitStatus={submitStatus} onSubmit={handleSubmit} />
          </Suspense>
        )}


        {view === "resume" && <Suspense fallback={null}><ResumeView /></Suspense>}


        {view === "projects" && <Suspense fallback={null}><ProjectsArchive theme={theme} /></Suspense>}


        {view === "pull-requests" && (
          /* ALL PRs ARCHIVE VIEW */
          <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
            <OpenSourceContributions isFullArchive={true} setView={setView} />
          </div>
        )}
        {view === "blog-post" && (
          /* BLOG POST DETAILED VIEW */
          <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
            <Suspense fallback={null}><BlogPost slug={activeBlogSlug || ""} /></Suspense>
          </div>
        )}
      </div>

      {/* 13. COMMAND PALETTE DIALOG OVERLAY */}
      {isCommandMenuOpen && (
        <Suspense fallback={null}>
          <CommandMenu
            isOpen
            onClose={() => setIsCommandMenuOpen(false)}
            setTheme={setTheme}
            scrollToSection={scrollToSection}
            setView={setView}
          />
        </Suspense>
      )}

    </ImageTrail>
    </>
  );
}
