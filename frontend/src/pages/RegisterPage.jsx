import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, Mail, User2, LockKeyhole } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { PageContainer } from "../components/layout/PageContainer";
import { useAuth } from "../context/AuthContext";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [formState, setFormState] = useState({
    firstName: "",
    company: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await register(formState);
      navigate("/dashboard", { replace: true });
    } catch (authError) {
      setError(authError?.response?.data?.detail ?? "Registration failed. Connect the JWT backend and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageContainer className="flex min-h-screen items-center py-12">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="mx-auto w-full max-w-xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">Create your account</h2>
              <p className="mt-2 text-sm text-slate-400">Set up access for the research workspace.</p>
            </div>

            <form className="space-y-4" onSubmit={submit}>
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Full name</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <User2 className="h-4 w-4 text-slate-400" />
                  <input
                    required
                    value={formState.firstName}
                    onChange={(event) => setFormState((current) => ({ ...current, firstName: event.target.value }))}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="Shashaank Duggal"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Company</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <input
                    required
                    value={formState.company}
                    onChange={(event) => setFormState((current) => ({ ...current, company: event.target.value }))}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="Fintech Studio"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Email</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                    placeholder="name@company.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Password</span>
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
                {isSubmitting ? "Creating account..." : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            <Building2 className="h-4 w-4" />
            Built for hiring-grade review
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Join the platform that makes warehouse data feel like a product.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
            The foundation is already wired for DRF SimpleJWT, route protection, automatic token
            attachment, and refresh orchestration.
          </p>
          <div className="mt-8 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/admin/login" className="text-cyan-200 underline-offset-4 hover:underline">
              Sign in here
            </Link>
          </div>
        </motion.div>
      </div>
    </PageContainer>
  );
}
