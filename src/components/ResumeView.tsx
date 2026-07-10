import { Download, ExternalLink, FileText } from "lucide-react";
import config from "../data/config.json";
import profile from "../data/profile.json";

export default function ResumeView() {
  return (
    <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
      <div className="flex items-center justify-between p-4 bg-[var(--badge-bg)] border border-[var(--border-color)] border-b-0 rounded-t-xl">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-red-500" />
          <div className="flex flex-col text-left">
            <span className="font-semibold text-sm text-[var(--text-primary)]">{profile.resume.label}</span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">{config.resume.pdfLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={profile.resume.pdf} target="_blank" rel="noopener noreferrer"
            className="p-2 border border-[var(--border-color)] rounded-[6px] text-[var(--text-primary)] hover:bg-[var(--card-hover-bg)] cursor-pointer active:scale-95 transition-all"
            title={config.resume.openPdfTooltip}><ExternalLink className="w-4 h-4" /></a>
          <a href={profile.resume.docx} download
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--text-primary)] hover:opacity-90 text-[var(--bg-color)] border border-[var(--border-color)] rounded-[6px] text-xs font-mono font-bold cursor-pointer active:scale-95 transition-all shadow-md"
            title={config.resume.downloadDocxTooltip}><Download className="w-3.5 h-3.5" />{config.buttons.download}</a>
        </div>
      </div>
      <div className="w-full border border-[var(--border-color)] rounded-b-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 shadow-md">
        <iframe src={`${profile.resume.pdf}#toolbar=0`} className="w-full h-[750px] border-none" title={config.resume.pdfPreviewTitle} />
      </div>
      <div className="mt-12 text-left">
        <h2 className="text-[13px] text-[var(--text-muted)] mb-2 font-mono">{config.resume.lookingForAnother}</h2>
        <div className="flex flex-wrap gap-2">
          <a href={profile.resume.txt} target="_blank" rel="noopener noreferrer" className="group relative block rounded-[4px] px-3 py-1.5 text-[12px]">
            <span aria-hidden="true" className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200 bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)]" />
            <span className="relative flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-[var(--text-primary)]"><FileText className="w-3.5 h-3.5" />{config.resume.viewRawText}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
