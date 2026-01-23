import React from "react";

interface FormLabelProps {
  label: string;
  unit?: string;
  info: string[];
}

export const FormLabel: React.FC<FormLabelProps> = ({ label, unit, info }) => {
  return (
    <div className="mb-2 mt-4">
      <div className="flex items-baseline gap-2">
        <span className="font-sans text-lg font-bold uppercase text-[#1D1936]">
          {label}
        </span>
        {unit && (
          <span className="font-sans text-sm font-semibold text-gray-500">
            ({unit})
          </span>
        )}
      </div>
      <div className="mt-1 flex flex-col gap-1">
        {info.map((text, idx) => (
          <p
            key={idx}
            className="text-xs font-medium text-gray-600 leading-tight"
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
};
