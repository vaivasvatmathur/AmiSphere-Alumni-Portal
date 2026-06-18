const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  children,
  placeholder,
  helperText,
  error
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      {children ? (
        children
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-12 rounded-xl border px-4 text-sm text-slate-900 bg-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 ${
            error ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-200 hover:border-slate-300"
          }`}
        />
      )}
      {error ? (
        <p className="text-xs font-medium text-red-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormField;

