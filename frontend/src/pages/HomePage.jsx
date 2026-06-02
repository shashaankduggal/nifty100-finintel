import { ArrowRight, BarChart3, Building2, FileText, LineChart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { PageContainer } from "../components/layout/PageContainer";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ChartCard } from "../components/dashboard/ChartCard";
import {
  LineChart as ReLineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const previewSeries = [
  { year: "2020", revenue: 42, profit: 18 },
  { year: "2021", revenue: 53, profit: 22 },
  { year: "2022", revenue: 61, profit: 28 },
  { year: "2023", revenue: 72, profit: 35 },
  { year: "2024", revenue: 84, profit: 41 },
];

const featureCards = [
  {
    title: "Financial Metrics",
    icon: BarChart3,
    description: "Track profitability, leverage, and efficiency across the Nifty100 universe.",
  },
  {
    title: "Health Scores",
    icon: ShieldCheck,
    description: "Distill complex statements into an actionable risk and quality view.",
  },
  {
    title: "Forecasting",
    icon: LineChart,
    description: "Inspect projected revenue and earnings trends from the warehouse models.",
  },
  {
    title: "Peer Analysis",
    icon: Users,
    description: "Benchmark a company against its closest operating peers in one click.",
  },
  {
    title: "Annual Reports",
    icon: FileText,
    description: "Open source documents instantly from the company profile view.",
  },
];

function StatBlock({ label, value, delta }) {
  return (
    <Card className="p-5">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-3 text-sm text-emerald-300">{delta}</div>
    </Card>
  );
}

export function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <Navbar />
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <section className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100"
            >
              <Sparkles className="h-4 w-4" />
              Premium financial intelligence for Nifty100
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="max-w-2xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              See Indian equities like a
              <span className="text-gradient"> modern fintech product</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            >
              Nifty100 FinIntel turns warehouse-grade financial data into a premium research
              experience for analysts, founders, and hiring managers who expect more than a
              dashboard.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <Link to="/register">
                  Start exploring
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/dashboard">Open dashboard</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.24 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              <StatBlock label="Companies tracked" value="100+" delta="+7.2% coverage" />
              <StatBlock label="Years of history" value="12+" delta="+1y refreshed" />
              <StatBlock label="Core insights" value="8" delta="Metrics, health, peers" />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="glass-panel rounded-[2rem] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-400">Live product preview</div>
                <div className="text-xl font-semibold text-white">Revenue + profit trend</div>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
                +14.8% YoY
              </div>
            </div>
            <ChartCard title="Preview chart" subtitle="Stylized dashboard preview for the hero section.">
              <ResponsiveContainer width="100%" height="100%">
                <ReLineChart data={previewSeries}>
                  <CartesianGrid stroke="rgba(148,163,184,0.14)" vertical={false} />
                  <XAxis dataKey="year" stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2,6,23,0.95)",
                      border: "1px solid rgba(148,163,184,0.18)",
                      borderRadius: "16px",
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#818cf8" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="profit" stroke="#22d3ee" strokeWidth={3} dot={false} />
                </ReLineChart>
              </ResponsiveContainer>
            </ChartCard>
          </motion.div>
        </section>

        <section id="features" className="mt-24">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Features
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Built like a premium SaaS product.
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="mt-24 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Card className="p-6">
            <div className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Dashboard preview
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-white">Interactive, not sterile.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              The dashboard shell already supports route transitions, protected access, a sticky
              topbar, and a refined sidebar that feels like a real product.
            </p>
            <div className="mt-6 flex gap-3">
              <Button asChild>
                <Link to="/dashboard">Open dashboard</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden p-0">
            <div className="border-b border-white/5 px-6 py-4">
              <div className="text-sm text-slate-400">Product preview</div>
              <div className="mt-1 text-lg font-semibold text-white">Portfolio intelligence cockpit</div>
            </div>
            <div className="grid gap-4 p-6 md:grid-cols-3">
              {[
                { label: "Sales trend", value: "+21%" },
                { label: "Health score", value: "84/100" },
                { label: "Peers compared", value: "5" },
              ].map((item) => (
                <Card key={item.label} className="p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{item.label}</div>
                  <div className="mt-3 text-2xl font-semibold text-white">{item.value}</div>
                </Card>
              ))}
            </div>
          </Card>
        </section>
      </PageContainer>

      <footer className="border-t border-white/5 bg-slate-950/70">
        <PageContainer className="flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-semibold text-white">Nifty100 FinIntel</div>
            <div className="text-sm text-slate-500">Premium equity intelligence for serious teams.</div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span>Financial Metrics</span>
            <span>Health Scores</span>
            <span>Forecasting</span>
            <span>Peer Analysis</span>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}

