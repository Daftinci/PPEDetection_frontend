import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import AlertBadge from "../components/AlertBadge";
import { getDashboardStats, getZones, getAlerts, acknowledgeAlert } from "../services/api";
import type { DashboardStats, Zone, Alert } from "../types";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-MY", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getZones(), getAlerts()])
      .then(([s, z, a]) => { setStats(s); setZones(z); setAlerts(a); })
      .finally(() => setLoading(false));
  }, []);

  async function handleAcknowledge(id: string) {
    await acknowledgeAlert(id);
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Loading dashboard…</div>;
  }

  const recentAlerts = alerts.slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`System Overview — ${formatDate()}`}
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Active Cameras"
          value={`${stats?.activeCameras ?? 0}/${stats?.totalCameras ?? 0}`}
          subtitle={`${stats?.offlineCameras ?? 0} offline · ${stats?.alertCameras ?? 0} in alert`}
          accentColor="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Detections Today"
          value={stats?.todayDetections ?? 0}
          subtitle="Total PPE inspections"
          accentColor="blue"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Violations"
          value={stats?.todayViolations ?? 0}
          subtitle="PPE violations detected today"
          accentColor="red"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatCard
          title="Compliance Rate"
          value={`${stats?.complianceRate ?? 0}%`}
          subtitle="Based on today's inspections"
          accentColor={
            (stats?.complianceRate ?? 0) >= 90 ? "green" :
            (stats?.complianceRate ?? 0) >= 70 ? "amber" : "red"
          }
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Recent Alerts */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Recent Alerts</h2>
            <span className="text-xs text-slate-400">{alerts.filter(a => !a.acknowledged).length} unacknowledged</span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentAlerts.length === 0 && (
              <div className="px-5 py-8 text-center text-slate-400 text-sm">No alerts</div>
            )}
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="px-5 py-3 flex items-start gap-3">
                <AlertBadge severity={alert.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-snug">{alert.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {alert.location} · {formatTime(alert.timestamp)}
                  </p>
                </div>
                {!alert.acknowledged && (
                  <button
                    onClick={() => handleAcknowledge(alert.id)}
                    className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ack
                  </button>
                )}
                {alert.acknowledged && (
                  <span className="flex-shrink-0 text-xs text-green-600 font-medium">Resolved</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Zone Compliance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="text-sm font-semibold text-slate-800">Zone Compliance</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            {zones.map((zone) => (
              <div key={zone.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-slate-700">{zone.name}</span>
                  <span className={`text-sm font-bold ${
                    zone.complianceRate >= 90 ? "text-green-600" :
                    zone.complianceRate >= 70 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {zone.complianceRate}%
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      zone.complianceRate >= 90 ? "bg-green-500" :
                      zone.complianceRate >= 70 ? "bg-amber-500" : "bg-red-500"
                    }`}
                    style={{ width: `${zone.complianceRate}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{zone.cameraCount} camera{zone.cameraCount > 1 ? "s" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Status Strip */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4">
        <h2 className="text-sm font-semibold text-slate-800 mb-3">System Status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[
            { label: "Cameras Online", value: stats?.activeCameras ?? 0, color: "text-green-600" },
            { label: "Cameras Offline", value: stats?.offlineCameras ?? 0, color: "text-slate-400" },
            { label: "Cameras in Alert", value: stats?.alertCameras ?? 0, color: "text-red-600" },
            { label: "Active Alerts", value: stats?.activeAlerts ?? 0, color: "text-amber-600" },
            { label: "Avg Response", value: `${stats?.avgResponseTime ?? 0}s`, color: "text-blue-600" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
