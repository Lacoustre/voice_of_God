const FormField = ({ 
  label, 
  icon: Icon, 
  children, 
  required = false,
  className = ""
}) => {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
};

export default FormField;