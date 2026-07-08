import React from "react";

export function highlightKeywords(text: string): React.ReactNode[] | string {
  if (!text) return "";
  
  const keywords = [
    "AI & Data Science",
    "IIT Guwahati",
    "intelligent systems",
    "agentic workflows",
    "data-driven products",
    "machine learning",
    "scikit-learn",
    "LangGraph",
    "LangChain",
    "REST APIs",
    "LLM workflows",
    "RAG/agent design",
    "anomaly detection systems",
    "god-eyes",
    "AI-Codebase-Onboarding-Agent",
    "AI-RFP-Proposal-Generative-Agent",
    "anomaly detection",
    "RAG",
    "LLM",
    "APIs",
    "full-stack",
    "Python",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "FastAPI",
    "Docker",
    "AWS",
    "agentic",
    "mathematics",
    "physics",
    "Google Summer of Code",
    "Vercel",
    "LangChain-driven",
    "vector database",
    "embeddings",
    "fine-tuning"
  ];

  // Sort keywords by length descending to avoid conflicts
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);

  // Escape special characters and build regex
  const escapedKeywords = sortedKeywords.map(k => k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const regex = new RegExp(`\\b(${escapedKeywords.join('|')})\\b`, 'gi');

  const parts = text.split(regex);
  return parts.map((part, index) => {
    const isKeyword = keywords.some(k => k.toLowerCase() === part.toLowerCase());
    return isKeyword ? (
      <strong key={index} className="font-extrabold text-[var(--text-primary)]">
        {part}
      </strong>
    ) : (
      part
    );
  });
}
