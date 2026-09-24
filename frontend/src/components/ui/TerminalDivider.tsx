interface Props {
  label?: string;
  className?: string;
}

export const TerminalDivider = ({ label, className = "" }: Props) => (
  <div className={`terminal-divider ${className}`}>
    {label && <span className="font-mono text-xs uppercase tracking-widest text-ink-400">{label}</span>}
  </div>
);
