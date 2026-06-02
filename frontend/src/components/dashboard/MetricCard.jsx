import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";
import { cn } from "../../lib/utils";

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: ArrowUpRight,
};

const accentStyles = {
  indigo: "bg-indigo-500/15 text-indigo-200",
  cyan: "bg-cyan-500/15 text-cyan-200",
  emerald: "bg-emerald-500/15 text-emerald-200",
  violet: "bg-violet-500/15 text-violet-200",
};

export function MetricCard({ label, value, delta, trend = "neutral", icon: Icon, accent = "indigo" }) {
  const TrendIcon = trendIcons[trend] ?? ArrowUpRight;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 260, damping: 24 }}>
      <Card className="h-full p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm text-slate-400">{label}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</div>
          </div>
          <div className={cn("rounded-2xl p-3", accentStyles[accent] ?? accentStyles.indigo)}>
            {Icon ? <Icon className="h-5 w-5" /> : null}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-emerald-200">
            <TrendIcon className="h-3.5 w-3.5" />
            {delta}
          </span>
          <span className="text-slate-500">vs previous period</span>
        </div>
      </Card>
    </motion.div>
  );
}
