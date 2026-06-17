import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import PageHeader from "../components/PageHeader.jsx";
import UploadModal from "../components/UploadModal.jsx";

const requiredColumns = [
  "fullName",
  "enrollmentNumber",
  "batch",
  "course",
  "phone",
  "email",
  "company",
  "position",
  "skills",
  "linkedinUrl",
  "photo"
];

const BulkUpload = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (event) => {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please choose a CSV or XLSX file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    try {
      const { data } = await api.post("/upload/alumni", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setResult(data);
      setFile(null);
      event.target.reset();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Bulk Upload"
        description="Import alumni records from CSV or Excel files."
        actions={
          <Link
            to="/alumni"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Directory
          </Link>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
        <form onSubmit={handleUpload} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-start gap-4">
            <span className="rounded-lg bg-brand-50 p-3 text-brand-700">
              <FileSpreadsheet size={24} />
            </span>
            <div>
              <h2 className="font-semibold text-slate-950">Upload alumni file</h2>
              <p className="mt-1 text-sm text-slate-500">Supported formats: .csv and .xlsx</p>
            </div>
          </div>

          {error && <p className="mt-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center hover:border-brand-300 hover:bg-brand-50">
            <UploadCloud className="text-brand-600" size={34} />
            <span className="mt-3 text-sm font-semibold text-slate-950">
              {file ? file.name : "Choose CSV or XLSX file"}
            </span>
            <span className="mt-1 text-xs text-slate-500">Maximum recommended file size: 5 MB</span>
            <input
              type="file"
              accept=".csv,.xlsx"
              className="sr-only"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
          </label>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <UploadCloud size={17} />
              {uploading ? "Uploading..." : "Upload Records"}
            </button>
          </div>
        </form>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="font-semibold text-slate-950">Example columns</h2>
          <p className="mt-1 text-sm text-slate-500">
            Column names are flexible, but this format keeps imports predictable.
          </p>
          <div className="mt-4 grid gap-2">
            {requiredColumns.map((column) => (
              <code key={column} className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-700">
                {column}
              </code>
            ))}
          </div>
        </aside>
      </div>

      <UploadModal result={result} onClose={() => setResult(null)} />
    </div>
  );
};

export default BulkUpload;
