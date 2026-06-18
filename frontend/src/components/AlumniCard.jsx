import {
  Briefcase,
  Building2,
  GraduationCap,
  ExternalLink,
  Mail,
  Pencil,
  Phone,
  Trash2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const initials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const InfoLine = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-2 text-sm text-slate-600">
    <Icon size={15} className="shrink-0 text-slate-400" />
    <span className="truncate">{children || "Not available"}</span>
  </p>
);

const AlumniCard = ({ alumni, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        {alumni.photo ? (
          <img
            src={alumni.photo}
            alt={alumni.fullName}
            className="h-16 w-16 rounded-xl object-cover border border-slate-100"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-100 text-lg font-semibold text-slate-500">
            {initials(alumni.fullName)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          {isAdmin ? (
            <Link to={`/admin/alumni/${alumni.id}`} className="font-semibold text-slate-950 hover:text-brand-700">
              {alumni.fullName}
            </Link>
          ) : (
            <span className="font-semibold text-slate-950">{alumni.fullName}</span>
          )}
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
            {alumni.enrollmentNumber}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-2">
        <InfoLine icon={GraduationCap}>
          {alumni.batch} · {alumni.course}
        </InfoLine>
        <InfoLine icon={Phone}>{alumni.phone}</InfoLine>
        <InfoLine icon={Mail}>{alumni.email}</InfoLine>
        <InfoLine icon={Building2}>{alumni.company}</InfoLine>
        <InfoLine icon={Briefcase}>{alumni.position}</InfoLine>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {alumni.skills?.length ? (
          alumni.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {skill}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">No skills listed</span>
        )}
      </div>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
        {alumni.linkedinUrl && (
          <a
            href={alumni.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#061A32] hover:bg-opacity-95 px-3 py-2 text-xs font-semibold text-white transition-all shadow-sm"
          >
            <ExternalLink size={13} />
            LinkedIn
          </a>
        )}
        {isAdmin && (
          <>
            <Link
              to={`/admin/alumni/${alumni.id}/edit`}
              className="ml-auto rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
              title="Edit alumni"
            >
              <Pencil size={16} />
            </Link>
            <button
              type="button"
              onClick={() => onDelete(alumni.id)}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
              title="Delete alumni"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default AlumniCard;
