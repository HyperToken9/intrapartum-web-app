"use client";
import React, { useState, useEffect, useRef } from "react";
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
  const [localValue, setLocalValue] = useState(
    isInteger ? value.toString() : value.toFixed(1)
  );

  const localValueRef = useRef(localValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    localValueRef.current = localValue;
  }, [localValue]);

  // Sync state if controlled `value` changes from outside
  useEffect(() => {
    setLocalValue(isInteger ? value.toString() : value.toFixed(1));
  }, [value, isInteger]);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleClampAndSubmit = (val: number) => {
    let constrained = Math.min(Math.max(val, min), max);
    if (isInteger) constrained = Math.round(constrained);
    onChange(constrained);
    
    // We update local value immediately so UI matches the clamped version.
    // The useEffect will also run, but it's safe.
    setLocalValue(isInteger ? constrained.toString() : constrained.toFixed(1));
  };

  const handleBlur = () => {
    const parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      // Revert back to previous valid prop value
      setLocalValue(isInteger ? value.toString() : value.toFixed(1));
    } else {
      handleClampAndSubmit(parsed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const adjustValue = (dir: 1 | -1) => {
    const currentVal = parseFloat(localValueRef.current);
    const validVal = isNaN(currentVal) ? value : currentVal;
    handleClampAndSubmit(validVal + dir * step);
  };

  const startAdjusting = (dir: 1 | -1) => {
    adjustValue(dir);
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        adjustValue(dir);
      }, 75); // fast updates
    }, 400); // 400ms delay before repeating
  };

  const stopAdjusting = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="relative flex h-12 w-full items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all focus-within:border-[#7469B6]">
      {/* Decrement Button */}
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          startAdjusting(-1);
        }}
        onPointerUp={stopAdjusting}
        onPointerLeave={stopAdjusting}
        onPointerCancel={stopAdjusting}
        className="absolute left-1 flex h-8 w-8 items-center justify-center rounded bg-[#AD88C6]/40 text-[#1D1936] hover:bg-[#AD88C6]/60 active:scale-95 touch-none"
        type="button"
      >
        <Minus size={16} strokeWidth={3} />
      </button>

      {/* Input Display */}
      <input
        type="number"
        className="h-full w-full bg-transparent text-center font-sans text-2xl font-bold text-[#1D1936] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />

      {/* Increment Button */}
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          startAdjusting(1);
        }}
        onPointerUp={stopAdjusting}
        onPointerLeave={stopAdjusting}
        onPointerCancel={stopAdjusting}
        className="absolute right-1 flex h-8 w-8 items-center justify-center rounded bg-[#AD88C6]/40 text-[#1D1936] hover:bg-[#AD88C6]/60 active:scale-95 touch-none"
        type="button"
      >
        <Plus size={16} strokeWidth={3} />
      </button>
    </div>
  );
};
