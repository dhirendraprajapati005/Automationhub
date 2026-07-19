import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const columns = [
  {
    heading: "Learn",
    links: [
      { to: "/learn/plc", label: "PLC Tutorials" },
      { to: "/learn/hmi", label: "HMI Tutorials" },
      { to: "/learn/scada", label: "SCADA Tutorials" },
      { to: "/learn/vfd", label: "VFD Tutorials" },
      { to: "/learn/servo", label: "Servo Tutorials" },
      { to: "/learn/sensors", label: "Sensors" },
    ],
  },
  {
    heading: "Tools",
    links: [
      { to: "/calculators", label: "Calculators" },
      { to: "/wiring-diagrams", label: "Wiring Diagrams" },
      { to: "/machine-library", label: "Machine Library" },
      { to: "/fault-finder", label: "Fault Finder" },
      { to: "/downloads", label: "Downloads" },
    ],
  },
  {
    heading: "Community",
    links: [
      { to: "/community", label: "Forum" },
      { to: "/blog", label: "Blog" },
      { to: "/news", label: "Automation News" },
    ],
  },
  {
    heading: "Company",
    links: [
      { to: "/about", label: "About" },
      { to: "/contact", label: "Contact" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

export const Footer = () => (
  <footer className="border-t border-panel-700 bg-panel-900">
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
            <Zap className="h-5 w-5 text-signal-500" strokeWidth={2.5} />
            AutomationHub
          </Link>
          <p className="mt-3 max-w-xs text-sm text-ink-400">
            The free learning hub for PLC programming, industrial automation, and controls engineering.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="font-display text-sm font-semibold text-ink-50">{col.heading}</h3>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-ink-400 hover:text-signal-500">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-panel-700 pt-6 text-sm text-ink-400 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} AutomationHub. All rights reserved.</p>
        <p className="font-mono text-xs">Built for engineers, by engineers.</p>
      </div>
    </div>
  </footer>
);
