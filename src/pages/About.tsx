import PageHeader from "../components/PageHeader";

const techStack = [
  { name: "React 19",          color: "bg-blue-100 text-blue-700"   },
  { name: "TypeScript",        color: "bg-blue-100 text-blue-700"   },
  { name: "Vite 7",            color: "bg-purple-100 text-purple-700" },
  { name: "Tailwind CSS v4",   color: "bg-teal-100 text-teal-700"   },
  { name: "React Router v7",   color: "bg-pink-100 text-pink-700"   },
  { name: "FastAPI",           color: "bg-green-100 text-green-700" },
  { name: "Python",            color: "bg-yellow-100 text-yellow-700" },
  { name: "YOLOv8",            color: "bg-orange-100 text-orange-700" },
];

const ppeTypes = [
  { name: "Hard Hat / Helmet",   icon: "🪖" },
  { name: "Safety Vest",         icon: "🦺" },
  { name: "Protective Gloves",   icon: "🧤" },
  { name: "Safety Boots",        icon: "🥾" },
  { name: "Face Mask",           icon: "😷" },
  { name: "Safety Goggles",      icon: "🥽" },
];

export default function About() {
  return (
    <div>
      <PageHeader title="About" subtitle="System Information & Documentation" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* App Info */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">CCTV PPE Detection System</h2>
              <p className="text-sm text-slate-500">Workplace Safety Monitoring Platform</p>
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            {[
              ["Version",        "v1.0.0"],
              ["Environment",    "Development"],
              ["Release Date",   "March 2026"],
              ["License",        "Internal Use Only"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            An AI-powered CCTV monitoring system that automatically detects PPE compliance violations
            in real-time. The system uses computer vision to identify workers missing required
            personal protective equipment and alerts supervisors immediately.
          </p>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">System Status</h2>
          <dl className="space-y-3 text-sm">
            {[
              {
                label: "API Status",
                value: (
                  <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Mock Mode
                  </span>
                ),
              },
              { label: "Total Cameras Registered", value: "8" },
              { label: "Detection Model",          value: "YOLOv8-PPE" },
              { label: "Model Version",            value: "v2.3.1" },
              { label: "Backend Framework",        value: "FastAPI (Python)" },
              { label: "Last Data Sync",           value: "Just now (mock)" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <dt className="text-slate-500">{label}</dt>
                <dd className="font-medium text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* PPE Detection Types */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Detectable PPE Types</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ppeTypes.map((ppe) => (
            <div key={ppe.name} className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <span className="text-2xl">{ppe.icon}</span>
              <span className="text-xs font-medium text-slate-700 leading-tight">{ppe.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-slate-800 mb-4">Technology Stack</h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span key={tech.name} className={`px-3 py-1.5 rounded-full text-sm font-medium ${tech.color}`}>
              {tech.name}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex items-center justify-between text-sm text-slate-500">
        <span>Developed by the CCTVAi Team · 2026</span>
        <span className="text-xs text-slate-400">
          For support: <a href="mailto:admin@cctvppe.local" className="text-blue-600 hover:underline">admin@cctvppe.local</a>
        </span>
      </div>
    </div>
  );
}
