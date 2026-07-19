import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Zap } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";

const content = `## What AutomationHub is

AutomationHub is a free learning platform for industrial automation — PLC programming, HMI design, SCADA, VFDs, servo systems, sensors, pneumatics, robotics, and industrial networking. Everything on it — lessons, calculators, the machine library, downloads — is free to use, with no paywall on the learning content.

## Why it exists

Most industrial automation knowledge lives in three places: expensive vendor training courses, scattered forum threads with no structure, or in an experienced engineer's head, passed down informally to whoever happens to work alongside them. There's very little that's free, structured, and written from real hands-on machine experience rather than abstract textbook theory.

AutomationHub exists to close that gap — one place with PLC ladder logic, HMI design principles, and machine-level detail (working principle through troubleshooting and maintenance) written the way an experienced engineer would actually explain it to someone learning the trade.

## Where the content comes from

The Machine Library's Filling Machine, Leak Testing Machine, and Rotary Capping Machine pages are built directly from real Delta PLC ladder logic patterns — high-speed counter scaling, pressure-drop leak detection, line-speed synchronization — not generic descriptions. The platform is built and maintained under **Dhirendra Infotech**, a MERN-stack development studio with hands-on industrial automation experience across Delta DVP-series PLCs, HMI development, and machine-level controls work.

## What's next

AutomationHub is under active development. New lessons, machine library entries, and calculators are added regularly, and the Community Forum and AI Assistant are there to fill the gaps between structured lessons and the specific, messy questions that come up on a real production floor.`;

export const About = () => {
  useSEO({
    title: "About AutomationHub",
    description:
      "AutomationHub is a free learning platform for PLC programming, industrial automation, HMI, SCADA, and more — built from real hands-on machine experience.",
    path: "/about",
  });

  return (
  <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
    <Zap className="h-8 w-8 text-signal-500" strokeWidth={2.5} />
    <p className="mt-4 font-mono text-xs uppercase tracking-widest text-signal-500">About</p>
    <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
      The free learning platform for industrial automation
    </h1>
    <div className="lesson-content mt-8">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  </div>
  );
};
