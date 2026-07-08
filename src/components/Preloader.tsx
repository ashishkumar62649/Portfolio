import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../data/config.json";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);
  
  const greetings = config.preloader.greetings;

  useEffect(() => {
    // Organic steps for the progress percentage loader
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.floor(Math.random() * 12) + 6;
        return Math.min(prev + diff, 100);
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Complete the loading screen after a short presentation delay at 100%
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

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
      </div>

      {/* Bottom section: Loading Progress indicator */}
      <div className="w-[85%] max-w-[360px] flex flex-col gap-3 items-center">
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
      </div>
    </motion.div>
  );
}
