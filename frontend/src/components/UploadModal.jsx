import { CheckCircle2, X, XCircle } from "lucide-react";

const UploadModal = ({ result, onClose }) => {
  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="max-h-[88vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <div>
              <h2 className="font-semibold text-slate-950">Upload processed</h2>
              <p className="text-sm text-slate-500">
                {result.successCount} added · {result.failureCount} skipped · {result.totalRows} rows
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close upload result"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-5">
          {result.failures?.length ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-950">Skipped rows</h3>
              {result.failures.map((failure) => (
                <div key={`${failure.row}-${failure.enrollmentNumber}`} className="rounded-lg bg-red-50 p-3">
                  <p className="flex items-center gap-2 text-sm font-medium text-red-700">
                    <XCircle size={16} />
                    Row {failure.row} · {failure.enrollmentNumber}
                  </p>
                  <p className="mt-1 text-sm text-red-600">{failure.reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-600">All rows were imported successfully.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
