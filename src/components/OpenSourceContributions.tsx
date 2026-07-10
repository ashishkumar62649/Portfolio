import { useState, useEffect } from "react";
import contributionsData from "../data/contributions.json";
import profileData from "../data/profile.json";

interface PullRequest {
  id: number;
  title: string;
  repo: string;
  url: string;
  number: number;
  created_at: string;
}

interface OpenSourceContributionsProps {
  isFullArchive?: boolean;
  setView?: (view: "portfolio" | "contact" | "resume" | "projects" | "pull-requests") => void;
}

const mockPRs = contributionsData.mockPRs;

export default function OpenSourceContributions({ isFullArchive = false, setView }: OpenSourceContributionsProps) {
  const [activeTab, setActiveTab] = useState<"merged" | "open" | "closed">("merged");
  const [prs, setPRs] = useState<Record<string, PullRequest[]>>(mockPRs);
  const [totalCount, setTotalCount] = useState<Record<string, number>>(contributionsData.defaultCounts);
  const [loading, setLoading] = useState<Record<string, boolean>>({
    merged: false,
    open: false,
    closed: false
  });

  const githubUser = profileData.githubUsername;

  const fetchPRsForTab = async (tab: "merged" | "open" | "closed") => {
    // If we already fetched non-mock data, or if we are loading, skip
    if (loading[tab]) return;

    setLoading(prev => ({ ...prev, [tab]: true }));

    let queryState = "";
    if (tab === "merged") queryState = "is:merged";
    else if (tab === "open") queryState = "is:open";
    else if (tab === "closed") queryState = "is:closed+is:unmerged";

    const url = `https://api.github.com/search/issues?q=author:${githubUser}+type:pr+${queryState}&sort=created-desc&per_page=50`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Rate limit or connection error");
      const data = await res.json();

      if (data.items) {
        const formattedPRs: PullRequest[] = data.items.map((item: any) => {
          // Parse repository name from repo url (e.g. https://api.github.com/repos/user/repo)
          const repoParts = item.repository_url.split("/repos/");
          const repoName = repoParts.length > 1 ? repoParts[1] : "unknown/repo";

          return {
            id: item.id,
            title: item.title,
            repo: repoName,
            url: item.html_url,
            number: item.number,
            created_at: item.created_at
          };
        });

        setPRs(prev => ({ ...prev, [tab]: formattedPRs }));
        setTotalCount(prev => ({ ...prev, [tab]: data.total_count }));
      }
    } catch (err) {
      console.warn(`GitHub API fetch failed for ${tab}, using local fallback details.`, err);
      // Keep fallbacks
    } finally {
      setLoading(prev => ({ ...prev, [tab]: false }));
    }
  };

  // Fetch the active tab once, including the initial merged tab.
  useEffect(() => {
    fetchPRsForTab(activeTab);
    // Switching tabs is the only trigger; loading state must not refetch.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const activePRs = prs[activeTab] || [];
  const displayPRs = isFullArchive ? activePRs : activePRs.slice(0, 4);
  const remainingCount = Math.max(0, (totalCount[activeTab] || activePRs.length) - 4);

  return (
    <div className="text-left w-full mt-4">
      {/* Title block & Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {!isFullArchive && (
          <h2 className="text-[13px] font-mono font-extrabold tracking-[0.25em] text-[var(--text-primary)] uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[var(--text-primary)] inline-block rounded-[1px]" />
            Open Source Contributions
          </h2>
        )}
        
        {/* Tab switcher */}
        <div className="flex p-[3px] rounded-[8px] border border-[var(--border-color)] bg-[var(--badge-bg)] w-fit shrink-0 ml-auto">
          {(["merged", "open", "closed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[11px] font-mono font-medium rounded-[5px] transition-all capitalize cursor-pointer ${
                activeTab === tab
                  ? "bg-[var(--text-primary)] text-[var(--bg-color)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Contributions list */}
      <div className="space-y-6">
        {loading[activeTab] && activePRs.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[var(--text-muted)] animate-pulse">
            LOADING GITHUB CONTRIBUTIONS...
          </div>
        ) : displayPRs.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[var(--text-muted)]">
            No pull requests found.
          </div>
        ) : (
          displayPRs.map((pr) => (
            <div key={pr.id} className="flex items-start gap-3.5 group">
              {/* Purple bullet dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
              
              <div className="flex flex-col gap-0.5 text-left">
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-bold text-[var(--text-primary)] leading-snug hover:underline group-hover:text-[var(--accent-color)] transition-colors"
                >
                  {pr.title}
                </a>
                <span className="text-[11px] font-mono text-[var(--text-secondary)]">
                  {pr.repo}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer trigger button for landing page */}
      {!isFullArchive && remainingCount > 0 && setView && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              setView("pull-requests");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="px-5 py-2 border border-[var(--border-color)] rounded-[6px] text-xs font-mono font-bold bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all shadow-md"
          >
            View All ({remainingCount} more) &rarr;
          </button>
        </div>
      )}

      {/* View more on GitHub button for full archive view */}
      {isFullArchive && (
        <div className="flex justify-center mt-12">
          <a
            href={`https://github.com/${githubUser}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-2.5 border border-[var(--border-color)] rounded-[6px] text-xs font-mono font-bold bg-[var(--text-primary)] text-[var(--bg-color)] hover:opacity-90 cursor-pointer active:scale-95 transition-all shadow-md"
          >
            View more on GitHub
          </a>
        </div>
      )}
    </div>
  );
}
