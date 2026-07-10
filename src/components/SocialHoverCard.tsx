import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Check, Copy, ExternalLink } from "lucide-react";

interface SocialHoverCardProps {
  platform: string;
  children: React.ReactNode;
  initialOpen?: boolean;
}

interface GithubData {
  avatar_url: string;
  name: string;
  bio: string;
  location: string;
  public_repos: number;
  followers: number;
  login: string;
}

export default function SocialHoverCard({ platform, children, initialOpen = false }: SocialHoverCardProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [copied, setCopied] = useState(false);
  const [githubData, setGithubData] = useState<GithubData | null>(null);
  const [loadingGithub, setLoadingGithub] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialOpen && platform === "github") fetchGithubProfile();
    // The deferred card only needs this mount-time refresh.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
      if (platform === "github" && !githubData) {
        fetchGithubProfile();
      }
    }, 250); // 250ms hover delay to prevent trigger on casual sweeps
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 180); // 180ms delay to allow moving cursor from button onto card
  };

  const fetchGithubProfile = async () => {
    setLoadingGithub(true);
    try {
      const res = await fetch("https://api.github.com/users/ashishkumar62649");
      if (res.ok) {
        const data = await res.json();
        setGithubData({
          avatar_url: data.avatar_url,
          name: data.name || "Ashish Kumar",
          bio: data.bio || "AI & Data Science Student at IIT Guwahati.",
          location: data.location || "Guwahati, India",
          public_repos: data.public_repos || 0,
          followers: data.followers || 0,
          login: data.login || "ashishkumar62649"
        });
      }
    } catch {
      console.warn("Failed to fetch GitHub profile for hover card, using static fallback.");
    } finally {
      setLoadingGithub(false);
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText("ashishkumar62649@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pre-generate static fallback for offline or loading states
  const fallbackGithub = {
    avatar_url: "/images/avatar.webp",
    name: "Ashish Kumar",
    bio: "AI & Data Science Undergraduate @ IIT Guwahati. Building agentic workflows & ML solutions.",
    location: "Guwahati, Assam, India",
    public_repos: 28,
    followers: 12,
    login: "ashishkumar62649"
  };

  const activeGithub = githubData || fallbackGithub;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger element */}
      <div className="relative z-10">{children}</div>

      {/* Floating Hover Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: 5, x: "-50%" }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="absolute bottom-full left-1/2 mb-3 z-[999] w-[290px] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 shadow-2xl backdrop-blur-md text-left font-sans pointer-events-auto"
          >
            {/* Arrow Tip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-zinc-200 dark:border-t-zinc-800" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white dark:border-t-zinc-950" />

            {/* Platform templates */}

            {/* 1. GITHUB CARD */}
            {platform === "github" && (
              <div className="flex flex-col gap-3">
                {/* Header profile */}
                <div className="flex items-center gap-3">
                  <img
                    src={activeGithub.avatar_url}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/avatar.webp";
                    }}
                    className="w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[14px] text-zinc-900 dark:text-white leading-snug truncate">
                      {activeGithub.name}
                    </h4>
                    <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 block truncate">
                      @{activeGithub.login}
                    </span>
                  </div>
                </div>
                {/* Bio & Details */}
                <p className="text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-400 pr-1">
                  {loadingGithub ? "Refreshing profile metrics..." : activeGithub.bio}
                </p>
                <div className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {activeGithub.location}
                </div>
                {/* Repos & Followers Count */}
                <div className="flex gap-4 border-t border-zinc-100 dark:border-zinc-800/80 pt-2.5 text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Repositories</span>
                    <strong className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {activeGithub.public_repos}
                    </strong>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500">Followers</span>
                    <strong className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
                      {activeGithub.followers}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LINKEDIN CARD */}
            {platform === "linkedin" && (
              <div className="flex flex-col gap-2.5">
                {/* Custom LinkedIn header banner */}
                <div 
                  className="relative h-14 w-full rounded-t-lg bg-cover bg-center -mx-4 -mt-4 mb-2 overflow-hidden"
                  style={{ backgroundImage: "url('/images/linkedin_banner.webp')" }}
                >
                  <div className="absolute inset-0 bg-black/15" />
                </div>
                {/* Avatar & Info */}
                <div className="flex items-start gap-2.5">
                  <div className="relative">
                    <img
                      src="/images/avatar.webp"
                      alt=""
                      className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-950 shadow-md -mt-8 z-10 bg-zinc-900 object-cover"
                    />
                    <div className="absolute -bottom-1.5 -right-1.5 bg-green-600 text-[6.5px] font-extrabold text-white px-0.5 py-0.2 rounded border border-white dark:border-zinc-950 scale-75 uppercase">#OPENTOWORK</div>
                  </div>
                  <div className="min-w-0 flex-1 -mt-1.5">
                    <h4 className="font-bold text-[14px] text-zinc-900 dark:text-white leading-snug flex items-center gap-1">
                      Ashish Kumar
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal">(He/Him)</span>
                    </h4>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block truncate">
                      in/ashishkumar62649
                    </span>
                  </div>
                </div>
                {/* Headline */}
                <p className="text-[11.5px] leading-snug text-zinc-700 dark:text-zinc-300 font-medium">
                  Student | Passionate About Learning Data Science and Machine Learning
                </p>
                {/* School and Company Stack */}
                <div className="flex flex-col gap-1 border-t border-zinc-100 dark:border-zinc-800/80 pt-2 text-[10.5px]">
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-450">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    <span>Evoastra</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-450">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                    <span>Indian Institute of Technology, Guwahati</span>
                  </div>
                </div>
                {/* Connections Footer */}
                <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-2 flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">Connections</span>
                    <strong className="text-[13px] font-bold text-blue-600 dark:text-blue-400">
                      4 connections
                    </strong>
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5">
                    Connect <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            )}

            {/* 3. INSTAGRAM CARD */}
            {platform === "instagram" && (
              <div className="flex flex-col gap-3">
                {/* Vibrant Instagram theme bar */}
                <div className="h-1.5 w-full rounded-t-lg bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 -mx-4 -mt-4 mb-1" />
                <div className="flex items-center gap-3 mt-1">
                  <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600">
                    <img
                      src="/images/avatar.webp"
                      alt=""
                      className="w-11 h-11 rounded-full border border-white dark:border-zinc-950 bg-zinc-900 object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[14px] text-zinc-900 dark:text-white leading-snug truncate">
                      ashishkumar62649
                    </h4>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block truncate">
                      Ashish Kumar
                    </span>
                  </div>
                </div>
                <div className="flex justify-between border-t border-b border-zinc-100 dark:border-zinc-800/80 py-2 text-xs font-mono">
                  <div className="flex flex-col items-center">
                    <strong className="text-[13px] font-bold text-zinc-850 dark:text-zinc-200">4</strong>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">posts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <strong className="text-[13px] font-bold text-zinc-850 dark:text-zinc-200">240</strong>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <strong className="text-[13px] font-bold text-zinc-850 dark:text-zinc-200">176</strong>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500">following</span>
                  </div>
                </div>
                <p className="text-[12px] leading-relaxed text-zinc-650 dark:text-zinc-400 font-medium">
                  🔗 <span className="text-blue-500 hover:underline">@ashishkumar62649</span>
                </p>
              </div>
            )}

            {/* 4. WHATSAPP CARD */}
            {platform === "whatsapp" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2 mb-0.5">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    DIRECT MESSAGE
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">WHATSAPP</span>
                </div>
                <div className="flex items-start gap-3">
                  <img
                    src="/images/avatar.webp"
                    alt=""
                    className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-900 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-[13px] text-zinc-900 dark:text-white leading-tight">
                      Ashish Kumar
                    </h4>
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                      +91 88529 06820
                    </p>
                  </div>
                </div>
                <p className="text-[11.5px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Opens a direct secure conversation thread on WhatsApp for project queries, freelance bookings, or networking.
                </p>
                <div className="mt-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 text-center">
                  Typically responds in under a few hours
                </div>
              </div>
            )}

            {/* 5. DISCORD CARD */}
            {platform === "discord" && (
              <div className="flex flex-col gap-3 -mx-1">
                {/* Banner & Avatar Row */}
                <div className="relative h-12 w-full rounded-t-lg bg-[#4ca3f4] -mx-4 -mt-4 mb-2">
                  <div className="absolute top-1.5 right-2 bg-zinc-950/40 text-[8px] font-mono font-bold text-white px-1.5 py-0.5 rounded tracking-wide">
                    DISCORD
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="relative -mt-8 ml-1">
                    <img
                      src="/images/discord_avatar.webp"
                      alt=""
                      className="w-12 h-12 rounded-full border-2 border-white dark:border-zinc-950 bg-zinc-900 object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#23a55a] border-2 border-white dark:border-zinc-950" title="Online" />
                  </div>
                  <div className="min-w-0 flex-1 -mt-1">
                    <h4 className="font-bold text-[14px] text-zinc-900 dark:text-white leading-none">
                      callmeLeader
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-1 block">
                      ashishkumar_62649
                    </span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="text-[10.5px] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/80 px-2.5 py-1.5 rounded flex items-center gap-1.5 text-zinc-655 dark:text-zinc-350">
                  <span className="text-zinc-500 font-semibold font-mono">Status:</span>
                  <span>Pubg 🚀 🪓 🔫 🔫</span>
                </div>

                {/* About Me & Vibe */}
                <div className="text-[11.5px] leading-relaxed text-zinc-700 dark:text-zinc-300 font-sans italic">
                  &ldquo;Your vibe — chaotic, calm, or somewhere in between?&rdquo;
                </div>

                <div className="text-[10.5px] font-mono text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80 pt-2 flex items-center justify-between">
                  <span>MEMBER SINCE</span>
                  <span className="font-semibold text-zinc-600 dark:text-zinc-400">Feb 3, 2022</span>
                </div>

                {/* Connections section */}
                <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-2.5 flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono font-extrabold tracking-wider text-zinc-400 dark:text-zinc-500">CONNECTIONS</span>
                  
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                    <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                      <img src="/icons/simple/epicgames-808080.svg" alt="" className="w-3.5 h-3.5 object-contain" />
                      <span className="truncate" title="ashishkumar62649">ashishkumar6...</span>
                    </div>
                    <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-350 hover:underline">
                      <img src="/icons/simple/spotify-1db954.svg" alt="" className="w-3.5 h-3.5 object-contain" />
                      <span>Ashish ↗</span>
                    </a>
                    <a href="https://steamcommunity.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-350 hover:underline">
                      <img src="/icons/simple/steam-808080.svg" alt="" className="w-3.5 h-3.5 object-contain" />
                      <span>Steam ↗</span>
                    </a>
                    <a href="https://twitch.tv" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-zinc-650 dark:text-zinc-350 hover:underline">
                      <img src="/icons/simple/twitch-9146ff.svg" alt="" className="w-3.5 h-3.5 object-contain" />
                      <span>Twitch ↗</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 6. GMAIL / EMAIL CARD */}
            {platform === "gmail" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 pb-2 mb-0.5">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-red-500 flex items-center gap-1">
                    <Mail className="w-3 h-3 text-red-500" />
                    SEND MAIL
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">ashishkumar62649</span>
                </div>
                <p className="text-[12px] font-mono text-zinc-900 dark:text-zinc-100 truncate select-all px-2 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded text-center font-bold">
                  ashishkumar62649@gmail.com
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500 animate-scale" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy Address
                      </>
                    )}
                  </button>
                  <a
                    href="mailto:ashishkumar62649@gmail.com"
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-[10px] font-mono font-bold transition-colors cursor-pointer text-center"
                  >
                    Compose <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
