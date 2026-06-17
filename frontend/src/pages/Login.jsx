import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo.jsx";
import Footer from "../components/Footer.jsx";
import { PORTAL_NAME, UNIVERSITY_HEADER } from "../constants/branding.js";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(credentials);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-brand-900">
      <div className="flex flex-1 items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(245,197,66,0.22),_transparent_30%),linear-gradient(135deg,_#061a32_0%,_#0b2545_48%,_#173f6b_100%)] px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="relative flex min-h-[320px] flex-col justify-between bg-brand-900 p-7 text-white sm:p-9">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gold-400" />
            <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full border border-white/10" />
            <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-gold-400/20" />

            <div className="relative">
              <div className="inline-flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-soft">
                <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-900 text-xl font-bold text-white">
                  A
                </span>
                <div>
                  <p className="text-base font-semibold text-brand-900">{PORTAL_NAME}</p>
                  <p className="text-xs font-medium text-slate-500">Department Admin Portal</p>
                </div>
              </div>

              <div className="mt-10 max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">Amity University</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Alumni records, managed with clarity.
                </h1>
                <p className="mt-4 text-sm leading-6 text-white/75">{UNIVERSITY_HEADER}</p>
              </div>
            </div>

            <div className="relative mt-8 rounded-xl border border-white/10 bg-white/10 p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-400 text-brand-900">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Authorized access only</p>
                  <p className="text-xs text-white/70">For department administration usage</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex items-center px-6 py-8 sm:px-10 lg:px-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <BrandLogo size="md" className="lg:hidden" />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600 lg:mt-0">
                  LOGIN ADMIN
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-brand-900">Welcome to {PORTAL_NAME}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to manage alumni records, uploads, filters, and exports.
                </p>
              </div>

              {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      value={credentials.email}
                      onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-12 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white"
                      placeholder="admin@amity.edu"
                    />
                  </div>
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Password</span>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      required
                      value={credentials.password}
                      onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                      className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-12 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 hover:border-slate-300 focus:bg-white"
                      placeholder="Enter admin password"
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="focus-ring w-full rounded-xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
      <Footer className="border-white/10 bg-brand-900 text-white/70" />
    </main>
  );
};

export default Login;
