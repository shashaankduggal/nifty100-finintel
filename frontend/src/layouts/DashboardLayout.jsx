import { cloneElement, isValidElement, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { DashboardTopbar } from "../components/layout/DashboardTopbar";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export function DashboardLayout({ children }) {
  const { logout, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState("overview");

  const topbarUser = useMemo(
    () => user ?? { firstName: "Guest", role: "Research Analyst" },
    [user],
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {mobileMenuOpen ? (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <div className="flex min-h-screen">
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          activeView={activeView}
          onChangeView={(nextView) => {
            setActiveView(nextView);
            setMobileMenuOpen(false);
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar
            onMenuClick={() => setMobileMenuOpen(true)}
            searchValue={search}
            onSearchChange={(event) => setSearch(event.target.value)}
            user={topbarUser}
          />

          <div className="flex items-center justify-end px-4 pt-4 sm:px-6 lg:px-8">
            <Button variant="secondary" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>

          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="flex-1 px-4 py-6 sm:px-6 lg:px-8"
          >
            {isValidElement(children)
              ? cloneElement(children, {
                  activeView,
                  setActiveView,
                })
              : children}
          </motion.main>
        </div>
      </div>
    </div>
  );
}
