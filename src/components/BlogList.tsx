import blogsData from "../data/blogs.json";
import type { BlogItem } from "../data/types";

const blogs: BlogItem[] = blogsData;

interface BlogListProps {
  onSelectBlog: (slug: string) => void;
}

export default function BlogList({ onSelectBlog }: BlogListProps) {
  const handleBlogClick = (blog: BlogItem) => {
    if (blog.slug === "building-premium-portfolio") {
      onSelectBlog(blog.slug);
    } else if (blog.url) {
      window.open(blog.url, "_blank");
    }
  };

  return (
    <div className="flex flex-col w-full text-left">
      {blogs.map((blog, idx) => (
        <div 
          key={idx} 
          className="relative flex flex-col gap-2 py-5 px-4 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/10 transition-colors duration-150 group cursor-pointer"
          onClick={() => handleBlogClick(blog)}
        >
          {/* Bottom Dotted Divider */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-0 border-b border-[var(--border-color)] pointer-events-none z-10" 
            style={{ 
              maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', 
              WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' 
            }}
          />

          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <h3 className="text-[14px] sm:text-[15px] font-bold text-[var(--text-primary)] leading-snug group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                {blog.title}
              </h3>
              <div className="flex items-center gap-2.5 text-[11px] font-mono text-[var(--text-muted)]">
                <span>{blog.date}</span>
                <span>&bull;</span>
                <span>{blog.reads} reads</span>
              </div>
            </div>
            
            {/* Link Arrow */}
            <span className="text-[14px] font-medium text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors pl-2 shrink-0">
              &rarr;
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {blog.tags.map((tag) => (
              <span 
                key={tag} 
                className="px-1.5 py-0.5 rounded-[4px] border border-[var(--border-color)] bg-[var(--badge-bg)] text-[10px] font-medium text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
