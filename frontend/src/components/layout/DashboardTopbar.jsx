import { Bell, Menu, Search, UserCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { SearchBar } from "./SearchBar";

export function DashboardTopbar({ onMenuClick, searchValue, onSearchChange, user }) {
  return (
    <header className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="xl:hidden" onClick={onMenuClick}>
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <div className="text-sm font-medium text-slate-300">Market intelligence workspace</div>
          <div className="text-xs text-slate-500">Connected to the existing PostgreSQL warehouse</div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 xl:w-auto xl:flex-row xl:items-center">
        <div className="w-full xl:w-[420px]">
          <SearchBar value={searchValue} onChange={onSearchChange} placeholder="Search Nifty100 companies..." />
        </div>
        <div className="flex items-center gap-2 self-end xl:self-auto">
          <Button variant="secondary" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-slate-950">
              <UserCircle2 className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium text-white">{user?.firstName ?? "Guest"}</div>
              <div className="text-xs text-slate-400">{user?.role ?? "Research Analyst"}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

