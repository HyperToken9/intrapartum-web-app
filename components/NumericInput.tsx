"use client";
import React from "react";
import { Minus, Plus } from "lucide-react";

interface NumericInputProps {
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  isInteger?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  min,
  max,
  isInteger = true,
}) => {
  const step = isInteger ? 1 : 0.1;

  const handleClamp = (val: number) => {
    let constrained = Math.min(Math.max(val, min), max);
    if (isInteger) constrained = Math.round(constrained);
    onChange(constrained);
  };

  return (
    <div className="relative flex h-12 w-full items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all focus-within:border-[#7469B6]">
      {/* Decrement Button */}
      <button
        onClick={() => handleClamp(value - step)}
        className="absolute left-1 flex h-8 w-8 items-center justify-center rounded bg-[#AD88C6]/40 text-[#1D1936] hover:bg-[#AD88C6]/60 active:scale-95"
        type="button"
      >
        <Minus size={16} strokeWidth={3} />
      </button>

      {/* Input Display */}
      <input
        type="number"
        className="h-full w-full bg-transparent text-center font-sans text-2xl font-bold text-[#1D1936] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={isInteger ? value.toString() : value.toFixed(1)}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          if (!isNaN(val)) handleClamp(val);
        }}
      />

      {/* Increment Button */}
      <button
        onClick={() => handleClamp(value + step)}
        className="absolute right-1 flex h-8 w-8 items-center justify-center rounded bg-[#AD88C6]/40 text-[#1D1936] hover:bg-[#AD88C6]/60 active:scale-95"
        type="button"
      >
        <Plus size={16} strokeWidth={3} />
      </button>
    </div>
  );
};
