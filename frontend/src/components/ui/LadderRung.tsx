import { motion } from "framer-motion";

/**
 * A single ladder-logic rung: two normally-open contacts in series driving
 * a coil, styled like a real PLC ladder diagram. On mount, the power flow
 * "energizes" left to right — the rails light up, then each contact, then
 * the coil, in sequence. Respects prefers-reduced-motion by finishing in
 * its energized end state immediately.
 */
export const LadderRung = () => {
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const duration = prefersReducedMotion ? 0 : 0.5;
  const stagger = prefersReducedMotion ? 0 : 0.35;

  return (
    <svg
      viewBox="0 0 600 140"
      className="w-full max-w-2xl"
      role="img"
      aria-label="Animated ladder logic diagram energizing from left to right"
    >
      {/* Left and right power rails */}
      <motion.line
        x1="20" y1="10" x2="20" y2="130"
        stroke="var(--color-panel-600)" strokeWidth="4"
        initial={{ stroke: "var(--color-panel-600)" }}
        animate={{ stroke: "var(--color-signal-500)" }}
        transition={{ duration, delay: 0 }}
      />
      <motion.line
        x1="580" y1="10" x2="580" y2="130"
        stroke="var(--color-panel-600)" strokeWidth="4"
        initial={{ stroke: "var(--color-panel-600)" }}
        animate={{ stroke: "var(--color-circuit-500)" }}
        transition={{ duration, delay: stagger * 3 }}
      />

      {/* Rung wire */}
      <motion.line
        x1="20" y1="70" x2="580" y2="70"
        stroke="var(--color-panel-600)" strokeWidth="3"
        initial={{ stroke: "var(--color-panel-600)" }}
        animate={{ stroke: "var(--color-signal-500)" }}
        transition={{ duration, delay: stagger }}
      />

      {/* Contact 1 — X0 */}
      <ContactGroup x={130} label="X0" delay={stagger} duration={duration} />
      {/* Contact 2 — X1 */}
      <ContactGroup x={280} label="X1" delay={stagger * 2} duration={duration} />

      {/* Coil — Y0 */}
      <motion.circle
        cx="460" cy="70" r="22"
        fill="none" strokeWidth="3"
        stroke="var(--color-panel-600)"
        initial={{ stroke: "var(--color-panel-600)" }}
        animate={{ stroke: "var(--color-circuit-500)", filter: "drop-shadow(0 0 6px var(--color-circuit-500))" }}
        transition={{ duration, delay: stagger * 3 }}
      />
      <text x="460" y="115" textAnchor="middle" className="fill-ink-400 font-mono text-[11px]">Y0</text>
    </svg>
  );
};

const ContactGroup = ({ x, label, delay, duration }: { x: number; label: string; delay: number; duration: number }) => (
  <g>
    <motion.line
      x1={x - 15} y1="70" x2={x - 5} y2="55"
      strokeWidth="3" stroke="var(--color-panel-600)"
      initial={{ stroke: "var(--color-panel-600)" }}
      animate={{ stroke: "var(--color-signal-500)" }}
      transition={{ duration, delay }}
    />
    <motion.line
      x1={x + 15} y1="70" x2={x + 5} y2="85"
      strokeWidth="3" stroke="var(--color-panel-600)"
      initial={{ stroke: "var(--color-panel-600)" }}
      animate={{ stroke: "var(--color-signal-500)" }}
      transition={{ duration, delay }}
    />
    <text x={x} y="45" textAnchor="middle" className="fill-ink-400 font-mono text-[11px]">{label}</text>
  </g>
);
