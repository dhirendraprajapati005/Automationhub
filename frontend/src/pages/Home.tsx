import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Cpu, Gauge, Wrench, Network } from "lucide-react";
import { LadderRung } from "@/components/ui/LadderRung";
import { NewsletterForm } from "@/components/NewsletterForm";
import { HomeDynamicSections } from "@/components/HomeDynamicSections";
import { useSEO } from "@/hooks/useSEO";
import { buildOrganizationSchema } from "@/lib/structured-data";

const categories = [
  { to: "/learn/plc", icon: Cpu, label: "PLC Programming", count: "120+ lessons" },
  { to: "/learn/hmi", icon: Gauge, label: "HMI & SCADA", count: "45+ lessons" },
  { to: "/machine-library", icon: Wrench, label: "Machine Library", count: "10 machines" },
  { to: "/learn/networking", icon: Network, label: "Industrial Networking", count: "30+ lessons" },
];

export const Home = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
  };

  useSEO({
    title: "Learn Industrial Automation Free — PLC, HMI, SCADA, VFD",
    description:
      "Free, practical PLC, HMI, SCADA, VFD, and robotics training built from real machine logic — ladder logic, wiring diagrams, calculators, and troubleshooting you can use on Monday morning.",
    path: "/",
    structuredData: buildOrganizationSchema(),
  });

  return (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden border-b border-panel-700 bg-panel-900">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-28">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-signal-500">Rung 001 — Power On</p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Learn industrial automation the way it actually runs on the floor.
          </h1>
          <p className="mt-5 max-w-lg text-ink-200">
            Free, practical PLC, HMI, SCADA, VFD, and robotics training — built from real machine logic,
            not just theory. Ladder logic, wiring diagrams, and troubleshooting you can use on Monday morning.
          </p>

          <form className="mt-8 flex max-w-md items-center gap-2" onSubmit={onSearchSubmit}>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search PLC, HMI, VFD topics..."
                className="w-full rounded-[var(--radius-panel)] border border-panel-600 bg-panel-950 py-2.5 pl-9 pr-3 text-sm text-ink-50 placeholder:text-ink-400 focus:border-signal-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>

          <div className="mt-8 flex gap-4">
            <Link to="/register" className="btn-primary">
              Start learning free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/machine-library" className="btn-secondary">
              Explore machines
            </Link>
          </div>
        </div>

        <div className="flex justify-center rounded-[var(--radius-panel)] border border-panel-700 bg-panel-950 p-8">
          <LadderRung />
        </div>
      </div>
    </section>

    {/* Category grid */}
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-display text-2xl font-bold">Start where you are</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map(({ to, icon: Icon, label, count }) => (
          <Link key={to} to={to} className="panel-card group hover:border-signal-500/50 transition-colors">
            <Icon className="h-6 w-6 text-signal-500" />
            <h3 className="mt-4 font-display font-semibold">{label}</h3>
            <p className="mt-1 text-sm text-ink-400">{count}</p>
          </Link>
        ))}
      </div>
    </section>

    {/* Engineering calculators */}
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Engineering calculators</h2>
          <p className="mt-1 text-sm text-ink-400">Instant answers for the numbers you need on the floor.</p>
        </div>
        <Link to="/calculators" className="text-sm text-signal-500 hover:text-signal-400">
          View all 12 &rarr;
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { slug: "pulse-to-gram", label: "Pulse to Gram" },
          { slug: "motor-current", label: "Motor Current" },
          { slug: "cable-size", label: "Cable Size" },
          { slug: "production-calculator", label: "Production Calculator" },
        ].map((calc) => (
          <Link key={calc.slug} to={`/calculators/${calc.slug}`} className="panel-card hover:border-signal-500/50 transition-colors">
            <h3 className="font-display text-sm font-semibold">{calc.label}</h3>
          </Link>
        ))}
      </div>
    </section>

    {/* Popular downloads / featured tutorials placeholder sections */}
    <HomeDynamicSections />
    <section className="border-t border-panel-700 bg-panel-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Latest tutorials</h2>
          <Link to="/learn" className="text-sm text-signal-500 hover:text-signal-400">
            View all &rarr;
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Delta DVP-14SS2: Wiring your first HSC counter", tag: "PLC" },
            { title: "Single-head filling machine: volume-based fill logic", tag: "Machine Library" },
            { title: "Reading a VFD parameter sheet without panic", tag: "VFD" },
          ].map((item) => (
            <div key={item.title} className="panel-card">
              <span className="font-mono text-xs text-circuit-400">{item.tag}</span>
              <h3 className="mt-2 font-display font-semibold leading-snug">{item.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Newsletter */}
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="panel-card flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-bold">Get new tutorials in your inbox</h2>
          <p className="mt-1 text-sm text-ink-400">One email a week. No spam, just working automation knowledge.</p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  </div>
  );
};
