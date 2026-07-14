import { Play } from "lucide-react";
import projectsData from "../data/projects.json";
import config from "../data/config.json";
import type { ProjectItem } from "../data/types";
import { highlightKeywords } from "../utils/text";

const techSlugMap: Record<string, string> = config.techSlugMap;
const projects: ProjectItem[] = projectsData as ProjectItem[];

const techColors: Record<string, string> = {
  typescript: "3178c6",
  react: "61dafb",
  cesium: "002a4d",
  fastify: "000000",
  postgresql: "4169e1",
  python: "3776ab",
  langchain: "1c3c3a",
  fastapi: "009688",
  streamlit: "ff4b4b",
  scikitlearn: "f7931e",
  pandas: "150458",
  numpy: "013243",
  jupyter: "f37626",
  adobe: "ff0000",
  microsoftexcel: "107c41",
  powerbi: "f2c811",
  sqlite: "003b57"
};

export function TechIcons({ technologies, theme }: { technologies: string[]; theme: string }) {
  const slugsList: string[] = [];
  technologies.forEach((tech) => {
    const slug = techSlugMap[tech.toLowerCase()] || null;
    if (slug && !slugsList.includes(slug)) {
      slugsList.push(slug);
    }
  });

  const getIconUrl = (slug: string) => {
    if (slug === "microsoftexcel" || slug === "powerbi") {
      return `/icons/${slug}.svg`;
    }
    // Contrast overrides for dark mode
    if (slug === "fastify" || slug === "cesium" || slug === "langchain" || slug === "nextdotjs" || slug === "github") {
      return `/icons/simple/${slug}-${theme === "light" ? "000000" : "ffffff"}.svg`;
    }
    const color = techColors[slug] || "71717a";
    return `/icons/simple/${slug}-${color}.svg`;
  };

  return (
    <div className="flex items-center gap-2">
      {slugsList.map((slug) => (
        <img 
          key={slug} 
          src={getIconUrl(slug)} 
          alt={slug} 
          title={slug}
          className="w-3.5 h-3.5 opacity-90 hover:opacity-100 transition-opacity object-contain" 
        />
      ))}
    </div>
  );
}

interface ProjectsGridProps {
  theme: string;
}

export default function ProjectsGrid({ theme }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {projects.slice(0, 4).map((proj, idx) => (
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
              <h3 className="text-[17px] font-black text-[var(--text-primary)] tracking-tight leading-tight group-hover:underline decoration-2 decoration-[var(--text-primary)] underline-offset-4">
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
              {highlightKeywords(proj.description)}
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
                {config.buttons.viewProject}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
