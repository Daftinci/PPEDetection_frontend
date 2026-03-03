import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import AlertBadge from "../components/AlertBadge";
import { getDetections, getCameras, acknowledgeAlert } from "../services/api";
import type { Detection, Severity } from "../types";

const ITEMS_PER_PAGE = 10;

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-MY", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

const confidenceColor = (v: number) =>
  v >= 0.9 ? "text-green-600" : v >= 0.75 ? "text-amber-600" : "text-red-600";

export default function Detections() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [cameraLocations, setCameraLocations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "unacknowledged" | "acknowledged">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    Promise.all([getDetections(), getCameras()]).then(([d, c]) => {
      setDetections(d);
      const map: Record<string, string> = {};
      c.forEach((cam) => { map[cam.id] = cam.location; });
      setCameraLocations(map);
    }).finally(() => setLoading(false));
  }, []);

  async function handleAcknowledge(id: string) {
    await acknowledgeAlert(id);
    setDetections((prev) => prev.map((d) => d.id === id ? { ...d, acknowledged: true } : d));
  }

  const filtered = detections.filter((d) => {
    if (severityFilter !== "all" && d.severity !== severityFilter) return false;
    if (statusFilter === "acknowledged" && !d.acknowledged) return false;
    if (statusFilter === "unacknowledged" && d.acknowledged) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!d.cameraId.toLowerCase().includes(q) &&
          !d.cameraLocation.toLowerCase().includes(q) &&
          !d.missingItems.join(" ").includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const counts = {
    critical:      detections.filter((d) => d.severity === "critical").length,
    high:          detections.filter((d) => d.severity === "high").length,
    medium:        detections.filter((d) => d.severity === "medium").length,
    low:           detections.filter((d) => d.severity === "low").length,
    acknowledged:  detections.filter((d) => d.acknowledged).length,
  };

  return (
    <div>
      <PageHeader
        title="Detections & Alerts"
        subtitle="Real-time PPE violation monitoring"
        actions={
          <button
            onClick={() => setDetections((prev) => prev.map((d) => ({ ...d, acknowledged: true })))}
            className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 transition"
          >
            Mark All Acknowledged
          </button>
        }
      />

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-5">
        {[
          { label: "Critical", count: counts.critical, color: "bg-red-50 text-red-700 border-red-200" },
          { label: "High", count: counts.high, color: "bg-orange-50 text-orange-700 border-orange-200" },
          { label: "Medium", count: counts.medium, color: "bg-amber-50 text-amber-700 border-amber-200" },
          { label: "Low", count: counts.low, color: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Acknowledged", count: counts.acknowledged, color: "bg-green-50 text-green-700 border-green-200" },
        ].map((item) => (
          <div key={item.label} className={`rounded-lg border px-4 py-3 text-center ${item.color}`}>
            <p className="text-2xl font-bold">{item.count}</p>
            <p className="text-xs mt-0.5 font-medium">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search camera, location, PPE type…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 min-w-48 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <select
          value={severityFilter}
          onChange={(e) => { setSeverityFilter(e.target.value as Severity | "all"); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="unacknowledged">Unacknowledged</option>
          <option value="acknowledged">Acknowledged</option>
        </select>
        <button
          onClick={() => { setSearch(""); setSeverityFilter("all"); setStatusFilter("all"); setPage(1); }}
          className="px-3 py-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading detections…</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {["Time", "Camera", "Severity", "Missing PPE", "Confidence", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginated.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        <div>{formatDateTime(d.timestamp)}</div>
                        {d.personId && <div className="text-xs text-slate-400">{d.personId}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{d.cameraId}</div>
                        <div className="text-xs text-slate-400 truncate max-w-36">
                          {cameraLocations[d.cameraId] ?? d.cameraLocation}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AlertBadge severity={d.severity} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {d.missingItems.map((item) => (
                            <span key={item} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full capitalize">
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className={`px-4 py-3 font-semibold ${confidenceColor(d.confidence)}`}>
                        {(d.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3">
                        {d.acknowledged ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full font-medium">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-flex text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {!d.acknowledged && (
                          <button
                            onClick={() => handleAcknowledge(d.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            Acknowledge
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No detections match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-sm">
                <span className="text-slate-500">
                  Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-1 rounded-lg border transition ${
                        page === i + 1
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-slate-300 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
