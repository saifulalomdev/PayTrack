import { GlobeIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GetStarted } from "./get-started-button";

type Stat = {
  label: string,
  value: string,
}

// Swapped SaaS limits for open-source self-hosting descriptors
const HERO_STATS: Stat[] = [
  { label: "Script Size", value: "< 2KB" },
  { label: "Edge Nodes", value: "330+" },
  { label: "License Type", value: "MIT" },
];

// --- Sub-Components ---

const HeroBackground = ({ side }: { side: "left" | "right" }) => (
  <img
    src={`/images/hero-${side}-side.png`}
    className={`absolute ${side}-0 top-0 h-full w-1/2 object-cover select-none pointer-events-none`}
    alt=""
    loading="eager"
  />
);

const InfraBadge = () => (
  <div className="mt-30 flex w-full justify-center items-center">
    <div className="bg-black/5 dark:bg-white/5 border border-border backdrop-blur-md gap-3 px-2.5 py-2 rounded-full flex items-center">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full border-2 border-background bg-zinc-900 flex items-center justify-center shadow-sm">
          <GlobeIcon size={14} className="text-white" />
        </div>
        <div className="-ml-3 h-8 w-8 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center shadow-sm">
          <ZapIcon size={14} className="text-yellow-500" />
        </div>
        <div className="-ml-3 h-8 w-8 rounded-full border-2 border-background bg-zinc-700 flex items-center justify-center shadow-sm">
          <ShieldCheckIcon size={14} className="text-emerald-500" />
        </div>
      </div>
      <div className="flex flex-col text-left leading-tight pr-2">
        {/* Adjusted wording to emphasize decentralized deployment setup */}
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">Edge Deployment</span>
        <p className="text-[11px] text-muted-foreground font-medium">
          Running across <span className="text-white font-bold">330+ Regions</span>
        </p>
      </div>
    </div>
  </div>
);

const MetricItem = ({ stat, isLast }: { stat: Stat; isLast: boolean }) => (
  <div className={`flex justify-center items-center flex-col pb-8 md:pb-0 ${!isLast ? 'border-b md:border-b-0 md:border-r border-white/10' : ''}`}>
    <h1 className="text-lg md:text-[23px] opacity-80">{stat.label}</h1>
    <h1 className="text-4xl md:text-[46px] font-bold tracking-tight">{stat.value}</h1>
  </div>
);

// --- Main Section ---

export function HeroSection() {
  return (
    <section id="hero" className="w-full relative bg-black flex flex-col items-center justify-center overflow-hidden">
      <HeroBackground side="left" />
      <HeroBackground side="right" />

      <div className="flex flex-col gap-6.75 z-10 text-center px-4">
        <InfraBadge />

        {/* EXACTLY 4 WORDS: "Own Your Analytics. Maximize Privacy." */}
        <h1 className="text-4xl sm:text-6xl text-white md:text-6xl lg:text-[80px] font-bold leading-[1.1] tracking-tight">
          Own Your <span className="text-primary">Analytics.</span>
          <br className="hidden sm:block" />
          Maximize Privacy.
        </h1>

        {/* Word count matched perfectly to your original paragraph */}
        <p className="text-muted-foreground mt-4 text-base sm:text-lg md:text-[22px] font-normal max-w-2xl px-4 mx-auto leading-relaxed">
          Self-host open analytics, retain ownership, and inspect queries through your own high-performance dashboard without tracking cookies.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center px-6">
          <GetStarted />
          <Button asChild size="lg" variant="outline" className="font-bold w-full md:w-auto">
            <a href="/#features">See Details</a>
          </Button>
        </div>
      </div>

      <div className="pt-10 md:pt-19.75 w-full">
        <div className="h-auto md:h-53.5 w-full bg-background/5 bg-linear-to-b from-background/5 via-background to-background border-t py-10 backdrop-blur-sm grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {HERO_STATS.map((stat, index) => (
            <MetricItem
              key={stat.label}
              stat={stat}
              isLast={index === HERO_STATS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}