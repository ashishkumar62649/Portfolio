import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import experiencesData from "../data/experience.json";
import type { ExperienceItem } from "../data/types";

const experiences: ExperienceItem[] = experiencesData;

export default function ExperienceList() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="block mt-0 text-left">
      {experiences.map((exp, idx) => {
        const isOpen = expandedIndex === idx;
        return (
          <div key={idx} className="group relative">
            {/* Bottom Dotted Border */}
            <div 
              className="absolute bottom-0 left-[-16px] right-[-16px] h-0 border-b border-[var(--border-color)] pointer-events-none z-10" 
              style={{ 
                maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
                WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
              }}
            />

            {/* Clickable Header Row */}
            <div
              onClick={() => setExpandedIndex(isOpen ? null : idx)}
              className="flex flex-col items-start gap-2.5 py-4 px-4 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer relative z-20 rounded-lg sm:gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between"
            >
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                {/* Logo wrapper */}
                <div className="size-10 shrink-0 rounded-[10px] border border-[var(--border-color)] bg-zinc-50 p-[2px] shadow-sm border-[var(--border-color)] dark:bg-[#111111] dark:shadow-md">
                  <div className="w-full h-full rounded-[7px] border border-black/5 dark:border-black/20 bg-white flex items-center justify-center overflow-hidden relative font-mono font-bold text-xs text-zinc-500">
                    {exp.logo === "LF" ? (
                      <span className="text-blue-500">LF</span>
                    ) : exp.logo === "GS" ? (
                      <span className="text-amber-500">GSoC</span>
                    ) : exp.logo === "V" ? (
                      <span className="text-zinc-900">▲</span>
                    ) : (
                      <span>{exp.logo}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 min-w-0 pr-2 sm:pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-bold leading-tight text-[var(--text-primary)] sm:text-[16px]">
                      {exp.company}
                    </span>
                  </div>
                  <span className="text-[13px] sm:text-[14px] text-[var(--text-secondary)] truncate">
                    {exp.role}
                  </span>
                </div>
              </div>

              {/* Term and Location */}
              <div className="flex flex-col items-start gap-0.5 text-left pr-5 pl-[52px] shrink-0 sm:pl-[56px] 2xl:mt-0 2xl:items-end 2xl:pl-0 2xl:text-right">
                <div className="flex items-center text-[13px] sm:text-[14px] font-medium text-[var(--text-primary)] relative">
                  <span>{exp.term}</span>
                  <ChevronDown 
                    className={`w-3.5 h-3.5 text-zinc-500 absolute -right-5 top-1/2 -translate-y-1/2 -mt-[1.5px] transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`} 
                  />
                </div>
                <span className="text-[13px] sm:text-[14px] text-[var(--text-secondary)]">
                  {exp.location}
                </span>
              </div>
            </div>

            {/* Expandable content area */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
                  className="overflow-hidden relative z-20"
                >
                  <div className="pb-6 pt-2 px-4">
                    {/* Stats metrics block if exists */}
                    {exp.stats && (
                      <div className="relative mb-6">
                        {/* Top dotted line */}
                        <div 
                          className="absolute top-0 inset-x-0 h-0 border-t border-[var(--border-color)]" 
                          style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }}
                        />
                        {/* Grid columns */}
                        <div className="grid max-w-full grid-cols-2 py-3 gap-y-4">
                          {exp.stats.map((stat, sIdx) => (
                            <div 
                              key={sIdx} 
                              className={`relative min-w-0 px-3 py-1 ${
                                sIdx % 2 === 0 ? "border-r border-[var(--border-color)]" : ""
                              }`}
                            >
                              <p className="text-[15px] font-mono font-bold leading-none text-[var(--text-primary)]">
                                {stat.value}
                              </p>
                              <p className="mt-1 text-[9px] font-mono font-medium uppercase text-[var(--text-muted)]">
                                {stat.label}
                              </p>
                            </div>
                          ))}
                        </div>
                        {/* Bottom dotted line */}
                        <div 
                          className="absolute bottom-0 inset-x-0 h-0 border-b border-[var(--border-color)]" 
                          style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }}
                        />
                      </div>
                    )}

                    {/* Bullet descriptions */}
                    <ul className="space-y-2 text-[13px] text-[var(--text-secondary)] leading-relaxed list-none pl-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-[var(--text-muted)] mt-[2px] select-none">&bull;</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {exp.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="px-2 py-0.5 rounded-[4px] border border-[var(--border-color)] bg-[var(--badge-bg)] text-[11px] font-medium text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
