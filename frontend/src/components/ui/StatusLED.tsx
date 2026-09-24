interface Props {
  status: "on" | "off" | "warn";
  label: string;
  className?: string;
}

export const StatusLED = ({ status, label, className = "" }: Props) => (
  <span className={`inline-flex items-center gap-1.5 text-xs ${className}`}>
    <span className={`status-led ${status}`} />
    {label}
  </span>
);
