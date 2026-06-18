import { PORTAL_NAME } from "../constants/branding.js";
import { useAuth } from "../context/AuthContext.jsx";

const BrandLogo = ({ size = "md", showName = true, className = "" }) => {
  const sizes = {
    sm: "h-9 w-9 text-base",
    md: "h-11 w-11 text-lg",
    lg: "h-16 w-16 text-2xl"
  };

  const { user } = useAuth();
  const portalLabel = user?.role === "ALUMNI" ? "Alumni Portal" : "Admin Portal";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-lg bg-white text-brand-900 shadow-sm ring-1 ring-slate-200`}>
        A
      </span>
      {showName && (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-900">{PORTAL_NAME}</p>
          <p className="truncate text-xs text-slate-500">{portalLabel}</p>
        </div>
      )}
    </div>
  );
};

export default BrandLogo;
