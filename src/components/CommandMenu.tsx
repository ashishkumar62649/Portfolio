import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Monitor, Moon, Sun, Award, Code, GitMerge, FileText, Mail } from "lucide-react";
import config from "../data/config.json";

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setTheme: (theme: "light" | "dark" | "cyberpunk" | "retro" | "ibm") => void;
  scrollToSection: (id: string) => void;
  setView: (view: any) => void;
}

export default function CommandMenu({
  isOpen,
  onClose,
  setTheme,
  scrollToSection,
  setView
}: CommandMenuProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const items = [
    {
      name: "Go to Experience",
      icon: Award,
      action: () => {
        scrollToSection("experience");
        onClose();
      }
    },
    {
      name: "Go to Projects",
      icon: Code,
      action: () => {
        scrollToSection("projects");
        onClose();
      }
    },
    {
      name: "Go to Open Source",
      icon: GitMerge,
      action: () => {
        scrollToSection("open-source");
        onClose();
      }
    },
    {
      name: "Go to Skills",
      icon: Monitor,
      action: () => {
        scrollToSection("skills");
        onClose();
      }
    },
    {
      name: "Go to Blog",
      icon: FileText,
      action: () => {
        scrollToSection("blogs");
        onClose();
      }
    },
    {
      name: "Set Theme: Dark Mode",
      icon: Moon,
      action: () => {
        setTheme("dark");
        onClose();
      }
    },
    {
      name: "Set Theme: Light Mode",
      icon: Sun,
      action: () => {
        setTheme("light");
        onClose();
      }
    },
    {
      name: "Set Theme: Cyberpunk Mode",
      icon: Monitor,
      action: () => {
        setTheme("cyberpunk");
        onClose();
      }
    },
    {
      name: "Set Theme: Retro Mode",
      icon: Monitor,
      action: () => {
        setTheme("retro");
        onClose();
      }
    },
    {
      name: "Set Theme: IBM Mode",
      icon: Monitor,
      action: () => {
        setTheme("ibm");
        onClose();
      }
    },
    {
      name: "Open GitHub Profile",
      icon: Code,
      action: () => {
        window.open(config.commandMenu.githubUrl, "_blank");
        onClose();
      }
    },
    {
      name: "Send an Email (Contact Form)",
      icon: Mail,
      action: () => {
        setView("contact");
        window.scrollTo({ top: 0, behavior: "smooth" });
        onClose();
      }
    }
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl z-10"
          >
            {/* Input bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-zinc-900/50">
              <Search className="w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 border-none outline-none"
              />
              <span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-1.5 py-0.5 rounded font-mono select-none">
                ESC
              </span>
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto py-2">
              {filteredItems.length > 0 ? (
                filteredItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors duration-150 text-sm group"
                    >
                      <Icon className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                      <span className="flex-grow">{item.name}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center text-sm text-zinc-500">
                  No results found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
