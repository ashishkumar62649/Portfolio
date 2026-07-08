import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../data/config.json";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  
  const greetings = config.preloader.greetings;

  // Track actual document load state
  useEffect(() => {
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      const handleLoad = () => setPageLoaded(true);
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  useEffect(() => {
    // Organic steps for the progress percentage loader
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Cap loading progress at 90% until window is completely loaded
        if (prev >= 90 && !pageLoaded) {
          return 90;
        }

        const diff = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + diff, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [pageLoaded]);



  useEffect(() => {
    // Switch greeting tags based on progress percentage
    if (progress < 25) setGreetingIndex(0);
    else if (progress < 50) setGreetingIndex(1);
    else if (progress < 75) setGreetingIndex(2);
    else setGreetingIndex(3);
  }, [progress]);

  const getLogMessage = () => {
    for (const msg of config.preloader.logMessages) {
      if (progress >= msg.min && progress < msg.max) return msg.text;
    }
    return config.preloader.logMessages[config.preloader.logMessages.length - 1].text;
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100vh" }}
      transition={{ ease: [0.76, 0, 0.24, 1], duration: 1.0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between py-24 bg-[var(--bg-color)] text-[var(--text-primary)] select-none font-mono"
    >
      {/* Top section: System state */}
      <div className="text-[10px] tracking-[0.25em] opacity-40 uppercase">
        {config.preloader.version}
      </div>

      {/* Middle section: Greetings and Console Logs */}
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Visual Pulse Circle indicator */}
        <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[var(--border-color)] opacity-20 animate-ping" />
          <div className="w-4 h-4 rounded-full bg-[var(--text-primary)] opacity-80" />
        </div>

        <AnimatePresence mode="wait">
          <motion.h2
            key={greetingIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.9, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="text-[28px] sm:text-[36px] font-black tracking-tight text-center [text-shadow:-1px_0_0_rgba(0,200,255,0.2),1px_0_0_rgba(255,80,0,0.2)]"
          >
            {greetings[greetingIndex]}
          </motion.h2>
        </AnimatePresence>

        {/* Small systems check log console */}
        <div className="h-8 flex flex-col justify-center items-center">
          {progress >= 20 && (
            <span className="text-[11px] opacity-50 tracking-wider">
              {getLogMessage()}
            </span>
          )}
        </div>

        {/* Enter Button inside the Middle Section (Centrally positioned) */}
        <AnimatePresence>
          {progress === 100 && (
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: [1, 1.03, 1]
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                opacity: { duration: 0.4 },
                y: { type: "spring", stiffness: 200, damping: 14 },
                scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
              }}
              onClick={() => {
                const clickAudio = new Audio("/button.mp3");
                clickAudio.volume = 0.45;
                clickAudio.play().catch(() => {});
                onComplete();
              }}
              className="mt-6 px-8 py-2.5 border border-[var(--border-color)] rounded-[6px] text-[10px] font-mono font-bold tracking-[0.2em] uppercase bg-[var(--badge-bg)] hover:bg-[var(--card-hover-bg)] text-[var(--text-primary)] cursor-pointer shadow-md hover:shadow-lg dark:hover:shadow-white/5 active:scale-95 transition-all duration-300"
            >
              Enter Portfolio
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom section: Loading Progress indicator */}
      <div className="w-[85%] max-w-[360px] min-h-[52px] flex items-center justify-center">
        <AnimatePresence>
          {progress < 100 && (
            <motion.div 
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col gap-3 items-center"
            >
              {/* Sleek industrial loading progress bar */}
              <div className="w-full h-[6px] border border-[var(--border-color)] rounded-[3px] overflow-hidden p-[1px] bg-neutral-900/10 dark:bg-black/40">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.15 }}
                  className="h-full bg-[var(--text-primary)] rounded-[2px]"
                />
              </div>

              <div className="flex justify-between w-full text-[10px] tracking-widest opacity-60 font-semibold">
                <span>{config.preloader.finalLabel}</span>
                <span>{progress}%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
