import {
  Briefcase,
  Building2,
  GraduationCap,
  Linkedin,
  Mail,
  Pencil,
  Phone,
  Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";
import PageHeader from "../components/PageHeader.jsx";

const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {Icon && <Icon size={14} />}
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-medium text-slate-900">{value || "Not available"}</p>
  </div>
);

const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const AlumniDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/alumni/${id}`)
      .then(({ data }) => setAlumni(data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this alumni record?")) return;
    await api.delete(`/alumni/${id}`);
    navigate("/alumni");
  };

  if (loading) {
    return <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-500 shadow-soft">Loading...</div>;
  }

  if (!alumni) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-soft">
        Alumni record not found.
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Alumni Details"
        description="Complete record maintained by the department."
        actions={
          <>
            <Link
              to={`/alumni/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Pencil size={17} />
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              <Trash2 size={17} />
              Delete
            </button>
          </>
        }
      />

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {alumni.photo ? (
            <img src={alumni.photo} alt={alumni.fullName} className="h-24 w-24 rounded-lg object-cover" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100 text-2xl font-semibold text-slate-500">
              {initials(alumni.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-2xl font-semibold text-slate-950">{alumni.fullName}</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{alumni.enrollmentNumber}</p>
            {alumni.linkedinUrl && (
              <a
                href={alumni.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#0a66c2] px-3 py-2 text-sm font-semibold text-white hover:bg-[#084f96]"
              >
                <Linkedin size={16} />
                LinkedIn Profile
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <DetailItem label="Batch" value={alumni.batch} icon={GraduationCap} />
        <DetailItem label="Course" value={alumni.course} icon={GraduationCap} />
        <DetailItem label="Phone" value={alumni.phone} icon={Phone} />
        <DetailItem label="Email" value={alumni.email} icon={Mail} />
        <DetailItem label="Company" value={alumni.company} icon={Building2} />
        <DetailItem label="Position" value={alumni.position} icon={Briefcase} />
      </section>

      <section className="mt-5 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="text-sm font-semibold text-slate-950">Skills</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {alumni.skills?.length ? (
            alumni.skills.map((skill) => (
              <span key={skill} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-500">No skills listed.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default AlumniDetails;
