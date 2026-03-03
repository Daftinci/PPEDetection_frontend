export type Severity = "critical" | "high" | "medium" | "low";
export type CameraStatus = "online" | "offline" | "alert";
export type PPEStatus = "compliant" | "violation" | "partial";
export type PPEItem = "helmet" | "vest" | "gloves" | "boots" | "mask" | "goggles";

export interface Camera {
  id: string;
  location: string;
  zone: string;
  status: CameraStatus;
  fps: number;
  resolution: string;
  lastSeen: string;
  detectionCount: number;
  thumbnailColor: string;
}

export interface Detection {
  id: string;
  cameraId: string;
  cameraLocation: string;
  timestamp: string;
  severity: Severity;
  ppeStatus: PPEStatus;
  missingItems: PPEItem[];
  confidence: number;
  personId?: string;
  acknowledged: boolean;
}

export interface Alert {
  id: string;
  detectionId: string;
  cameraId: string;
  location: string;
  timestamp: string;
  severity: Severity;
  message: string;
  acknowledged: boolean;
}

export interface DashboardStats {
  totalCameras: number;
  activeCameras: number;
  offlineCameras: number;
  alertCameras: number;
  todayDetections: number;
  todayViolations: number;
  complianceRate: number;
  avgResponseTime: number;
  activeAlerts: number;
}

export interface Zone {
  id: string;
  name: string;
  cameraCount: number;
  complianceRate: number;
}

export interface DailyReport {
  date: string;
  violations: number;
  compliant: number;
}

export interface ZoneReport {
  zone: string;
  violations: number;
  compliance: number;
}

export interface PPEItemReport {
  item: PPEItem;
  violations: number;
  percentage: number;
}

export interface ReportSummary {
  period: string;
  totalInspections: number;
  violations: number;
  compliance: number;
  topViolationType: PPEItem;
  byDay: DailyReport[];
  byZone: ZoneReport[];
  byPPEItem: PPEItemReport[];
}
