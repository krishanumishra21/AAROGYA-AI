import React from "react";

export default function StatCard({ label, value, sub, icon, color = "blue", trend }) {
  const colors = {
    blue: {
      bg: "bg-blue-50",
      icon: "bg-blue-600 shadow-blue-200",
      text: "text-blue-600",
      badge: "bg-blue-100 text-blue-600",
    },
    teal: {
      bg: "bg-teal-50",
      icon: "bg-teal-600 shadow-teal-200",
      text: "text-teal-600",
      badge: "bg-teal-100 text-teal-600",
    },
    violet: {
      bg: "bg-violet-50",
      icon: "bg-violet-600 shadow-violet-200",
      text: "text-violet-600",
      badge: "bg-violet-100 text-violet-600",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "bg-amber-500 shadow-amber-200",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-600",
    },
  };

  const c = colors[color] || colors.blue;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/80 p-6 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`w-12 h-12 rounded-xl ${c.icon} shadow-lg flex items-center justify-center text-white shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-800 mt-0.5 tracking-tight">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge} shrink-0`}>
          {trend}
        </span>
      )}
    </div>
  );
}