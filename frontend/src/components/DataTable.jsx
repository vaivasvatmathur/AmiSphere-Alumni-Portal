import { ExternalLink, Linkedin, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const DataTable = ({ alumni, onDelete }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Enrollment</th>
              <th className="px-4 py-3">Batch</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Company</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">LinkedIn</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {alumni.map((item) => (
              <tr key={item._id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-950">
                  <Link to={`/alumni/${item._id}`} className="inline-flex items-center gap-1.5 hover:text-brand-700">
                    {item.fullName}
                    <ExternalLink size={13} />
                  </Link>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.enrollmentNumber}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.batch}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.course}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.company || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.position || "-"}</td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">{item.email}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {item.linkedinUrl ? (
                    <a
                      href={item.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#0a66c2] hover:underline"
                    >
                      <Linkedin size={15} />
                      Open
                    </a>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="inline-flex gap-2">
                    <Link
                      to={`/alumni/${item._id}/edit`}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => onDelete(item._id)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
