import { useRef, useState, type ComponentType, type ReactNode } from "react";

type Props = { platform: string; children: ReactNode };
type Card = ComponentType<Props & { initialOpen?: boolean }>;

let loadCard: Promise<Card> | undefined;

export default function DeferredSocialHoverCard({ platform, children }: Props) {
  const [CardComponent, setCardComponent] = useState<Card>();
  const timer = useRef<number | null>(null);

  const prepare = () => {
    if (timer.current !== null) return;
    loadCard ??= import("./SocialHoverCard").then((module) => module.default);
    timer.current = window.setTimeout(async () => {
      const Card = await loadCard;
      timer.current = null;
      setCardComponent(() => Card);
    }, 250);
  };

  if (CardComponent) {
    return <CardComponent platform={platform} initialOpen>{children}</CardComponent>;
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={prepare}
      onMouseLeave={() => {
        if (timer.current !== null) window.clearTimeout(timer.current);
        timer.current = null;
      }}
      onFocusCapture={prepare}
    >
      {children}
    </div>
  );
}
