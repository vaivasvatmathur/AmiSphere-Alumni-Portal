import { Menu } from "lucide-react";
import { UNIVERSITY_HEADER } from "../constants/branding.js";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ onMenuClick }) => {
  const { admin } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-900">{UNIVERSITY_HEADER}</p>
          <p className="text-xs text-slate-500">Internal alumni records</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-semibold text-slate-950">Admin</p>
          <p className="max-w-44 truncate text-xs text-slate-500">{admin?.email}</p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
