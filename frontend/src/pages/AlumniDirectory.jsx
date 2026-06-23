import { Download, Grid2X2, List, PlusCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import AlumniCard from "../components/AlumniCard.jsx";
import DataTable from "../components/DataTable.jsx";
import FilterPanel from "../components/FilterPanel.jsx";
import PageHeader from "../components/PageHeader.jsx";
import Pagination from "../components/Pagination.jsx";
import SearchBar from "../components/SearchBar.jsx";

const emptyFilters = {
  batch: "",
  course: "",
  skills: "",
  company: "",
  position: "",
  profession: ""
};

const toCsvValue = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const AlumniDirectory = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [alumni, setAlumni] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(emptyFilters);
  const [options, setOptions] = useState({});
  const [view, setView] = useState("cards");
  const [loading, setLoading] = useState(true);

  const params = useMemo(
    () => ({
      page: meta.page,
      limit: view === "table" ? 15 : 12,
      search: search || undefined,
      ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value))
    }),
    [filters, meta.page, search, view]
  );

  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/alumni", { params });
      setAlumni(data.items);
      setMeta(data.meta);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    api.get("/alumni/filters").then(({ data }) => setOptions(data));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(fetchAlumni, 250);
    return () => clearTimeout(timeout);
  }, [fetchAlumni]);

  useEffect(() => {
    const handleUploadRefresh = () => {
      fetchAlumni();
    };

    window.addEventListener("alumniUploadCompleted", handleUploadRefresh);
    return () => window.removeEventListener("alumniUploadCompleted", handleUploadRefresh);
  }, [fetchAlumni]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this alumni record?")) return;
    await api.delete(`/alumni/${id}`);
    fetchAlumni();
  };

  const handleFilters = (nextFilters) => {
    setFilters(nextFilters);
    setMeta((current) => ({ ...current, page: 1 }));
  };

  const handleSearch = (value) => {
    setSearch(value);
    setMeta((current) => ({ ...current, page: 1 }));
  };

  const exportCsv = async () => {
    const { data } = await api.get("/alumni", {
      params: { ...params, page: 1, limit: 10000 }
    });
    const headers = [
      "Full Name",
      "Enrollment Number",
      "Batch",
      "Programme",
      "Phone",
      "Email",
      "Company",
      "Position",
      "Skills",
      "LinkedIn URL",
      "Photo"
    ];
    const rows = data.items.map((item) => [
      item.fullName,
      item.enrollmentNumber,
      item.batch,
      item.course,
      item.phone,
      item.email,
      item.company,
      item.position,
      item.skills?.join("; "),
      item.linkedinUrl,
      item.photo
    ]);
    const csv = [headers, ...rows].map((row) => row.map(toCsvValue).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "alumni-export.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div>
      <PageHeader
        title={isAdmin ? "Alumni Directory" : "Alumni Network"}
        description={
          isAdmin
            ? "Search, filter, update, export, and maintain alumni records."
            : "Search, filter, and connect with fellow alumni."
        }
        actions={
          <>
            {isAdmin && (
              <button
                type="button"
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download size={17} />
                Export CSV
              </button>
            )}
            {isAdmin && (
              <Link
                to="/admin/alumni/new"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                <PlusCircle size={17} />
                Add Alumni
              </Link>
            )}
          </>
        }
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Search by name, enrollment number, company, skills, or email"
          />
          <div className="flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setView("cards")}
              className={`rounded-lg p-2 ${view === "cards" ? "bg-brand-50 text-brand-700" : "text-slate-500"}`}
              title="Card view"
            >
              <Grid2X2 size={18} />
            </button>
            <button
              type="button"
              onClick={() => setView("table")}
              className={`rounded-lg p-2 ${view === "table" ? "bg-brand-50 text-brand-700" : "text-slate-500"}`}
              title="Table view"
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <FilterPanel
          filters={filters}
          options={options}
          onChange={handleFilters}
          onClear={() => handleFilters(emptyFilters)}
        />

        {loading ? (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-soft">
            Loading alumni records...
          </div>
        ) : alumni.length ? (
          view === "cards" ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {alumni.map((item) => (
                <AlumniCard key={item.id} alumni={item} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <DataTable alumni={alumni} onDelete={handleDelete} />
          )
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-soft">
            No alumni matched the current search or filters.
          </div>
        )}

        <Pagination meta={meta} onPageChange={(page) => setMeta((current) => ({ ...current, page }))} />
      </div>
    </div>
  );
};

export default AlumniDirectory;
