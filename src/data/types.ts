export interface ProjectItem {
  title: string;
  status: "Live" | "Building" | "Not Started";
  description: string;
  githubUrl: string;
  liveUrl?: string;
  previewColor: string;
  technologies: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  term: string;
  location: string;
  logo: string;
  stats?: Array<{ value: string; label: string }>;
  bullets: string[];
  tags: string[];
}

export interface SkillItem {
  name: string;
  slug: string;
  color: string;
}

export interface SocialItem {
  name: string;
  href: string;
  slug: string;
  brandColorLight: string;
  brandColorDark: string;
  brandColor?: string;
  hasCustomIcon?: boolean;
}

export interface ProfileData {
  name: string;
  tagline: string;
  bio: string[];
  bioHighlights: Array<{ text: string; bold?: boolean }>;
  avatar: string;
  githubUsername: string;
  email: string;
  resume: {
    pdf: string;
    docx: string;
    txt: string;
    label: string;
  };
}

export interface EducationData {
  college: {
    name: string;
    degree: string;
    expected: string;
    cpi: { value: string; note: string };
    trimesterGrades: string[];
    status: { label: string; note: string };
    studyAreas: string[];
  };
  school: Array<{
    label: string;
    year: string;
    score: string;
  }>;
  certifications: Array<{
    name: string;
    description: string;
  }>;
}

export interface BlogItem {
  slug: string;
  title: string;
  date: string;
  reads: number;
  tags: string[];
  url?: string;
}

export interface ContributionData {
  username: string;
  fallbackTotal: number;
  defaultCounts: Record<string, number>;
  mockPRs: Record<string, Array<{
    id: number;
    title: string;
    repo: string;
    url: string;
    number: number;
    created_at: string;
  }>>;
}

export interface SidebarSection {
  id: string;
  label: string;
}

export interface ConfigData {
  videos: string[];
  sidebarSections: SidebarSection[];
  sectionIds: string[];
  themes: string[];
  preloader: {
    greetings: string[];
    version: string;
    logMessages: Array<{ min: number; max: number; text: string }>;
    finalLabel: string;
  };
  footer: {
    quote: string;
    author: string;
  };
  commandMenu: {
    githubUrl: string;
  };
  techSlugMap: Record<string, string>;
}
