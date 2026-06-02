import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Search companies, metrics, reports..." }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-200 shadow-sm backdrop-blur">
      <Search className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={onChange}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
        placeholder={placeholder}
      />
    </label>
  );
}

