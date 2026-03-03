import type { Camera } from "../types";

interface CameraFeedCardProps {
  camera: Camera;
  onClick?: (camera: Camera) => void;
}

const statusDot: Record<string, string> = {
  online:  "bg-green-500",
  offline: "bg-slate-400",
  alert:   "bg-red-500",
};

const statusLabel: Record<string, string> = {
  online:  "Online",
  offline: "Offline",
  alert:   "Alert",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" });
}

export default function CameraFeedCard({ camera, onClick }: CameraFeedCardProps) {
  const isAlert = camera.status === "alert";

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isAlert ? "border-red-400 ring-2 ring-red-300" : "border-slate-200"
      }`}
      onClick={() => onClick?.(camera)}
    >
      {/* Feed area */}
      <div className="relative h-40" style={{ backgroundColor: camera.thumbnailColor }}>
        {/* Top overlay */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
          <span className="bg-black/60 text-white text-xs font-mono px-2 py-0.5 rounded">
            {camera.id}
          </span>
          <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
            <span className={`inline-block w-2 h-2 rounded-full ${statusDot[camera.status]} ${isAlert ? "animate-pulse" : ""}`} />
            <span className="text-white text-xs">{statusLabel[camera.status]}</span>
          </div>
        </div>

        {/* Offline overlay */}
        {camera.status === "offline" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-slate-300 text-sm font-medium">No Signal</span>
          </div>
        )}

        {/* Alert badge */}
        {isAlert && camera.detectionCount > 0 && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              {camera.detectionCount} Violation{camera.detectionCount > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
          <p className="text-white text-xs font-medium truncate">{camera.location}</p>
          <p className="text-white/70 text-xs">Last seen {formatTime(camera.lastSeen)}</p>
        </div>
      </div>

      {/* Card footer */}
      <div className="px-3 py-2 flex items-center justify-between text-xs text-slate-500">
        <span>{camera.resolution} · {camera.fps > 0 ? `${camera.fps}fps` : "—"}</span>
        {camera.detectionCount > 0 ? (
          <span className="text-red-600 font-medium">{camera.detectionCount} alert{camera.detectionCount > 1 ? "s" : ""}</span>
        ) : (
          <span className="text-green-600">No violations</span>
        )}
      </div>
    </div>
  );
}
