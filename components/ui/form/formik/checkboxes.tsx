import { useField } from "formik";
import FieldError from "../field-error";
import React from "react";
import useTrans from "../../../hooks/useTrans";

interface CheckProps {
  label: string;
  containerClass?: string;
  options: {value: string, label: string}[];
}

export default function Checkboxes({
  label,
  containerClass,
  options,
  ...props
}: CheckProps & any) {
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error;
  // console.log({field}, {meta}, {helpers}, {...props});
  return (
    <div className={`form-group ${containerClass || ""} ${props?.disabled ? 'text-muted' : ''}`}>
      {label && (
        <label htmlFor={`fld_${field.name}`}>{`${label} ${
          props?.required ? "*" : ""
        }`}</label>
      )}

      {options.map((opt, idx) => {
        return (
          <div key={idx} className="form-check">
            <input
              type="checkbox"
              {...field}
              {...props}
              id={`fld_${field.name}_${idx}`}
              value={opt.value}
              checked={field.value.includes(opt.value)}
              className={`form-check-input ${err && "is-invalid"}`}
            />
            <label
              htmlFor={`fld_${field.name}_${idx}`}
              className="form-check-label"
            >
              {opt.label}
            </label>
          </div>
        )})}


      <FieldError message={err} fieldId={`fld_${field.name}`} />
    </div>
  );
}
