import type { Terminal, Connection } from "@/types/wiringDiagram";

interface Props {
  deviceLabel: string;
  deviceTerminals: Terminal[];
  controllerLabel: string;
  controllerTerminals: Terminal[];
  connections: Connection[];
}

const ROW_HEIGHT = 56;
const TOP_MARGIN = 50;
const BOX_WIDTH = 200;
const SVG_WIDTH = 620;

export const TerminalWiringDiagram = ({
  deviceLabel,
  deviceTerminals,
  controllerLabel,
  controllerTerminals,
  connections,
}: Props) => {
  const rowCount = Math.max(deviceTerminals.length, controllerTerminals.length);
  const height = TOP_MARGIN + rowCount * ROW_HEIGHT + 20;

  const leftX = 10;
  const rightX = SVG_WIDTH - BOX_WIDTH - 10;
  const portX = 14; // connection point inset from each box edge

  const yFor = (index: number) => TOP_MARGIN + index * ROW_HEIGHT + ROW_HEIGHT / 2;

  const deviceIndex = Object.fromEntries(deviceTerminals.map((t, i) => [t.id, i]));
  const controllerIndex = Object.fromEntries(controllerTerminals.map((t, i) => [t.id, i]));

  return (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${height}`} className="w-full" role="img" aria-label={`Wiring diagram: ${deviceLabel} to ${controllerLabel}`}>
      {/* Column headers */}
      <text x={leftX} y={24} className="fill-ink-50 font-display text-[13px] font-semibold">{deviceLabel}</text>
      <text x={rightX} y={24} className="fill-ink-50 font-display text-[13px] font-semibold">{controllerLabel}</text>

      {/* Connection lines, drawn first so terminal boxes sit on top */}
      {connections.map((c, i) => {
        const dIdx = deviceIndex[c.deviceTerminalId];
        const cIdx = controllerIndex[c.controllerTerminalId];
        if (dIdx === undefined || cIdx === undefined) return null;
        const y1 = yFor(dIdx);
        const y2 = yFor(cIdx);
        const x1 = leftX + BOX_WIDTH - portX;
        const x2 = rightX + portX;
        const midX = (x1 + x2) / 2;
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke="var(--color-signal-500)"
            strokeWidth="2"
          />
        );
      })}

      {/* Device terminal boxes */}
      {deviceTerminals.map((t, i) => (
        <g key={t.id}>
          <rect x={leftX} y={yFor(i) - 16} width={BOX_WIDTH} height={32} rx="3" className="fill-panel-900 stroke-panel-600" strokeWidth="1.5" />
          <text x={leftX + 12} y={yFor(i) + 4} className="fill-ink-200 font-mono text-[11px]">{t.label}</text>
          <circle cx={leftX + BOX_WIDTH - portX} cy={yFor(i)} r="3" className="fill-signal-500" />
        </g>
      ))}

      {/* Controller terminal boxes */}
      {controllerTerminals.map((t, i) => (
        <g key={t.id}>
          <rect x={rightX} y={yFor(i) - 16} width={BOX_WIDTH} height={32} rx="3" className="fill-panel-900 stroke-panel-600" strokeWidth="1.5" />
          <text x={rightX + 12} y={yFor(i) + 4} className="fill-ink-200 font-mono text-[11px]">{t.label}</text>
          <circle cx={rightX + portX} cy={yFor(i)} r="3" className="fill-circuit-500" />
        </g>
      ))}
    </svg>
  );
};
