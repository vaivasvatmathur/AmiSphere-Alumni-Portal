import {
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PlusCircle,
  UploadCloud,
  Users,
  X
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alumni", label: "Alumni Directory", icon: Users },
  { to: "/alumni/new", label: "Add Alumni", icon: PlusCircle },
  { to: "/upload", label: "Bulk Upload", icon: UploadCloud }
];

const SidebarContent = ({ isCollapsed = false, onClose, onToggleCollapse, isMobile = false }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-full flex-col">
      <div
        className={`flex h-16 items-center border-b border-slate-200 ${
          isCollapsed ? "gap-1 px-2" : "gap-3 px-5"
        }`}
      >
        <BrandLogo size="sm" showName={!isCollapsed || isMobile} />
        {!isMobile && (
          <button
            type="button"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`ml-auto rounded-lg text-slate-500 hover:bg-slate-100 hover:text-brand-900 ${
              isCollapsed ? "p-1.5" : "p-2"
            }`}
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
        <button
          type="button"
          aria-label="Close sidebar"
          className="ml-auto rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          onClick={onClose}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            title={isCollapsed && !isMobile ? label : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isCollapsed && !isMobile ? "justify-center gap-0" : "gap-3"
              } ${
                isActive
                  ? "border-l-4 border-gold-500 bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            <Icon size={18} />
            {(!isCollapsed || isMobile) && label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed && !isMobile ? "Logout" : undefined}
          className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 ${
            isCollapsed && !isMobile ? "justify-center gap-0" : "gap-3"
          }`}
        >
          <LogOut size={18} />
          {(!isCollapsed || isMobile) && "Logout"}
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, isCollapsed, onClose, onToggleCollapse }) => {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 bg-white transition-[width] duration-200 lg:block ${
          isCollapsed ? "w-20" : "w-72"
        }`}
      >
        <SidebarContent isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
      </aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-slate-950/35"
            onClick={onClose}
          />
          <aside className="relative h-full w-72 bg-white shadow-soft">
            <SidebarContent onClose={onClose} isMobile />
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
