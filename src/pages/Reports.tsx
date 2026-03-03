import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import { getReportSummary } from "../services/api";
import type { ReportSummary } from "../types";

const ppeColors: Record<string, string> = {
  helmet:  "bg-red-500",
  vest:    "bg-orange-500",
  gloves:  "bg-amber-500",
  boots:   "bg-blue-500",
  mask:    "bg-slate-400",
  goggles: "bg-purple-500",
};

type Period = "7d" | "14d" | "30d";

export default function Reports() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("7d");

  useEffect(() => {
    setLoading(true);
    getReportSummary(period)
      .then(setReport)
      .finally(() => setLoading(false));
  }, [period]);

  if (loading || !report) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading report…</div>;
  }

  const maxViolations = Math.max(...report.byDay.map((d) => d.violations), 1);
  const chartHeight = 100;

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="PPE Compliance Analytics"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-0.5">
              {(["7d", "14d", "30d"] as Period[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    period === p ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {p === "7d" ? "7 Days" : p === "14d" ? "14 Days" : "30 Days"}
                </button>
              ))}
            </div>
            <button
              onClick={() => alert("Export feature will be available when connected to the backend.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Inspections"
          value={report.totalInspections.toLocaleString()}
          subtitle={report.period}
          accentColor="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatCard
          title="Violations"
          value={report.violations}
          subtitle="Total PPE violations"
          accentColor="red"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          title="Compliance Rate"
          value={`${report.compliance}%`}
          subtitle="Workers fully compliant"
          accentColor="green"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Top Violation"
          value={report.topViolationType.charAt(0).toUpperCase() + report.topViolationType.slice(1)}
          subtitle="Most common missing PPE"
          accentColor="amber"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily Violations Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Daily Violations — {report.period}</h3>
          <div className="flex items-end gap-2" style={{ height: `${chartHeight + 24}px` }}>
            {report.byDay.map((day) => {
              const barH = Math.round((day.violations / maxViolations) * chartHeight);
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500 font-medium">{day.violations}</span>
                  <div
                    className="w-full rounded-t-md bg-blue-500 hover:bg-blue-600 transition-colors"
                    style={{ height: `${barH}px`, minHeight: "4px" }}
                    title={`${day.date}: ${day.violations} violations`}
                  />
                  <span className="text-xs text-slate-400">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* PPE Item Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">PPE Item Breakdown</h3>
          <div className="space-y-3">
            {report.byPPEItem.map((item) => (
              <div key={item.item}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700 capitalize">{item.item}</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {item.violations} <span className="font-normal text-slate-400">({item.percentage}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ppeColors[item.item] ?? "bg-slate-500"}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zone Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-800">Zone Breakdown</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["Zone", "Inspections", "Violations", "Compliance Rate", "Status"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.byZone.map((z) => (
              <tr key={z.zone} className="hover:bg-slate-50 transition-colors">
                <td className="px-5 py-3 font-medium text-slate-800">{z.zone}</td>
                <td className="px-5 py-3 text-slate-600">{(report.totalInspections / report.byZone.length).toFixed(0)}</td>
                <td className="px-5 py-3 text-slate-600">{z.violations}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full max-w-20">
                      <div
                        className={`h-full rounded-full ${
                          z.compliance >= 90 ? "bg-green-500" :
                          z.compliance >= 70 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${z.compliance}%` }}
                      />
                    </div>
                    <span className={`font-semibold ${
                      z.compliance >= 90 ? "text-green-600" :
                      z.compliance >= 70 ? "text-amber-600" : "text-red-600"
                    }`}>
                      {z.compliance}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                    z.compliance >= 90 ? "bg-green-50 text-green-700 border-green-200" :
                    z.compliance >= 70 ? "bg-amber-50 text-amber-700 border-amber-200" :
                    "bg-red-50 text-red-700 border-red-200"
                  }`}>
                    {z.compliance >= 90 ? "Excellent" : z.compliance >= 70 ? "Acceptable" : "Poor"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
