const FormField = ({ label, name, value, onChange, type = "text", required = false, children, placeholder }) => {
  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      {children || (
        <input
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 shadow-sm"
        />
      )}
    </label>
  );
};

export default FormField;
