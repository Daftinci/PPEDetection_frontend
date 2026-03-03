import type { Severity } from "../types";

interface AlertBadgeProps {
  severity: Severity;
  label?: string;
}

const styles: Record<Severity, string> = {
  critical: "bg-red-100 text-red-700 border border-red-200",
  high:     "bg-orange-100 text-orange-700 border border-orange-200",
  medium:   "bg-amber-100 text-amber-700 border border-amber-200",
  low:      "bg-blue-100 text-blue-700 border border-blue-200",
};

export default function AlertBadge({ severity, label }: AlertBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${styles[severity]}`}>
      {label ?? severity}
    </span>
  );
}
