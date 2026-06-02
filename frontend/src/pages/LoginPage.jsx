import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageContainer } from "../components/layout/PageContainer";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin, isAuthenticated } = useAuth();
  const [formState, setFormState] = useState({ identifier: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const from = location.state?.from?.pathname ?? "/dashboard";

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await adminLogin(formState);
      navigate(from, { replace: true });
    } catch (authError) {
      const responseMessage =
        authError?.response?.data?.detail ??
        authError?.response?.data?.non_field_errors?.[0] ??
        "Admin login failed. Connect a staff account and try again.";
      setError(responseMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <PageContainer className="flex min-h-screen items-center py-12">
      <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            <LockKeyhole className="h-4 w-4" />
            Admin JWT access
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Sign in with your admin username or email.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            This admin flow is wired for DRF SimpleJWT with access/refresh token rotation,
            protected routes, and refresh handling.
          </p>
          <div className="mt-8 text-sm text-slate-400">
            No account yet?{" "}
            <Link to="/register" className="text-cyan-200 underline-offset-4 hover:underline">
              Create one here
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="mx-auto w-full max-w-xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Admin login</h2>
              <p className="mt-2 text-sm text-slate-400">
                Use the staff username or email assigned to this workspace.
              </p>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Admin username or email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    required
                    value={formState.identifier}
                    onChange={(event) =>
                      setFormState((current) => ({ ...current, identifier: event.target.value }))
                    }
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="admin@company.com or admin"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Admin password</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <LockKeyhole className="h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="password"
                    value={formState.password}
                    onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              {error ? (
                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              ) : null}

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign in as admin"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </motion.div>
      </div>
    </PageContainer>
  );
}
