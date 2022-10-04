import React from "react";

function Input({
  label,
  type = "text",
  name,
  id,
  onChange,
  placeholder = "Input...",
  value,
  error,
  defaultValue,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="email" className="text-sm font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={defaultValue}
        value={value}
        className="h-14 border-2 border-gray rounded-md p-2 focus:border-primary focus:outline-none"
      />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
