import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import api from "../api/axios.js";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setProfile(data.user || null);
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    // Listen for profile update events to refresh the header/sidebar in real-time
    window.addEventListener("profileUpdated", fetchProfile);
    return () => {
      window.removeEventListener("profileUpdated", fetchProfile);
    };
  }, [fetchProfile]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed((current) => !current)}
        profile={profile}
      />
      <div className={`flex flex-col flex-1 transition-[padding] duration-300 ${isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"}`}>
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} profile={profile} />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ refreshProfile: fetchProfile }} />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;

