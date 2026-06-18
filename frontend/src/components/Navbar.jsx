import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { UNIVERSITY_HEADER } from "../constants/branding.js";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = ({ onMenuClick, profile }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const isAdmin = (profile?.role || user?.role) === "ADMIN";
  const roleLabel = isAdmin ? "Admin" : "Alumni";

  const displayName = profile?.alumni?.fullName || profile?.name || user?.fullName || user?.name || "Guest";
  const avatarUrl = profile?.alumni?.photo;

  const initials = (name = "") =>
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const adminNotifications = [
    {
      id: 1,
      icon: "👤",
      title: "New Alumni Registration",
      message: "Priya Sharma completed profile registration.",
      timestamp: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      icon: "📝",
      title: "Profile Update",
      message: "Rahul Verma updated professional information.",
      timestamp: "4 hours ago",
      unread: true
    },
    {
      id: 3,
      icon: "📤",
      title: "Bulk Upload Completed",
      message: "20 alumni records imported successfully.",
      timestamp: "1 day ago",
      unread: true
    }
  ];

  const alumniNotifications = [
    {
      id: 1,
      icon: "📌",
      title: "Profile Reminder",
      message: "Complete your profile to improve visibility.",
      timestamp: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      icon: "🤝",
      title: "Networking Opportunity",
      message: "5 alumni from your batch joined recently.",
      timestamp: "5 hours ago",
      unread: true
    },
    {
      id: 3,
      icon: "📅",
      title: "Event Update",
      message: "Alumni Meet 2026 registrations are now open.",
      timestamp: "1 day ago",
      unread: false
    }
  ];

  const notifications = isAdmin ? adminNotifications : alumniNotifications;
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Hamburger & Department Name */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open sidebar"
            className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
            onClick={onMenuClick}
          >
            <Menu size={20} />
          </button>
          
          <div className="min-w-0">
            <h2 className="truncate text-[11px] font-bold text-[#061A32] tracking-wider uppercase opacity-80">
              Amity University Noida
            </h2>
            <p className="truncate text-xs font-medium text-slate-500 max-w-[200px] sm:max-w-[320px] md:max-w-none">
              {UNIVERSITY_HEADER}
            </p>
          </div>
        </div>

        {/* Right Side: Notifications, Avatar, User Details */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notification Bell Container */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                showNotifications ? "bg-slate-100 text-[#061A32]" : "text-slate-600 hover:bg-slate-50 hover:text-[#061A32]"
              }`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)} 
                />
                <div className="absolute right-0 top-10 z-50 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 transition-all">
                  {/* Dropdown Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <span className="text-sm font-bold text-[#061A32]">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
                        {unreadCount} Unread
                      </span>
                    )}
                  </div>

                  {/* Dropdown Scrollable List */}
                  <div className="max-h-80 overflow-y-auto py-1 divide-y divide-slate-100">
                    {notifications.map((item) => (
                      <div 
                        key={item.id} 
                        className={`flex gap-3 p-4 transition-colors hover:bg-slate-50 ${item.unread ? "bg-slate-50/50" : ""}`}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-base shadow-sm">
                          {item.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-800 leading-tight">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                            {item.message}
                          </p>
                          <p className="mt-1.5 text-[10px] font-medium text-slate-400">
                            {item.timestamp}
                          </p>
                        </div>
                        {item.unread && (
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="border-t border-slate-100 px-2 py-2">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="flex w-full items-center justify-center rounded-xl py-2.5 text-xs font-semibold text-brand-600 hover:bg-slate-50 transition-colors"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          {/* User Profile Summary */}
          <div className="flex items-center gap-3">
            {/* Profile Avatar */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="h-10 w-10 rounded-xl object-cover border border-slate-200"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#061A32] text-xs font-bold text-white shadow-inner">
                {initials(displayName)}
              </div>
            )}

            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                {displayName}
              </p>
              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mt-1 border ${
                isAdmin 
                  ? "bg-red-50 text-red-700 border-red-200/50" 
                  : "bg-gold-50 text-gold-600 border-gold-200/50"
              }`}>
                {roleLabel}
              </span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Navbar;

