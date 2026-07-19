import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-32 text-center">
    <p className="font-mono text-signal-500">FAULT CODE 404</p>
    <h1 className="mt-3 font-display text-3xl font-bold">Page not found</h1>
    <p className="mt-2 text-ink-400">This circuit doesn't connect to anything. Let's get you back on the rail.</p>
    <Link to="/" className="btn-primary mt-6">
      Back to home
    </Link>
  </div>
);
