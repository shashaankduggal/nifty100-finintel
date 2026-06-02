import { Link, NavLink } from "react-router-dom";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "../ui/Button";
import { PageContainer } from "./PageContainer";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Login", href: "/login" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <PageContainer className="flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[0.2em] text-slate-200 uppercase">Nifty100</div>
            <div className="text-sm text-slate-400">Financial Intelligence</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((item) =>
            item.href.startsWith("#") ? (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ) : (
              <NavLink
                key={item.label}
                to={item.href}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-sm transition ${isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
          <Button asChild variant="primary" className="ml-2">
            <Link to="/register">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </PageContainer>
    </header>
  );
}

