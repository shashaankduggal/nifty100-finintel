import { Card } from "../ui/Card";

export function DataTable({ title, columns, rows, emptyState = "No data available." }) {
  return (
    <Card className="p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      {rows.length ? (
        <div className="overflow-hidden rounded-2xl border border-white/5">
          <table className="min-w-full divide-y divide-white/5 text-left text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 font-medium">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((row, index) => (
                <tr key={row.id ?? index} className="bg-white/[0.02] transition hover:bg-white/[0.04]">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-slate-300">
                      {typeof column.render === "function" ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-slate-400">
          {emptyState}
        </div>
      )}
    </Card>
  );
}

