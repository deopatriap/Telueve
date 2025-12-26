import React from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  required?: boolean;
  name?: string;
  id?: string;
}

export default function Input({
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  className = "",
  label,
  error,
  required = false,
  name,
  id,
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-xs uppercase tracking-widest text-nier-muted mb-2"
        >
          {label}
          {required && <span className="text-red-700 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-0 py-3 text-nier-dark
          bg-transparent border-b-2 border-nier-border
          focus:outline-none focus:border-nier-dark
          transition-all duration-300 ease-out
          placeholder:text-nier-muted placeholder:italic placeholder:transition-opacity focus:placeholder:opacity-50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-700 focus:border-red-700" : ""}
          ${className}
        `}
      />
      {error && (
        <p className="mt-2 text-xs text-red-700 italic">
          {error}
        </p>
      )}
    </div>
  );
}
