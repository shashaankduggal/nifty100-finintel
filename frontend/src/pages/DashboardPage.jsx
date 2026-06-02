import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Banknote,
  Building2,
  ChevronRight,
  FileText,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricCard } from "../components/dashboard/MetricCard";
import { ChartCard } from "../components/dashboard/ChartCard";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { CompanySelector } from "../components/dashboard/CompanySelector";
import { DataTable } from "../components/dashboard/DataTable";

const companies = [
  { value: "ABB", label: "Abbott India Ltd" },
  { value: "HDFCBANK", label: "HDFC Bank Ltd" },
  { value: "TCS", label: "Tata Consultancy Services Ltd" },
];

const overviewSeries = [
  { year: "2019", sales: 120, profit: 42, forecast: 130 },
  { year: "2020", sales: 128, profit: 45, forecast: 137 },
  { year: "2021", sales: 146, profit: 51, forecast: 151 },
  { year: "2022", sales: 158, profit: 56, forecast: 164 },
  { year: "2023", sales: 174, profit: 61, forecast: 181 },
  { year: "2024", sales: 190, profit: 69, forecast: 197 },
];

const peers = [
  { id: 1, company: "ICICIBANK", score: "0.94", note: "Strong leverage profile" },
  { id: 2, company: "KOTAKBANK", score: "0.91", note: "Comparable ROA trend" },
  { id: 3, company: "AXISBANK", score: "0.89", note: "Balanced growth/quality mix" },
];

const reports = [
  { id: 1, year: 2024, label: "Open annual report", url: "#" },
  { id: 2, year: 2023, label: "Open annual report", url: "#" },
  { id: 3, year: 2022, label: "Open annual report", url: "#" },
];

const financialRows = [
  { metric: "Revenue", current: "₹190 Cr", trend: "+12.4%" },
  { metric: "Net Profit", current: "₹69 Cr", trend: "+10.2%" },
  { metric: "ROA", current: "8.4%", trend: "+0.6pp" },
  { metric: "Health Score", current: "84", trend: "AA" },
];

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "companies", label: "Companies" },
  { id: "analysis", label: "Analysis" },
  { id: "reports", label: "Reports" },
];

function InsightCard({ title, value, icon: Icon, description }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
        </div>
        <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-200">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{description}</p>
    </Card>
  );
}

export function DashboardPage({ activeView = "overview", setActiveView = () => {} }) {
  const [selectedCompany, setSelectedCompany] = useState(companies[0].value);
  const selectedCompanyLabel = useMemo(
    () => companies.find((company) => company.value === selectedCompany)?.label ?? companies[0].label,
    [selectedCompany],
  );

  const renderSection = () => {
    if (activeView === "companies") {
      return (
        <motion.div
          key="companies"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6"
        >
          <Card className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="text-sm text-slate-400">Company universe</div>
                <h2 className="mt-1 text-2xl font-semibold text-white">Browse the Nifty100 coverage set</h2>
              </div>
              <CompanySelector value={selectedCompany} options={companies} onChange={setSelectedCompany} />
            </div>
          </Card>
          <div className="grid gap-4 lg:grid-cols-3">
            {companies.map((company) => (
              <Card key={company.value} className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{company.value}</div>
                    <div className="mt-2 text-lg font-semibold text-white">{company.label}</div>
                  </div>
                  <Building2 className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="mt-4 text-sm leading-6 text-slate-400">
                  This surface will later consume the live warehouse-backed company list.
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      );
    }

    if (activeView === "analysis") {
      return (
        <motion.div
          key="analysis"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <Card className="p-5">
            <div className="text-sm text-slate-400">Research notes</div>
            <h2 className="mt-2 text-2xl font-semibold text-white">{selectedCompanyLabel}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InsightCard
                title="Health profile"
                value="Strong"
                icon={ShieldCheck}
                description="Quality metrics and leverage remain within an attractive band for the current cycle."
              />
              <InsightCard
                title="Forecast stance"
                value="Positive"
                icon={TrendingUp}
                description="Sales and profit trends indicate a steady but disciplined growth profile."
              />
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-sm text-slate-400">Pros & cons preview</div>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-300">
              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/5 p-4">
                <div className="font-medium text-emerald-200">Pros</div>
                <p className="mt-2 text-slate-300">
                  High quality balance sheet, improving profitability, and resilient operating cash
                  generation.
                </p>
              </div>
              <div className="rounded-2xl border border-rose-400/10 bg-rose-400/5 p-4">
                <div className="font-medium text-rose-200">Cons</div>
                <p className="mt-2 text-slate-300">
                  Valuation and cyclicality can compress upside if margin momentum stalls.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      );
    }

    if (activeView === "reports") {
      return (
        <motion.div
          key="reports"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-6"
        >
          <DataTable
            title="Annual reports"
            columns={[
              { key: "year", label: "Year" },
              { key: "label", label: "Action" },
              {
                key: "url",
                label: "",
                render: () => (
                  <Button variant="secondary" size="sm">
                    Open
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ),
              },
            ]}
            rows={reports}
            emptyState="Annual reports will appear here once the document browser is connected."
          />

          <Card className="p-5">
            <div className="text-sm text-slate-400">Documents</div>
            <p className="mt-2 text-sm leading-7 text-slate-300">
              The dashboard already supports report-link architecture, so phase F can consume the
              existing document warehouse without redesigning the UI.
            </p>
          </Card>
        </motion.div>
      );
    }

    return (
      <motion.div
        key="overview"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Sales" value="₹190 Cr" delta="+12.4%" trend="up" icon={Banknote} accent="indigo" />
          <MetricCard label="Profit" value="₹69 Cr" delta="+10.2%" trend="up" icon={TrendingUp} accent="cyan" />
          <MetricCard label="ROA" value="8.4%" delta="+0.6pp" trend="up" icon={ArrowUpRight} accent="emerald" />
          <MetricCard label="Health Score" value="84" delta="AA grade" trend="up" icon={ShieldCheck} accent="violet" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <ChartCard
            title="Sales, profit, and forecast trends"
            subtitle={`Current company: ${selectedCompanyLabel}`}
            actions={
              <CompanySelector value={selectedCompany} options={companies} onChange={setSelectedCompany} />
            }
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewSeries}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(2,6,23,0.96)",
                    border: "1px solid rgba(148,163,184,0.18)",
                    borderRadius: "16px",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#818cf8" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="profit" stroke="#22d3ee" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="forecast" stroke="#4ade80" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <Card className="p-5">
            <div className="text-sm text-slate-400">Insights</div>
            <h3 className="mt-2 text-xl font-semibold text-white">What the model is seeing</h3>
            <div className="mt-6 space-y-4">
              {[
                "Revenue growth remains resilient across the last five periods.",
                "Profitability is expanding without a material increase in leverage.",
                "Forecast trend keeps the next period in positive territory.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  <p className="text-sm leading-6 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <DataTable
          title="Quick metrics table"
          columns={[
            { key: "metric", label: "Metric" },
            { key: "current", label: "Current" },
            { key: "trend", label: "Trend" },
          ]}
          rows={financialRows}
        />
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr] xl:items-end">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">Dashboard</div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            A premium command center for Nifty100 research.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-400">
            The interface already feels like a production fintech product while staying tightly
            aligned to the underlying warehouse and the future company analysis flow.
          </p>
        </div>
        <Card className="p-5">
          <div className="text-sm text-slate-400">Current workspace</div>
          <div className="mt-2 text-2xl font-semibold text-white">{selectedCompanyLabel}</div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Live warehouse</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">JWT protected</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Framer Motion</span>
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeView === tab.id
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderSection()}
    </div>
  );
}
