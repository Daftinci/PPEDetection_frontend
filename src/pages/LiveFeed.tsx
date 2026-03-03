import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import CameraFeedCard from "../components/CameraFeedCard";
import { getCameras } from "../services/api";
import type { Camera, CameraStatus } from "../types";

type ZoneFilter = "All" | string;
type StatusFilter = "all" | CameraStatus;

export default function LiveFeed() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>("All");
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  useEffect(() => {
    getCameras()
      .then(setCameras)
      .finally(() => setLoading(false));
  }, []);

  const zones = ["All", ...Array.from(new Set(cameras.map((c) => c.zone)))];

  const statusCounts = {
    all:     cameras.length,
    online:  cameras.filter((c) => c.status === "online").length,
    alert:   cameras.filter((c) => c.status === "alert").length,
    offline: cameras.filter((c) => c.status === "offline").length,
  };

  const filtered = cameras.filter((c) => {
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesZone   = zoneFilter === "All" || c.zone === zoneFilter;
    return matchesStatus && matchesZone;
  });

  return (
    <div>
      <PageHeader
        title="Live Feed"
        subtitle={`${statusCounts.online} of ${statusCounts.all} cameras online`}
        actions={
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {zones.map((z) => <option key={z}>{z}</option>)}
          </select>
        }
      />

      {/* Status Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
        {(["all", "online", "alert", "offline"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              statusFilter === s
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
              statusFilter === s ? "bg-slate-100 text-slate-600" : "bg-slate-200 text-slate-500"
            }`}>
              {statusCounts[s]}
            </span>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center h-64 text-slate-400">Loading cameras…</div>
      )}

      {/* Camera Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((camera) => (
            <CameraFeedCard
              key={camera.id}
              camera={camera}
              onClick={setSelectedCamera}
            />
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-slate-400">
              No cameras match the selected filters.
            </div>
          )}
        </div>
      )}

      {/* Detail Panel */}
      {selectedCamera && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCamera(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{selectedCamera.id}</h3>
              <button
                onClick={() => setSelectedCamera(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="h-36 rounded-xl mb-4" style={{ backgroundColor: selectedCamera.thumbnailColor }} />
            <dl className="space-y-2 text-sm">
              {[
                ["Location", selectedCamera.location],
                ["Zone", selectedCamera.zone],
                ["Status", selectedCamera.status],
                ["Resolution", selectedCamera.resolution],
                ["Frame Rate", selectedCamera.fps > 0 ? `${selectedCamera.fps} fps` : "N/A"],
                ["Detections Today", selectedCamera.detectionCount],
                ["Last Seen", new Date(selectedCamera.lastSeen).toLocaleString("en-MY")],
              ].map(([label, value]) => (
                <div key={String(label)} className="flex justify-between">
                  <dt className="text-slate-500">{label}</dt>
                  <dd className="font-medium text-slate-800 capitalize">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
