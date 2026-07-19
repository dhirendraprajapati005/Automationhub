import { Cpu, Gauge, Network, Zap, RotateCw, Radar, Wind, Bot, Cable, type LucideIcon } from "lucide-react";

export const trackIcons: Record<string, LucideIcon> = {
  Cpu,
  Gauge,
  Network,
  Zap,
  RotateCw,
  Radar,
  Wind,
  Bot,
  Cable,
};

export const difficultyColor: Record<string, string> = {
  beginner: "text-circuit-400",
  intermediate: "text-signal-500",
  advanced: "text-red-400",
};
