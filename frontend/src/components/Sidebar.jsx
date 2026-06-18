import {
  LayoutDashboard,
  LogOut,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  UploadCloud
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const SidebarContent = ({ isCollapsed = false, onClose, onToggleCollapse, isMobile = false, profile }) => {
  const { logout, user } = useAuth();
  const isAdmin = (profile?.role || user?.role) === "ADMIN";
  const roleLabel = isAdmin ? "Admin" : "Alumni";

  // Completely separate navigation items for Admin (Management) vs Alumni (Career/Network)
  const navItems = isAdmin
    ? [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/alumni", label: "Alumni Directory", icon: Users },
        { to: "/admin/alumni/new", label: "Add Alumni", icon: PlusCircle },
        { to: "/admin/upload", label: "Bulk Upload", icon: UploadCloud }
      ]
    : [
        { to: "/alumni/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/alumni/profile", label: "My Profile", icon: User },
        { to: "/alumni/edit-profile", label: "Edit Profile", icon: Settings },
        { to: "/directory", label: "Alumni Network", icon: Users }
      ];

  const navigate = useNavigate();

  const displayName = profile?.alumni?.fullName || profile?.name || user?.fullName || user?.name || user?.email || "Guest";
  const displayEmail = profile?.email || user?.email || "No email";
  const avatarUrl = profile?.alumni?.photo;

  const initials = (name = "") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-full flex-col bg-[#061A32] text-slate-300">
      {/* Sidebar Header */}
      <div className={`flex items-center border-b border-slate-800 ${isCollapsed && !isMobile ? "py-5 px-0 justify-center" : "p-5 justify-between"}`}>
        {isCollapsed && !isMobile ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-[#061A32] text-xl font-bold shadow-md transition-all duration-300">
            A
          </div>
        ) : (
          <div className="flex items-center gap-3 overflow-hidden w-full">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400 text-[#061A32] text-lg font-bold shadow-md">
              A
            </span>
            <div className="min-w-0 transition-opacity duration-200">
              <p className="truncate text-sm font-bold text-white tracking-wide">AmiSphere</p>
              <p className="truncate text-[10px] uppercase font-semibold text-gold-400 tracking-wider">
                {roleLabel} Portal
              </p>
            </div>
          </div>
        )}
        {!isMobile && !isCollapsed && (
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
            onClick={onToggleCollapse}
          >
            <ChevronLeft size={16} />
          </button>
        )}
        {!isMobile && isCollapsed && (
          <button
            type="button"
            aria-label="Expand sidebar"
            className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-800 bg-[#061A32] text-slate-400 hover:text-white transition-all duration-200 shadow-md"
            onClick={onToggleCollapse}
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* User Profile Card */}
      <div className="px-4 py-6 border-b border-slate-800">
        {isCollapsed && !isMobile ? (
          <div className="group relative flex justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-11 w-11 rounded-xl object-cover border border-slate-700 hover:border-gold-400 transition-colors cursor-pointer"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-white border border-slate-700 cursor-pointer hover:border-gold-400 transition-colors">
                {initials(displayName)}
              </div>
            )}
            {/* Tooltip */}
            <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 scale-0 group-hover:scale-100 rounded bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg transition-all origin-left font-medium whitespace-nowrap pointer-events-none">
              {displayName}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 shadow-inner">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="avatar"
                  className="h-11 w-11 rounded-xl object-cover ring-2 ring-slate-800 shrink-0"
                />
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white ring-2 ring-slate-800">
                  {initials(displayName)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{displayName}</p>
                <p className="truncate text-xs text-slate-400">{displayEmail}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-gold-400">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400"></span>
                {roleLabel}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className={`flex-1 px-3 py-6 flex flex-col justify-start ${isCollapsed && !isMobile ? "space-y-5" : "space-y-2.5"}`}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            end
            className={({ isActive }) => {
              const base = "group flex items-center rounded-xl transition-all duration-300 relative ";
              const active = "bg-[#0b2545] text-white font-semibold shadow-md";
              const inactive = "text-slate-400 hover:bg-slate-800/40 hover:text-white";
              const layout = isCollapsed && !isMobile 
                ? "justify-center p-3 w-12 h-12 mx-auto" 
                : "gap-3 px-4 py-3 text-sm";
              return base + (isActive ? `${active} ` : `${inactive} `) + layout;
            }}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? "text-[#f5c542] shrink-0" : "text-slate-400 group-hover:text-white transition-colors shrink-0"} />
                {(!isCollapsed || isMobile) && <span className="truncate">{label}</span>}
                {isCollapsed && !isMobile && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 z-50 scale-0 group-hover:scale-100 rounded bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg transition-all origin-left font-medium whitespace-nowrap pointer-events-none">
                    {label}
                  </div>
                )}
                <span className={`absolute left-0 top-2.5 bottom-2.5 w-1 bg-[#f5c542] rounded-r-md transition-all duration-300 origin-left ${isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"}`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Pinned Logout Button */}
      <div className="border-t border-slate-800 p-4">
        {isCollapsed && !isMobile ? (
          <div className="group relative flex justify-center">
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-800 bg-transparent text-slate-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
              <LogOut size={16} />
            </button>
            <div className="absolute left-16 top-1/2 -translate-y-1/2 scale-0 group-hover:scale-100 rounded bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg transition-all origin-left font-medium">
              Logout
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-transparent px-4 py-3 text-sm font-medium text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={16} />
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse, profile }) => {
  return (
    <>
      <aside className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-800 bg-[#061A32] transition-[width] duration-300 lg:block ${isCollapsed ? "w-20" : "w-72"}`}>
        <SidebarContent isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} profile={profile} />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu overlay" className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />
          <aside className="relative h-full w-72 bg-[#061A32] shadow-2xl">
            <SidebarContent onClose={onClose} isMobile profile={profile} />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
