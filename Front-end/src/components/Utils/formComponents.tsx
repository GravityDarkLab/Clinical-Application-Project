import React, { FC, ChangeEvent } from "react";

/**
 * @typedef {object} OptionType
 * @property {string} label - Display text for the option.
 * @property {string} value - Actual value for the option.
 * @property {boolean} [disabled] - Optional property to disable the option.
 */
type OptionType = {
  label: string;
  value: string;
  disabled?: boolean;
};

/**
 * @typedef {object} FormFieldProps
 * @property {string} label - Label for the form field.
 * @property {string} name - Name attribute for the form field.
 * @property {"text" | "select" | "file" | "email" | "tel" | "date" | "checkbox"} type - Defines the type of the form field.
 * @property {boolean} [required] - Optional property to set if the field is required.
 * @property {OptionType[]} [options] - Optional array of options for select field.
 * @property {(e: ChangeEvent<HTMLInputElement>) => void} [handler] - Optional event handler for the input field change event.
 */
type FormFieldProps = {
  label: string;
  name: string;
  type: "text" | "select" | "file" | "email" | "tel" | "date" | "checkbox";
  required?: boolean;
  options?: OptionType[];
  handler?: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * FormField component. A reusable component for different types of form fields.
 *
 * @component
 * @param {FormFieldProps} props - Props that get passed to the FormField component.
 * @returns {FC} - Returns FormField as a functional component.
 */
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
