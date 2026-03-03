type AccentColor = "blue" | "green" | "red" | "amber";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  accentColor?: AccentColor;
  icon?: React.ReactNode;
}

const accentMap: Record<AccentColor, string> = {
  blue:  "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  red:   "text-red-600 bg-red-50",
  amber: "text-amber-600 bg-amber-50",
};

export default function StatCard({
  title, value, subtitle, trend, trendValue, accentColor = "blue", icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && (
          <div className={`p-2 rounded-lg ${accentMap[accentColor]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-900">{value}</span>
        {trendValue && (
          <span className={`mb-1 text-xs font-medium ${
            trend === "up"   ? "text-green-600" :
            trend === "down" ? "text-red-600"   : "text-slate-400"
          }`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "—"} {trendValue}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
}
