interface BlogPostProps {
  slug: string;
}

export default function BlogPost({ slug }: BlogPostProps) {
  if (slug !== "building-premium-portfolio") {
    return (
      <div className="py-12 text-center text-sm font-mono text-[var(--text-muted)] animate-pulse">
        ARTICLE NOT FOUND
      </div>
    );
  }

  return (
    <div className="text-left w-full max-w-2xl mx-auto py-4 animate-fade-in font-sans">
      {/* Article Metadata Header */}
      <div className="flex flex-col gap-4 border-b border-[var(--border-color)] pb-6 mb-8">
        <h1 className="text-[22px] sm:text-[28px] font-bold text-[var(--text-primary)] leading-tight tracking-tight">
          Building a Premium Software Engineer Portfolio: Architecture, Custom Themes, &amp; COM PDF Pipelines
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
          <span className="bg-[var(--badge-bg)] border border-[var(--border-color)] px-2 py-0.5 rounded-[4px]">Jul 2026</span>
          <span>&bull;</span>
          <span>6 min read</span>
          <span>&bull;</span>
          <span>242 views</span>
        </div>
      </div>

      {/* Article Body */}
      <div className="space-y-6 text-[14px] sm:text-[15px] leading-relaxed text-[var(--text-primary)] font-normal">
        <p>
          As software developers, our portfolios are our digital handshakes. But most developer portfolios fall into one of two traps: they are either generic templates that look identical, or over-engineered three-dimensional worlds that crash mobile browsers.
        </p>

        <p>
          For my personal portfolio, the goal was different. I wanted to design a dashboard that was <strong>highly structured</strong>, <strong>minimalist</strong>, and <strong>immersive</strong>, blending terminal retro aesthetics with modern design systems.
        </p>

        {/* Dynamic GIF 1 */}
        <div className="my-8 rounded-xl overflow-hidden border border-[var(--border-color)] bg-zinc-950 aspect-[16/9] relative flex items-center justify-center">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHB1dWZlNHp6dzR2aDFrcWJvZzF4bDRvZnBqdDk4YnpnZnhnN3lyZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif" 
            alt="Terminal Coding" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--text-primary)] pt-4 tracking-tight">
          1. The Tech Stack: Fast, Modern, and Light
        </h2>
        <p>
          I selected <strong>React</strong> as the library core, paired with the next-generation bundler <strong>Vite</strong>. Rather than introducing heavy frameworks, the UI is styled with <strong>Vanilla CSS Variables</strong> packaged inside a lightweight layout configuration. For fluid spring transitions, I utilized <strong>Framer Motion</strong>.
        </p>
        <p>
          This setup enables the entire application bundle to build in under 300 milliseconds and serves a production bundle compressed down to an optimized <strong>368 kB</strong>.
        </p>

        <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--text-primary)] pt-4 tracking-tight">
          2. The Multi-Theme CSS Variable Pipeline
        </h2>
        <p>
          A central feature is the interactive theme cycler. Rather than relying on simple dark/light toggles, the system manages a 5-way theme rotation (Default Dark, Light, Cyberpunk, Retro, and IBM Cobalt).
        </p>
        <p>
          This is implemented by declaring root CSS variables and mapping them to dynamic theme attributes injected onto the <code>&lt;body&gt;</code> element:
        </p>

        <pre className="p-4 bg-[var(--badge-bg)] border border-[var(--border-color)] rounded-[6px] text-xs font-mono text-[var(--text-primary)] overflow-x-auto leading-normal">
{`/* CSS Theme Variables Mapper */
body.theme-cyberpunk {
  --bg-color: #0a0514;
  --text-primary: #fdfaf6;
  --accent-color: #d946ef;
  --border-color: rgba(217, 70, 239, 0.2);
}

body.theme-retro {
  --bg-color: #0c0e0d;
  --text-primary: #22c55e;
  --accent-color: #22c55e;
  --border-color: rgba(34, 197, 94, 0.3);
}`}
        </pre>

        {/* Dynamic GIF 2 */}
        <div className="my-8 rounded-xl overflow-hidden border border-[var(--border-color)] bg-zinc-950 aspect-[16/9] relative flex items-center justify-center">
          <img 
            src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2MzOXB6N3U3YnJndzI4MmdhbnUzMWJqOTcxbWhwOW81bnYxNmlyeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L1R1tvI9g6ISgMw1Ly/giphy.gif" 
            alt="Cyberpunk Interface" 
            className="w-full h-full object-cover opacity-80"
          />
        </div>

        <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--text-primary)] pt-4 tracking-tight">
          3. Automating PDF Generation via PowerShell COM Pipelines
        </h2>
        <p>
          Managing resumes in multiple formats (Word, PDF) is a known headache for job-seeking engineers. To resolve this, I automated the pipeline. The resume source is written inside Microsoft Word as a <code>.docx</code> file.
        </p>
        <p>
          When updates are made, a native Windows PowerShell script spins up a background Word COM client interface, translates the document to a PDF with print-ready margins, and saves it directly to the statically served folder:
        </p>

        <pre className="p-4 bg-[var(--badge-bg)] border border-[var(--border-color)] rounded-[6px] text-xs font-mono text-[var(--text-primary)] overflow-x-auto leading-normal">
{`# PowerShell COM Document Compiler
$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open("E:\\new\\Ashish_Kumar_Resume.docx")
$doc.SaveAs("E:\\new\\public\\Ashish_Kumar_Resume.pdf", 17) # 17 = wdFormatPDF
$doc.Close()
$word.Quit()`}
        </pre>

        <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--text-primary)] pt-4 tracking-tight">
          4. Bypassing LinkedIn CDN Loading Interruptions
        </h2>
        <p>
          External image servers (like Simpleicons CDN and raw SVGs) are often flagged by client-side adblockers. To ensure the LinkedIn logo is rendered immediately and reliably, I embedded the vector directly into the React tree as an inline JSX SVG component, guaranteeing 100% display uptime.
        </p>

        <h2 className="text-[17px] sm:text-[19px] font-bold text-[var(--text-primary)] pt-4 tracking-tight">
          5. Live API Integrations
        </h2>
        <p>
          Finally, the site hooks into two public endpoints to keep the portfolio active:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>GitHub Scraping API</strong>: Fetches contribution history to populate the green commits heatmap in real-time.</li>
          <li><strong>GitHub Search Issues API</strong>: Dynamically maps merged, open, and closed pull requests, keeping open-source achievements in sync.</li>
        </ul>

        <div className="border-t border-[var(--border-color)] pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-secondary)] font-mono">
            Written by Ashish Kumar &bull; Verified Build Online
          </p>
          <a 
            href="https://github.com/ashishkumar62649" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[var(--text-primary)] text-[var(--bg-color)] rounded-[6px] text-xs font-mono font-bold hover:opacity-90 transition-opacity flex items-center gap-1.5"
          >
            Open GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
}
