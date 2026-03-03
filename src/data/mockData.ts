import type {
  Camera, Detection, Alert, DashboardStats, Zone, ReportSummary,
} from "../types";

export const mockCameras: Camera[] = [
  {
    id: "CAM-001", location: "Zone A - Main Entrance", zone: "Zone A",
    status: "online", fps: 30, resolution: "1080p",
    lastSeen: "2026-03-02T08:45:00Z", detectionCount: 3,
    thumbnailColor: "#1e40af",
  },
  {
    id: "CAM-002", location: "Zone A - Loading Bay", zone: "Zone A",
    status: "alert", fps: 30, resolution: "1080p",
    lastSeen: "2026-03-02T08:44:58Z", detectionCount: 7,
    thumbnailColor: "#7f1d1d",
  },
  {
    id: "CAM-003", location: "Zone B - Assembly Floor", zone: "Zone B",
    status: "online", fps: 25, resolution: "720p",
    lastSeen: "2026-03-02T08:44:55Z", detectionCount: 1,
    thumbnailColor: "#14532d",
  },
  {
    id: "CAM-004", location: "Zone B - Storage Room", zone: "Zone B",
    status: "offline", fps: 0, resolution: "1080p",
    lastSeen: "2026-03-02T07:12:00Z", detectionCount: 0,
    thumbnailColor: "#374151",
  },
  {
    id: "CAM-005", location: "Zone C - Welding Station", zone: "Zone C",
    status: "online", fps: 30, resolution: "1080p",
    lastSeen: "2026-03-02T08:45:01Z", detectionCount: 2,
    thumbnailColor: "#312e81",
  },
  {
    id: "CAM-006", location: "Zone C - Chemical Store", zone: "Zone C",
    status: "online", fps: 30, resolution: "4K",
    lastSeen: "2026-03-02T08:45:00Z", detectionCount: 0,
    thumbnailColor: "#164e63",
  },
  {
    id: "CAM-007", location: "Zone A - Parking", zone: "Zone A",
    status: "online", fps: 15, resolution: "720p",
    lastSeen: "2026-03-02T08:44:50Z", detectionCount: 0,
    thumbnailColor: "#3b0764",
  },
  {
    id: "CAM-008", location: "Zone B - Workshop", zone: "Zone B",
    status: "online", fps: 30, resolution: "1080p",
    lastSeen: "2026-03-02T08:44:59Z", detectionCount: 1,
    thumbnailColor: "#052e16",
  },
];

export const mockDetections: Detection[] = [
  {
    id: "DET-0001", cameraId: "CAM-002", cameraLocation: "Zone A - Loading Bay",
    timestamp: "2026-03-02T08:44:00Z", severity: "critical", ppeStatus: "violation",
    missingItems: ["helmet", "vest"], confidence: 0.97, personId: "P-0021", acknowledged: false,
  },
  {
    id: "DET-0002", cameraId: "CAM-001", cameraLocation: "Zone A - Main Entrance",
    timestamp: "2026-03-02T08:41:00Z", severity: "medium", ppeStatus: "partial",
    missingItems: ["gloves"], confidence: 0.88, personId: "P-0007", acknowledged: false,
  },
  {
    id: "DET-0003", cameraId: "CAM-003", cameraLocation: "Zone B - Assembly Floor",
    timestamp: "2026-03-02T08:38:00Z", severity: "low", ppeStatus: "partial",
    missingItems: ["mask"], confidence: 0.82, acknowledged: true,
  },
  {
    id: "DET-0004", cameraId: "CAM-005", cameraLocation: "Zone C - Welding Station",
    timestamp: "2026-03-02T08:30:00Z", severity: "high", ppeStatus: "violation",
    missingItems: ["helmet", "goggles"], confidence: 0.94, personId: "P-0015", acknowledged: false,
  },
  {
    id: "DET-0005", cameraId: "CAM-002", cameraLocation: "Zone A - Loading Bay",
    timestamp: "2026-03-02T08:22:00Z", severity: "critical", ppeStatus: "violation",
    missingItems: ["helmet"], confidence: 0.99, personId: "P-0033", acknowledged: false,
  },
  {
    id: "DET-0006", cameraId: "CAM-008", cameraLocation: "Zone B - Workshop",
    timestamp: "2026-03-02T08:15:00Z", severity: "medium", ppeStatus: "partial",
    missingItems: ["gloves", "boots"], confidence: 0.86, personId: "P-0009", acknowledged: false,
  },
  {
    id: "DET-0007", cameraId: "CAM-001", cameraLocation: "Zone A - Main Entrance",
    timestamp: "2026-03-02T07:58:00Z", severity: "low", ppeStatus: "partial",
    missingItems: ["mask"], confidence: 0.79, acknowledged: true,
  },
  {
    id: "DET-0008", cameraId: "CAM-003", cameraLocation: "Zone B - Assembly Floor",
    timestamp: "2026-03-02T07:45:00Z", severity: "high", ppeStatus: "violation",
    missingItems: ["vest", "boots"], confidence: 0.91, personId: "P-0041", acknowledged: true,
  },
  {
    id: "DET-0009", cameraId: "CAM-005", cameraLocation: "Zone C - Welding Station",
    timestamp: "2026-03-02T07:30:00Z", severity: "medium", ppeStatus: "partial",
    missingItems: ["goggles"], confidence: 0.85, acknowledged: true,
  },
  {
    id: "DET-0010", cameraId: "CAM-002", cameraLocation: "Zone A - Loading Bay",
    timestamp: "2026-03-02T07:12:00Z", severity: "critical", ppeStatus: "violation",
    missingItems: ["helmet", "vest", "gloves"], confidence: 0.98, personId: "P-0055", acknowledged: true,
  },
  {
    id: "DET-0011", cameraId: "CAM-007", cameraLocation: "Zone A - Parking",
    timestamp: "2026-03-02T06:50:00Z", severity: "low", ppeStatus: "partial",
    missingItems: ["vest"], confidence: 0.77, acknowledged: true,
  },
  {
    id: "DET-0012", cameraId: "CAM-008", cameraLocation: "Zone B - Workshop",
    timestamp: "2026-03-02T06:35:00Z", severity: "high", ppeStatus: "violation",
    missingItems: ["helmet"], confidence: 0.93, personId: "P-0018", acknowledged: true,
  },
  {
    id: "DET-0013", cameraId: "CAM-001", cameraLocation: "Zone A - Main Entrance",
    timestamp: "2026-03-01T16:44:00Z", severity: "medium", ppeStatus: "partial",
    missingItems: ["gloves"], confidence: 0.84, acknowledged: true,
  },
  {
    id: "DET-0014", cameraId: "CAM-003", cameraLocation: "Zone B - Assembly Floor",
    timestamp: "2026-03-01T15:30:00Z", severity: "critical", ppeStatus: "violation",
    missingItems: ["helmet", "vest"], confidence: 0.96, personId: "P-0027", acknowledged: true,
  },
  {
    id: "DET-0015", cameraId: "CAM-005", cameraLocation: "Zone C - Welding Station",
    timestamp: "2026-03-01T14:20:00Z", severity: "high", ppeStatus: "violation",
    missingItems: ["goggles", "gloves"], confidence: 0.90, personId: "P-0012", acknowledged: true,
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "ALT-001", detectionId: "DET-0001", cameraId: "CAM-002",
    location: "Zone A - Loading Bay", timestamp: "2026-03-02T08:44:00Z",
    severity: "critical", message: "Worker detected without helmet and safety vest",
    acknowledged: false,
  },
  {
    id: "ALT-002", detectionId: "DET-0002", cameraId: "CAM-001",
    location: "Zone A - Main Entrance", timestamp: "2026-03-02T08:41:00Z",
    severity: "medium", message: "Worker detected without protective gloves",
    acknowledged: false,
  },
  {
    id: "ALT-003", detectionId: "DET-0004", cameraId: "CAM-005",
    location: "Zone C - Welding Station", timestamp: "2026-03-02T08:30:00Z",
    severity: "high", message: "Worker detected without helmet and safety goggles",
    acknowledged: false,
  },
  {
    id: "ALT-004", detectionId: "DET-0005", cameraId: "CAM-002",
    location: "Zone A - Loading Bay", timestamp: "2026-03-02T08:22:00Z",
    severity: "critical", message: "Worker detected without hard hat in hazard zone",
    acknowledged: false,
  },
  {
    id: "ALT-005", detectionId: "DET-0006", cameraId: "CAM-008",
    location: "Zone B - Workshop", timestamp: "2026-03-02T08:15:00Z",
    severity: "medium", message: "Worker missing gloves and safety boots",
    acknowledged: false,
  },
  {
    id: "ALT-006", detectionId: "DET-0007", cameraId: "CAM-001",
    location: "Zone A - Main Entrance", timestamp: "2026-03-02T07:58:00Z",
    severity: "low", message: "Worker detected without face mask",
    acknowledged: true,
  },
  {
    id: "ALT-007", detectionId: "DET-0008", cameraId: "CAM-003",
    location: "Zone B - Assembly Floor", timestamp: "2026-03-02T07:45:00Z",
    severity: "high", message: "Worker detected without safety vest and boots",
    acknowledged: true,
  },
  {
    id: "ALT-008", detectionId: "DET-0010", cameraId: "CAM-002",
    location: "Zone A - Loading Bay", timestamp: "2026-03-02T07:12:00Z",
    severity: "critical", message: "Multiple PPE violations: helmet, vest, and gloves missing",
    acknowledged: true,
  },
  {
    id: "ALT-009", detectionId: "DET-0012", cameraId: "CAM-008",
    location: "Zone B - Workshop", timestamp: "2026-03-02T06:35:00Z",
    severity: "high", message: "Worker detected without hard hat near machinery",
    acknowledged: true,
  },
  {
    id: "ALT-010", detectionId: "DET-0015", cameraId: "CAM-005",
    location: "Zone C - Welding Station", timestamp: "2026-03-01T14:20:00Z",
    severity: "high", message: "Welding worker detected without goggles and gloves",
    acknowledged: true,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalCameras: 8,
  activeCameras: 6,
  offlineCameras: 1,
  alertCameras: 1,
  todayDetections: 47,
  todayViolations: 12,
  complianceRate: 74.5,
  avgResponseTime: 1.8,
  activeAlerts: 5,
};

export const mockZones: Zone[] = [
  { id: "zone-a", name: "Zone A", cameraCount: 3, complianceRate: 61 },
  { id: "zone-b", name: "Zone B", cameraCount: 3, complianceRate: 88 },
  { id: "zone-c", name: "Zone C", cameraCount: 2, complianceRate: 95 },
];

export const mockReportSummary: ReportSummary = {
  period: "Last 7 Days",
  totalInspections: 1284,
  violations: 89,
  compliance: 93.1,
  topViolationType: "helmet",
  byDay: [
    { date: "Mon", violations: 14, compliant: 182 },
    { date: "Tue", violations: 9,  compliant: 177 },
    { date: "Wed", violations: 16, compliant: 171 },
    { date: "Thu", violations: 11, compliant: 188 },
    { date: "Fri", violations: 18, compliant: 165 },
    { date: "Sat", violations: 12, compliant: 143 },
    { date: "Sun", violations: 9,  compliant: 169 },
  ],
  byZone: [
    { zone: "Zone A", violations: 42, compliance: 77 },
    { zone: "Zone B", violations: 28, compliance: 88 },
    { zone: "Zone C", violations: 19, compliance: 95 },
  ],
  byPPEItem: [
    { item: "helmet",  violations: 38, percentage: 42.7 },
    { item: "vest",    violations: 27, percentage: 30.3 },
    { item: "gloves",  violations: 14, percentage: 15.7 },
    { item: "boots",   violations: 7,  percentage: 7.9  },
    { item: "mask",    violations: 3,  percentage: 3.4  },
  ],
};
