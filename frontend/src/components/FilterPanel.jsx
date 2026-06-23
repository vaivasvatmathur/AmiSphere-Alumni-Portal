import { RotateCcw } from "lucide-react";

const FilterPanel = ({ filters, options, onChange, onClear }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-950">Filters</h2>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <RotateCcw size={14} />
          Reset
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
        <label className="space-y-1.5">
          <span className="text-xs font-medium text-slate-500">Batch</span>
          <select
            value={filters.batch}
            onChange={(event) => update("batch", event.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All batches</option>
            {options.batches?.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-slate-500">Programme</span>
          <select
            value={filters.course}
            onChange={(event) => update("course", event.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All programmes</option>
            {(options.courses?.length ? options.courses : ["B.Tech IT", "B.Tech CSBS", "B.Tech CSSS"]).map(
              (course) => (
                <option key={course} value={course}>
                  {course}
                </option>
              )
            )}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-slate-500">Skill</span>
          <select
            value={filters.skills}
            onChange={(event) => update("skills", event.target.value)}
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">All skills</option>
            {options.skills?.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-slate-500">Company</span>
          <input
            value={filters.company}
            onChange={(event) => update("company", event.target.value)}
            placeholder="Company"
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-slate-500">Position</span>
          <input
            value={filters.position}
            onChange={(event) => update("position", event.target.value)}
            placeholder="Job role"
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          />
        </label>

        <label className="space-y-1.5">
          <span className="text-xs font-medium text-slate-500">Profession</span>
          <input
            value={filters.profession}
            onChange={(event) => update("profession", event.target.value)}
            placeholder="Profession"
            className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"
          />
        </label>
      </div>
    </div>
  );
};

export default FilterPanel;
