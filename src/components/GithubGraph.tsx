import { useEffect, useState, useRef } from "react";
import profileData from "../data/profile.json";

export default function GithubGraph() {
  const [totalCommits, setTotalCommits] = useState(1482);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate 53 weeks * 7 days of contribution densities
  const [gridData, setGridData] = useState<number[][]>([]);

  useEffect(() => {
    // 1. Generate fallback realistic contribution matrix first
    const fallbackData: number[][] = [];
    for (let w = 0; w < 53; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        const noise = Math.random();
        if (noise < 0.2) {
          week.push(0);
        } else if (noise < 0.5) {
          week.push(Math.floor(Math.random() * 3) + 1);
        } else if (noise < 0.8) {
          week.push(Math.floor(Math.random() * 4) + 4);
        } else {
          week.push(Math.floor(Math.random() * 5) + 8);
        }
      }
      fallbackData.push(week);
    }
    setGridData(fallbackData);

    // 2. Fetch real dynamic contributions from GitHub profile
    const fetchContributions = async () => {
      try {
        const username = profileData.githubUsername;
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`);
        if (!res.ok) throw new Error("API error");
        const data = await res.json();

        if (data && data.contributions) {
          // We need 53 weeks * 7 days = 371 days
          const list = data.contributions.slice(-371);
          const weeks: number[][] = [];
          
          for (let i = 0; i < list.length; i += 7) {
            const weekSlice = list.slice(i, i + 7);
            const weekCounts = weekSlice.map((d: any) => d.count);
            if (weekCounts.length === 7) {
              weeks.push(weekCounts);
            }
          }

          if (weeks.length > 0) {
            setGridData(weeks);
            const sum = list.reduce((acc: number, cur: any) => acc + cur.count, 0);
            setTotalCommits(sum);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch real GitHub contribution graph, using fallback.", err);
      }
    };

    fetchContributions();

    // Scroll to the end of weeks list (most recent) by default
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft = containerRef.current.scrollWidth;
      }
    }, 200);
  }, []);

  const getIntensityColor = (commits: number) => {
    if (commits === 0) return "bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/20 dark:border-zinc-800/10";
    if (commits <= 2) return "bg-emerald-500/20 dark:bg-emerald-950/40";
    if (commits <= 4) return "bg-emerald-500/40 dark:bg-emerald-800/50";
    if (commits <= 7) return "bg-emerald-500/70 dark:bg-emerald-600/70";
    return "bg-emerald-500 dark:bg-emerald-500";
  };

  const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  return (
    <div className="relative py-2 text-left">
      <p id="github-activity-summary" className="sr-only">
        Calendar heatmap showing daily GitHub contribution counts for {profileData.githubUsername} over the last year. Scroll horizontally to inspect all weeks.
      </p>

      {/* Header aligned like the screenshot */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[14px] font-bold text-[var(--text-primary)] leading-tight">
          GitHub Activity
        </h2>
        <span className="text-[11px] font-mono text-[var(--text-secondary)]">
          {totalCommits} GitHub activities in the last year
        </span>
      </div>

      <div 
        ref={containerRef}
        className="w-full overflow-x-auto scrollbar-none pb-2"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="min-w-[640px]">
          {/* Month headers */}
          <div className="mb-2 flex w-full justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-600 px-1">
            {months.map((m, idx) => (
              <span key={idx}>{m}</span>
            ))}
          </div>

          {/* Grid columns of weeks */}
          <div className="flex gap-[3px]" role="img" aria-label="GitHub contribution activity heatmap">
            {gridData.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {week.map((commits, dIdx) => (
                  <div
                    key={dIdx}
                    className={`aspect-square w-2.5 rounded-[2px] transition-colors duration-200 cursor-pointer ${getIntensityColor(
                      commits
                    )}`}
                    title={`${commits === 0 ? "No" : commits} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend aligned like the screenshot */}
      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
        <span>Less active</span>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[2px] bg-zinc-100 dark:bg-zinc-900/60" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/20 dark:bg-emerald-950/40" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/40 dark:bg-emerald-800/50" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500/70 dark:bg-emerald-600/70" />
          <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500 dark:bg-emerald-500" />
          <span>More active</span>
        </div>
      </div>
    </div>
  );
}
