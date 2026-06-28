import { GraduationCap, LockKeyhole, Mail, Shield, ShieldCheck } from "lucide-react";
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
          <aside className="relative flex min-h-[320px] flex-col justify-between bg-[#061A32] p-7 text-white sm:p-9 overflow-hidden">
            {/* Top gold bar */}
            <div className="absolute inset-x-0 top-0 h-1.5 bg-[#F5C542] z-20" />
            
            {/* Premium background decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,197,66,0.15),_transparent_40%)] pointer-events-none" />
            
            {/* Floating gradient circles */}
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#F5C542]/5 blur-3xl animate-pulse-slow pointer-events-none" />
            <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#173f6b]/40 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl animate-float-slow pointer-events-none" />
            
            {/* Grid overlay for high-tech premium feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.02)_1px,_transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            <div className="relative z-10">
              <div className="group relative inline-flex items-center gap-4 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 hover:-translate-y-[2px] hover:shadow-xl hover:shadow-black/15">
                {/* Gold accent bar */}
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-[#F5C542] transition-all duration-300 group-hover:h-2/3" />
                
                <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#061A32] text-2xl font-bold text-white shadow-md shadow-[#061A32]/25 transition-transform duration-300 group-hover:scale-105">
                  A
                </span>
                <div className="pr-2">
                  <p className="text-lg font-bold text-[#061A32] tracking-tight">{PORTAL_NAME}</p>
                  <p className={`text-xs font-medium text-slate-500 transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} ${fadeState === "fade-in" ? "delay-[0ms]" : "delay-0"}`}>
                    {activeContent.portalBadgeSub}
                  </p>
                </div>
              </div>

              <div className="mt-10 max-w-sm">
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-[#F5C542] transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${fadeState === "fade-in" ? "delay-[50ms]" : "delay-0"}`}>
                  AMITY UNIVERSITY
                </p>
                <h1 className={`mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl whitespace-pre-line transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${fadeState === "fade-in" ? "delay-[120ms]" : "delay-0"}`}>
                  {activeContent.mainHeading}
                </h1>
                <p className={`mt-4 text-sm leading-6 text-white/75 whitespace-pre-line transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${fadeState === "fade-in" ? "delay-[190ms]" : "delay-0"}`}>
                  {activeContent.description}
                </p>
              </div>
            </div>

            <div className={`relative mt-8 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${fadeState === "fade-in" ? "delay-[260ms]" : "delay-0"}`}>
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5C542] text-lg shadow-md transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 scale-100" : "opacity-0 scale-90"} ${fadeState === "fade-in" ? "delay-[260ms]" : "delay-0"}`}>
                  {displayRole === "ADMIN" ? "🔒" : "🎓"}
                </span>
                <div>
                  <p className={`text-sm font-semibold text-white transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} ${fadeState === "fade-in" ? "delay-[310ms]" : "delay-0"}`}>
                    {activeContent.bottomCardTitle}
                  </p>
                  <p className={`text-xs text-white/70 transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} ${fadeState === "fade-in" ? "delay-[360ms]" : "delay-0"}`}>
                    {activeContent.bottomCardDesc}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex items-center px-6 py-8 sm:px-10 lg:px-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <BrandLogo size="md" className="lg:hidden" />
                <div className="mt-5">
                  <p className="text-sm font-semibold text-brand-900 lg:mt-0">
                    Select Portal
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Choose the portal you want to access.
                  </p>

                  {/* Premium Pill Role Selector */}
                  <div className="relative mt-3 flex w-full items-center rounded-full border border-slate-200 bg-[#F8FAFC] p-1 shadow-sm transition-all duration-300 hover:shadow-md" role="radiogroup" aria-label="Portal selection">
                    {/* Animated sliding indicator */}
                    <span
                      className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-[#061A32] shadow-md transition-all duration-300 ease-in-out"
                      style={{ left: selectedRole === "ADMIN" ? "4px" : "calc(50% + 0px)" }}
                      aria-hidden="true"
                    />

                    {/* Admin Button */}
                    <button
                      type="button"
                      role="radio"
                      onClick={() => handleRoleChange("ADMIN")}
                      aria-selected={selectedRole === "ADMIN"}
                      aria-pressed={selectedRole === "ADMIN"}
                      className={`relative z-10 flex w-1/2 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#061A32] focus-visible:ring-offset-2 ${
                        selectedRole === "ADMIN"
                          ? "text-white scale-[1.02]"
                          : "text-[#061A32] hover:bg-slate-100 active:scale-[0.98] cursor-pointer"
                      }`}
                    >
                      <Shield size={16} className={`transition-all duration-300 ${selectedRole === "ADMIN" ? "text-[#F5C542]" : "text-slate-400"}`} />
                      Admin
                    </button>

                    {/* Alumni Button */}
                    <button
                      type="button"
                      role="radio"
                      onClick={() => handleRoleChange("ALUMNI")}
                      aria-selected={selectedRole === "ALUMNI"}
                      aria-pressed={selectedRole === "ALUMNI"}
                      className={`relative z-10 flex w-1/2 items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#061A32] focus-visible:ring-offset-2 ${
                        selectedRole === "ALUMNI"
                          ? "text-white scale-[1.02]"
                          : "text-[#061A32] hover:bg-slate-100 active:scale-[0.98] cursor-pointer"
                      }`}
                    >
                      <GraduationCap size={16} className={`transition-all duration-300 ${selectedRole === "ALUMNI" ? "text-[#F5C542]" : "text-slate-400"}`} />
                      Alumni
                    </button>
                  </div>
                </div>
                <h2 className={`mt-6 text-2xl font-semibold text-brand-900 transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${fadeState === "fade-in" ? "delay-[70ms]" : "delay-0"}`}>
                  {activeContent.heading}
                </h2>
                <p className={`mt-2 text-sm leading-6 text-slate-500 transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${fadeState === "fade-in" ? "delay-[140ms]" : "delay-0"}`}>
                  {activeContent.subtitle}
                </p>
              </div>

              {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-5">
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={credentials.email}
                      onChange={(event) => setCredentials({ ...credentials, email: event.target.value })}
                      className="peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-12 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 placeholder:transition-opacity placeholder:duration-250 hover:border-slate-300 focus:border-[#061A32] focus:bg-white focus:shadow-md focus:shadow-[#061A32]/5 focus:scale-[1.01] focus:placeholder:opacity-50 transition-all duration-250 ease-in-out outline-none"
                      placeholder={content[selectedRole].emailPlaceholder}
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none transition-colors duration-250 peer-hover:text-slate-500 peer-focus:text-[#F5C542]" size={18} />
                  </div>
                </label>
                <label className="space-y-2 block">
                  <span className="text-sm font-semibold text-slate-700">Password</span>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={credentials.password}
                      onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
                      className="peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-12 text-sm text-brand-900 shadow-sm placeholder:text-slate-400 placeholder:transition-opacity placeholder:duration-250 hover:border-slate-300 focus:border-[#061A32] focus:bg-white focus:shadow-md focus:shadow-[#061A32]/5 focus:scale-[1.01] focus:placeholder:opacity-50 transition-all duration-250 ease-in-out outline-none"
                      placeholder={content[selectedRole].passwordPlaceholder}
                    />
                    <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none transition-colors duration-250 peer-hover:text-slate-500 peer-focus:text-[#F5C542]" size={18} />
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#061A32] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#061A32]/10 hover:bg-[#0C2C53] hover:-translate-y-[2px] hover:shadow-xl hover:shadow-[#061A32]/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300 ease-in-out"
                >
                  <span className={`block transition-all duration-400 ease-out transform ${fadeState === "fade-in" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"} ${fadeState === "fade-in" ? "delay-[210ms]" : "delay-0"}`}>
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
