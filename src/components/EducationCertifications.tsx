import { useState } from "react";
import { GraduationCap, Award, BookOpen } from "lucide-react";
import educationData from "../data/education.json";

type Tab = "college" | "school" | "certificates";

export default function EducationCertifications() {
  const [activeTab, setActiveTab] = useState<Tab>("college");
  const tabNames: Tab[] = ["college", "school", "certificates"];

  return (
    <div className="w-full flex flex-col text-left">
      {/* Header bar with tabs */}
      <div className="py-2 relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-[18px] font-bold text-[var(--text-primary)] tracking-tight">
          Education & Credentials
        </h2>

        {/* Sliding tab selector */}
        <div className="flex items-center gap-2 relative z-20 group mr-[8px]">
          <div className="absolute -inset-[5px] border border-[var(--border-color)] rounded-[11px] pointer-events-none transition-colors duration-300 group-hover:border-[var(--border-color)] dark:group-hover:border-white/10" />
          <div className="relative grid grid-cols-3 p-1 bg-[var(--badge-bg)] rounded-[6px] border border-[var(--border-color)] shadow-sm shadow-black/20 dark:shadow-lg dark:shadow-black/80 w-fit select-none">
            {/* Sliding backdrop */}
            <div 
              className="absolute top-1 bottom-1 left-1 rounded-[4px] bg-white dark:bg-[#1e1e20] border border-[var(--border-color)] shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] transform will-change-transform"
              style={{
                width: "calc((100% - 8px) / 3)",
                transform: `translateX(${tabNames.indexOf(activeTab) * 100}%)`
              }}
            />
            {tabNames.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`z-10 relative px-3.5 py-1.5 text-[12px] font-medium text-center transition-colors duration-200 capitalize ${
                  activeTab === tab
                    ? "text-[var(--text-primary)] font-bold"
                    : "text-[var(--text-secondary)] hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {tab === "college" ? "College" : tab === "school" ? "School" : "Certs"}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Dotted Border */}
        <div 
          className="absolute bottom-0 left-[-100vw] right-[-100vw] h-0 border-b border-[var(--border-color)] pointer-events-none" 
          style={{ 
            maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
            WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
          }}
        />
        <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-[var(--crosshair-color)] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
        <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-[var(--crosshair-color)] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
      </div>

      {/* Tab Contents */}
      <div className="relative pt-4 pb-2 min-h-[160px] flex flex-col">
        {activeTab === "college" && (
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
              <div>
                <h3 className="text-[15px] font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[var(--text-primary)]" />
                  {educationData.college.name}
                </h3>
                <p className="text-[13px] font-medium text-[var(--text-secondary)] mt-0.5">
                  {educationData.college.degree}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-[var(--badge-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-[4px]">
                  {educationData.college.expected}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              <div className="p-3 rounded-[6px] border border-[var(--border-color)] bg-[var(--badge-bg)]">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-mono font-semibold">Cumulative CPI</p>
                <p className="text-[20px] font-bold text-[var(--text-primary)] mt-1 font-mono">{educationData.college.cpi.value}</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{educationData.college.cpi.note}</p>
              </div>
              <div className="p-3 rounded-[6px] border border-[var(--border-color)] bg-[var(--badge-bg)]">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-mono font-semibold">Trimester Grades</p>
                {educationData.college.trimesterGrades.map((grade, i) => (
                  <p key={i} className="text-[13px] font-semibold text-[var(--text-primary)] mt-2 font-mono">{grade}</p>
                ))}
              </div>
              <div className="p-3 rounded-[6px] border border-[var(--border-color)] bg-[var(--badge-bg)]">
                <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-mono font-semibold">Current Status</p>
                <p className="text-[13px] font-bold text-[var(--text-primary)] mt-2">{educationData.college.status.label}</p>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1">{educationData.college.status.note}</p>
              </div>
            </div>

            <div className="mt-2">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">Relevant Areas of Study</h4>
              <div className="flex flex-wrap gap-1.5">
                {educationData.college.studyAreas.map((area, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 bg-[var(--badge-bg)] border border-[var(--border-color)] text-[var(--text-secondary)] rounded-[4px] font-semibold">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "school" && (
          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {educationData.school.map((item, i) => (
                <div key={i} className="p-4 rounded-[6px] border border-[var(--border-color)] bg-[var(--badge-bg)] flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-[var(--text-primary)] mt-0.5 shrink-0" />
                  <div>
                    <h3 className="text-[14px] font-bold text-[var(--text-primary)]">{item.label}</h3>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">Year: {item.year}</p>
                    <p className="text-[18px] font-bold text-[var(--text-primary)] mt-2 font-mono">{item.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="flex flex-col gap-3 py-2">
            {educationData.certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-[6px] border border-[var(--border-color)] bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] transition-colors duration-150">
                <Award className="w-5 h-5 text-[var(--text-primary)] shrink-0" />
                <div className="text-left">
                  <h3 className="text-[13px] font-bold text-[var(--text-primary)]">{cert.name}</h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{cert.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
