import { Card } from "../ui/Card";

export function ChartCard({ title, subtitle, children, actions }) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
        {actions}
      </div>
      <div className="h-[320px] w-full min-w-0">{children}</div>
    </Card>
  );
}
