const StatCard = ({ label, value, detail, icon: Icon }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
          {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
        </div>
        {Icon && (
          <span className="rounded-lg bg-brand-50 p-3 text-brand-700">
            <Icon size={22} />
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
