import { Building2, GraduationCap, UploadCloud, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import DataTable from "../components/DataTable.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { PORTAL_NAME, UNIVERSITY_HEADER } from "../constants/branding.js";

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning";
  if (hour >= 12 && hour < 17) return "Good Afternoon";
  if (hour >= 17 && hour < 21) return "Good Evening";
  return "Good Night";
};

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [stats, setStats] = useState(null);
  const [recentAlumni, setRecentAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [statsResponse, alumniResponse] = await Promise.all([
        api.get("/alumni/stats"),
        api.get("/alumni", { params: { limit: 6 } })
      ]);
      setStats(statsResponse.data);
      setRecentAlumni(alumniResponse.data.items);
    } catch(err){

console.error(err);
setStats({
total:0,
batchCount:0,
companyCount:0,
courseBreakdown:[]
});
setRecentAlumni([]);
}
finally{
setLoading(false);

}
  }, []);

  useEffect(() => {
    fetchDashboard().catch(() => setLoading(false));

    const handleUploadRefresh = () => {
      fetchDashboard();
    };

    window.addEventListener("alumniUploadCompleted", handleUploadRefresh);
    return () => window.removeEventListener("alumniUploadCompleted", handleUploadRefresh);
  }, [fetchDashboard]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${PORTAL_NAME} Dashboard`}
        description={UNIVERSITY_HEADER}
        actions={
          isAdmin ? (
            <>
              <Link
                to="/admin/alumni/new"
                className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Add Alumni
              </Link>
              <Link
                to="/admin/upload"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <UploadCloud size={17} />
                Bulk Upload
              </Link>
            </>
          ) : null
        }
      />

      {/* Admin Hero Greeting Card */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-[#061A32] p-6 sm:p-8 shadow-md text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gold-400 opacity-10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {getTimeBasedGreeting()}, Admin 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Welcome back. You currently manage <span className="text-[#f5c542] font-semibold">{loading ? "..." : stats?.total || 0}</span> alumni records across <span className="text-[#f5c542] font-semibold">3</span> active programs.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-800 pt-4 md:border-t-0 md:pt-0 md:pl-6 md:border-l md:border-slate-800 shrink-0">
            <div className="text-center px-1 sm:px-4">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Alumni</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">
                {loading ? "..." : stats?.total || 0}
              </p>
            </div>
            <div className="text-center px-1 sm:px-4 border-l border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">New Registrations</p>
              <p className="text-xl sm:text-2xl font-black text-[#f5c542] mt-1">
                {loading ? "..." : 12}
              </p>
            </div>
            <div className="text-center px-1 sm:px-4 border-l border-slate-800">
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pending Updates</p>
              <p className="text-xl sm:text-2xl font-black text-[#f5c542] mt-1">
                {loading ? "..." : 5}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Alumni"
          value={loading ? "..." : stats?.total || 0}
          detail="Records in database"
          icon={Users}
        />
        <StatCard
          label="Batches"
          value={loading ? "..." : stats?.batchCount || 0}
          detail="Distinct graduating years"
          icon={GraduationCap}
        />
        <StatCard
          label="Companies"
          value={loading ? "..." : stats?.companyCount || 0}
          detail="Distinct current companies"
          icon={Building2}
        />
        <StatCard
          label="Programmes"
          value={loading ? "..." : stats?.courseBreakdown?.length || 0}
          detail="Active programme groups"
          icon={GraduationCap}
        />
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Recently Added</h2>
          <Link to={isAdmin ? "/admin/alumni" : "/directory"} className="text-sm font-semibold text-brand-700 hover:text-brand-600">
            View all
          </Link>
        </div>
        {recentAlumni.length ? (
          <DataTable alumni={recentAlumni} onDelete={() => {}} />
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-soft">
            No alumni records yet.
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
