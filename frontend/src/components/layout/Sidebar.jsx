import { motion } from "framer-motion";
import {
  BarChart3,
  Building2,
  FileText,
  LayoutDashboard,
  Radar,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

const items = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "companies", label: "Companies", icon: Building2 },
  { id: "analysis", label: "Analysis", icon: Radar },
  { id: "reports", label: "Reports", icon: FileText },
];

export function Sidebar({ activeView, onChangeView, onClose, mobileOpen = false }) {
  return (
    <motion.aside
      initial={false}
      animate={{ x: mobileOpen ? 0 : 0 }}
      className={cn(
        "glass-panel fixed inset-y-0 left-0 z-50 w-80 border-r border-white/10 p-5 lg:static lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      <div className="mb-8 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-slate-950">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Nifty100</div>
            <div className="text-xs text-slate-400">Workspace</div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-8 hidden items-center gap-3 lg:flex">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-slate-950">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-sm font-semibold">Nifty100</div>
          <div className="text-xs text-slate-400">Financial Intelligence</div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition",
                isActive
                  ? "bg-white/10 text-white shadow-lg shadow-indigo-500/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 text-cyan-300" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure
        </div>
        <p className="text-sm leading-6 text-slate-300">
          JWT-backed sessions, refresh handling, and protected routes are wired for the
          production auth flow.
        </p>
      </div>
    </motion.aside>
  );
}

