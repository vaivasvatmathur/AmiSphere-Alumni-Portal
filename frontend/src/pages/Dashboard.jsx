import { Building2, GraduationCap, UploadCloud, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import DataTable from "../components/DataTable.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { PORTAL_NAME, UNIVERSITY_HEADER } from "../constants/branding.js";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentAlumni, setRecentAlumni] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      const [statsResponse, alumniResponse] = await Promise.all([
        api.get("/alumni/stats"),
        api.get("/alumni", { params: { limit: 6 } })
      ]);
      setStats(statsResponse.data);
      setRecentAlumni(alumniResponse.data.items);
      setLoading(false);
    };

    fetchDashboard().catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        title={`${PORTAL_NAME} Dashboard`}
        description={UNIVERSITY_HEADER}
        actions={
          <>
            <Link
              to="/alumni/new"
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Add Alumni
            </Link>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <UploadCloud size={17} />
              Bulk Upload
            </Link>
          </>
        }
      />

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
          label="Courses"
          value={loading ? "..." : stats?.courseBreakdown?.length || 0}
          detail="Active course groups"
          icon={GraduationCap}
        />
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Recently Added</h2>
          <Link to="/alumni" className="text-sm font-semibold text-brand-700 hover:text-brand-600">
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
