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
                {result.inserted} inserted · {result.duplicates} duplicates · {result.failed} failed · {result.totalRows} rows
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
          {result.errors?.length ? (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-950">Issues found</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Row</th>
                      <th className="px-4 py-3 font-semibold">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((errorRow) => (
                      <tr key={errorRow.row} className="border-t border-slate-200 last:border-b">
                        <td className="px-4 py-3 font-medium text-slate-900">{errorRow.row}</td>
                        <td className="px-4 py-3 text-slate-700">{errorRow.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700">
              All rows were imported successfully.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
