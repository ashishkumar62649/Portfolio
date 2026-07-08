import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Quote {
  author: string;
  text: string;
}

const quotes: Quote[] = [
  { author: "Albert Einstein", text: "“Imagination is more important than knowledge.”" },
  { author: "Isaac Newton", text: "“If I have seen further, it is by standing on the shoulders of giants.”" },
  { author: "Marie Curie", text: "“Nothing in life is to be feared, it is only to be understood.”" },
  { author: "Richard Feynman", text: "“What I cannot create, I do not understand.”" },
  { author: "Carl Sagan", text: "“Somewhere, something incredible is waiting to be known.”" },
  { author: "Leonardo da Vinci", text: "“Learning never exhausts the mind.”" },
  { author: "Aristotle", text: "“We are what we repeatedly do. Excellence, then, is not an act, but a habit.”" },
  { author: "Socrates", text: "“The only true wisdom is in knowing you know nothing.”" },
  { author: "Confucius", text: "“It does not matter how slowly you go as long as you do not stop.”" },
  { author: "Marcus Aurelius", text: "“The impediment to action advances action. What stands in the way becomes the way.”" }
];

export default function QuotesCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 7000); // cycle every 7 seconds
    return () => clearInterval(interval);
  }, []);

  const activeQuote = quotes[index];

  return (
    <div className="w-full max-w-lg min-h-[95px] flex flex-col items-center justify-center relative overflow-hidden px-4 select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(2px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center"
        >
          <blockquote className="text-[14px] sm:text-[15px] italic text-[var(--text-muted)] font-serif leading-relaxed">
            {activeQuote.text}
          </blockquote>
          <cite className="text-[9px] tracking-[0.25em] font-mono uppercase text-[var(--text-muted)] mt-2.5 block not-italic">
            — {activeQuote.author}
          </cite>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
