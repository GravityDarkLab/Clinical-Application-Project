import React, { FC, ChangeEvent, FormEvent } from "react";
import Banner from "../elements/Banner";
import SubmissionStatus from "../elements/SubmissonStatus";

type OptionType = {
  label: string;
  value: string;
  disabled?: boolean;
};

type FormFieldProps = {
  label: string;
  name: string;
  type: "text" | "select" | "file" | "email" | "tel" | "date" | "checkbox";
  required?: boolean;
  options?: OptionType[];
  handler?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const FormField: FC<FormFieldProps> = ({
  label,
  name,
  type,
  options,
  required,
  handler,
}) => (
  <div className="flex flex-col mb-4">
    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor={name}>
      {label}
    </label>
    {type === "select" ? (
      <select
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        name={name}
        id={name}
        required={required}
        defaultValue=""
      >
        {options?.map((option, i) => (
          <option key={i} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
    ) : type === "file" ? (
      <input
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        type={type}
        id={name}
        accept="image/*"
        onChange={handler}
      />
    ) : (
      <input
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        type={type}
        name={name}
        id={name}
        required={required}
      />
    )}
  </div>
);
