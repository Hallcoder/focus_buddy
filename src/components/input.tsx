import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
interface InputProps {
  label?: string;
  type?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="mb-2 text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <input
          type={showPassword ? 'text' : type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full pr-10"
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute inset-y-0 right-0 px-3 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
