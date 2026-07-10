import type { Dispatch, FormEventHandler, SetStateAction } from "react";
import socialsData from "../data/socials.json";
import config from "../data/config.json";
import type { SocialItem } from "../data/types";
import SocialHoverCard from "./DeferredSocialHoverCard";

type FormData = { name: string; email: string; message: string };
type Status = "idle" | "sending" | "success" | "error";

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#0a66c2] mr-1.5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

export default function ContactView({ theme, formData, setFormData, submitStatus, onSubmit }: {
  theme: string;
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
  submitStatus: Status;
  onSubmit: FormEventHandler;
}) {
  const socials = socialsData.map((social: SocialItem) => ({
    ...social,
    brandColor: theme === "light" ? social.brandColorLight : social.brandColorDark,
  }));

  return (
    <div className="flex flex-col text-left mt-4 w-full animate-fade-in">
      <form onSubmit={onSubmit} className="flex flex-col gap-2">
        {([
          ["name", "text", config.contactForm.nameLabel, config.contactForm.namePlaceholder],
          ["email", "email", config.contactForm.emailLabel, config.contactForm.emailPlaceholder],
        ] as const).map(([field, type, label, placeholder]) => (
          <div key={field} className="flex flex-col gap-1.5 py-6 border-b border-[var(--border-color)]">
            <label className="text-[10px] font-bold font-mono tracking-widest text-[var(--text-muted)] uppercase">{label}</label>
            <input type={type} required placeholder={placeholder} value={formData[field]}
              onChange={(event) => setFormData((current) => ({ ...current, [field]: event.target.value }))}
              className="w-full bg-transparent border-none outline-none text-[14px] text-[var(--text-primary)] placeholder:text-zinc-600 dark:placeholder:text-zinc-500 py-1 px-0 focus:outline-none focus:ring-0" />
          </div>
        ))}
        <div className="flex flex-col gap-1.5 py-6 border-b border-[var(--border-color)]">
          <label className="text-[10px] font-bold font-mono tracking-widest text-[var(--text-muted)] uppercase">{config.contactForm.messageLabel}</label>
          <textarea required rows={4} placeholder={config.contactForm.messagePlaceholder} value={formData.message}
            onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
            className="w-full bg-transparent border-none outline-none text-[14px] text-[var(--text-primary)] placeholder:text-zinc-600 dark:placeholder:text-zinc-500 py-1 px-0 resize-none focus:outline-none focus:ring-0" />
        </div>
        {submitStatus === "success" && <div className="mt-4 p-3 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-mono">{config.contactForm.successMessage}</div>}
        {submitStatus === "error" && <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">Failed to send message. Please try again or email directly.</div>}
        <button type="submit" disabled={submitStatus === "sending"}
          className="mx-auto mt-12 px-6 py-2 border border-[var(--border-color)] rounded-[6px] text-xs font-mono font-bold bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] cursor-pointer active:scale-95 transition-all shadow-md disabled:opacity-50">
          {submitStatus === "sending" ? config.contactForm.sendingLabel : config.contactForm.sendLabel}
        </button>
      </form>
      <div className="mt-16 text-left">
        <h2 className="text-[13px] text-[var(--text-muted)] mb-2 font-mono">{config.socialsSection.contactLabel}</h2>
        <div className="flex flex-wrap gap-2">
          {socials.map((social) => (
            <SocialHoverCard key={social.name} platform={social.slug}>
              <a href={social.href} target="_blank" rel="noopener noreferrer" className="group relative block rounded-[4px] px-3 py-1.5 text-[12px]">
                <span aria-hidden="true" className="absolute inset-0 rounded-[4px] overflow-hidden transition-colors duration-200 bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] border border-[var(--border-color)]" />
                <span className="relative flex items-center gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-[var(--text-primary)]">
                  {social.hasCustomIcon ? <LinkedinIcon /> : <img src={`/icons/simple/${social.slug}-${social.brandColor}.svg`} alt="" className="w-3.5 h-3.5 opacity-90 mr-1.5" />}
                  {social.name}
                </span>
              </a>
            </SocialHoverCard>
          ))}
        </div>
      </div>
    </div>
  );
}
