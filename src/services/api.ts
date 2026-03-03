import type { Camera, Detection, Alert, DashboardStats, Zone, ReportSummary } from "../types";
import {
  mockCameras,
  mockDetections,
  mockAlerts,
  mockDashboardStats,
  mockZones,
  mockReportSummary,
} from "../data/mockData";

// Set USE_MOCK=false and populate BASE_URL when the FastAPI backend is ready
const USE_MOCK = true;
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

// --- Auth ---
// POST /api/v1/auth/login  { username, password } → { token }
export async function login(username: string, password: string): Promise<{ token: string }> {
  if (USE_MOCK) {
    if (username === "admin" && password === "admin123") {
      return Promise.resolve({ token: "mock-jwt-token-xyz" });
    }
    return Promise.reject(new Error("Invalid username or password"));
  }
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

// --- Dashboard ---
// GET /api/v1/dashboard/stats → DashboardStats
export async function getDashboardStats(): Promise<DashboardStats> {
  if (USE_MOCK) return Promise.resolve(mockDashboardStats);
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: authHeader(),
  });
  return res.json();
}

// GET /api/v1/zones → Zone[]
export async function getZones(): Promise<Zone[]> {
  if (USE_MOCK) return Promise.resolve(mockZones);
  const res = await fetch(`${BASE_URL}/zones`, { headers: authHeader() });
  return res.json();
}

// --- Cameras ---
// GET /api/v1/cameras → Camera[]
export async function getCameras(): Promise<Camera[]> {
  if (USE_MOCK) return Promise.resolve(mockCameras);
  const res = await fetch(`${BASE_URL}/cameras`, { headers: authHeader() });
  return res.json();
}

// GET /api/v1/cameras/:id → Camera
export async function getCameraById(id: string): Promise<Camera | undefined> {
  if (USE_MOCK) return Promise.resolve(mockCameras.find((c) => c.id === id));
  const res = await fetch(`${BASE_URL}/cameras/${id}`, { headers: authHeader() });
  return res.json();
}

// --- Detections ---
// GET /api/v1/detections?limit= → Detection[]
export async function getDetections(limit?: number): Promise<Detection[]> {
  if (USE_MOCK) {
    const data = limit ? mockDetections.slice(0, limit) : mockDetections;
    return Promise.resolve(data);
  }
  const params = limit ? `?limit=${limit}` : "";
  const res = await fetch(`${BASE_URL}/detections${params}`, { headers: authHeader() });
  return res.json();
}

// --- Alerts ---
// GET /api/v1/alerts → Alert[]
export async function getAlerts(): Promise<Alert[]> {
  if (USE_MOCK) return Promise.resolve(mockAlerts);
  const res = await fetch(`${BASE_URL}/alerts`, { headers: authHeader() });
  return res.json();
}

// POST /api/v1/alerts/:id/acknowledge
export async function acknowledgeAlert(id: string): Promise<void> {
  if (USE_MOCK) {
    console.log(`[MOCK] Alert ${id} acknowledged`);
    return Promise.resolve();
  }
  await fetch(`${BASE_URL}/alerts/${id}/acknowledge`, {
    method: "POST",
    headers: authHeader(),
  });
}

// --- Reports ---
// GET /api/v1/reports/summary?period= → ReportSummary
export async function getReportSummary(_period?: string): Promise<ReportSummary> {
  if (USE_MOCK) return Promise.resolve(mockReportSummary);
  const params = _period ? `?period=${_period}` : "";
  const res = await fetch(`${BASE_URL}/reports/summary${params}`, { headers: authHeader() });
  return res.json();
}

// --- Helpers ---
function authHeader(): HeadersInit {
  const token = sessionStorage.getItem("ppeauth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
