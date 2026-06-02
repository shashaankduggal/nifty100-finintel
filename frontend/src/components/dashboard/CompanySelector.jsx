import { ChevronDown } from "lucide-react";

export function CompanySelector({ value, options, onChange }) {
  return (
    <label className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
      <span className="text-slate-400">Company</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none bg-transparent pr-5 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950">
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="h-4 w-4 text-slate-400" />
    </label>
  );
}

