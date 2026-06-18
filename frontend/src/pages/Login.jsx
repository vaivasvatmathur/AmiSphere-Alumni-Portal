import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../components/BrandLogo.jsx";
import Footer from "../components/Footer.jsx";
import { PORTAL_NAME, UNIVERSITY_HEADER } from "../constants/branding.js";
import { useAuth } from "../context/AuthContext.jsx";

const content = {
  ADMIN: {
    portalBadgeSub: "Department Admin Portal",
    mainHeading: "Alumni records,\nmanaged with\nclarity.",
    description: "Department of Information Technology, ASET,\nAmity University, Noida",
    bottomCardTitle: "Authorized access only",
    bottomCardDesc: "For department administration usage",
    tag: "LOGIN ADMIN",
    heading: "Welcome to AmiSphere",
    subtitle: "Sign in to manage alumni records, uploads, analytics, directories, and reports.",
    emailPlaceholder: "admin@amity.edu",
    passwordPlaceholder: "Enter admin password",
    buttonText: "Sign in as Admin"
  },
  ALUMNI: {
    portalBadgeSub: "Alumni Portal",
    mainHeading: "Reconnect,\ngrow your network,\nand stay connected.",
    description: "Connect with alumni, update your professional profile, explore opportunities, and stay engaged with your university community.",
    bottomCardTitle: "Alumni Community Access",
    bottomCardDesc: "Connect • Network • Grow",
    tag: "ALUMNI LOGIN",
    heading: "Welcome Back, Alumni",
    subtitle: "Sign in to access your alumni profile, professional network, career updates, and university events.",
    emailPlaceholder: "Enter your email address",
    passwordPlaceholder: "Enter your password",
    buttonText: "Sign in as Alumni"
  }
};

const Login = () => {
  const { login, logout, user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [displayRole, setDisplayRole] = useState("ADMIN");
  const [fadeState, setFadeState] = useState("fade-in");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectDoneRef = useRef(false);

  // Redirect once when already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && !redirectDoneRef.current) {
      redirectDoneRef.current = true;
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const role = user?.role || storedUser?.role;
      const fromPath = location.state?.from?.pathname;

      if (fromPath && fromPath !== "/login") {
        navigate(fromPath, { replace: true });
        return;
      }

      if (role === "ALUMNI") {
        navigate("/alumni/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [loading, isAuthenticated, navigate, location.pathname, user]);

  // Show loading state while auth initializes
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white border-t-gold-400"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </main>
    );
  }

  const handleRoleChange = (role) => {
    if (role === selectedRole) return;
    setSelectedRole(role);
    setFadeState("fade-out");
    setTimeout(() => {
      setDisplayRole(role);
      setFadeState("fade-in");
    }, 200);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(credentials);

      // After login, ensure role matches selection
      const storedUser = JSON.parse(localStorage.getItem("user") || "null");
      const role = storedUser?.role;

      if (selectedRole === "ADMIN") {
        if (role === "ADMIN") {
          navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
        } else {
          logout();
          setError("Selected login type does not match your account.");
        }
      } else if (selectedRole === "ALUMNI") {
        if (role === "ALUMNI") {
          navigate("/alumni/dashboard", { replace: true });
        } else {
          logout();
          setError("Selected login type does not match your account.");
        }
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeContent = content[displayRole];

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
                  <p className={`text-xs font-medium text-slate-500 transition-opacity duration-200 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
                    {activeContent.portalBadgeSub}
                  </p>
                </div>
              </div>

              <div className={`mt-10 max-w-sm transition-opacity duration-200 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-400">AMITY UNIVERSITY</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl whitespace-pre-line">
                  {activeContent.mainHeading}
                </h1>
                <p className="mt-4 text-sm leading-6 text-white/75 whitespace-pre-line">
                  {activeContent.description}
                </p>
              </div>
            </div>

            <div className={`relative mt-8 rounded-xl border border-white/10 bg-white/10 p-4 transition-opacity duration-200 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-400 text-lg">
                  {displayRole === "ADMIN" ? "🔒" : "🎓"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{activeContent.bottomCardTitle}</p>
                  <p className="text-xs text-white/70">{activeContent.bottomCardDesc}</p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex items-center px-6 py-8 sm:px-10 lg:px-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <BrandLogo size="md" className="lg:hidden" />
                <div className="mt-5">
                  <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-gold-600 lg:mt-0 transition-opacity duration-200 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
                    {activeContent.tag}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
                    <button
                      type="button"
                      onClick={() => handleRoleChange("ADMIN")}
                      aria-pressed={selectedRole === "ADMIN"}
                      className={`px-4 py-2 text-xs font-semibold rounded-md focus:outline-none transition ${
                        selectedRole === "ADMIN" ? "bg-brand-600 text-white shadow-md" : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleChange("ALUMNI")}
                      aria-pressed={selectedRole === "ALUMNI"}
                      className={`px-4 py-2 text-xs font-semibold rounded-md focus:outline-none transition ${
                        selectedRole === "ALUMNI" ? "bg-brand-600 text-white shadow-md" : "bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Alumni
                    </button>
                  </div>
                </div>
                <h2 className={`mt-3 text-2xl font-semibold text-brand-900 transition-opacity duration-200 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
                  {activeContent.heading}
                </h2>
                <p className={`mt-2 text-sm leading-6 text-slate-500 transition-opacity duration-200 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
                  {activeContent.subtitle}
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
                      placeholder={content[selectedRole].emailPlaceholder}
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
                      placeholder={content[selectedRole].passwordPlaceholder}
                    />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="focus-ring w-full rounded-xl bg-brand-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-900/20 hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className={`transition-opacity duration-200 ${fadeState === "fade-in" ? "opacity-100" : "opacity-0"}`}>
                    {isSubmitting ? "Signing in..." : activeContent.buttonText}
                  </span>
                </button>
              </form>

              {selectedRole === "ALUMNI" && (
                <p className="mt-5 text-center text-xs text-slate-500">
                  New alumni here? Create your profile{" "}
                  <Link
                    to="/alumni/register"
                    className="font-semibold text-brand-700 hover:text-brand-600 hover:underline transition-colors"
                  >
                    Register Now
                  </Link>
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
      <Footer className="border-white/10 bg-brand-900 text-white/70" />
    </main>
  );
};

export default Login;
