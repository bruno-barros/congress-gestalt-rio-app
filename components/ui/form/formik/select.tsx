import {useField} from "formik";
import FieldError from "../field-error";
import React from "react";
import useTrans from "../../../hooks/useTrans";

interface SelectProps {
  label: string
  containerClass?: string
  children: any
}

export default function Select({label, containerClass, children, ...props}: SelectProps & any) {
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  // console.log({field}, {meta});
  return (<div className={`form-group ${containerClass || ''}`}>
    {label && <label htmlFor={`fld_${field.name}`}>{label}</label>}

    <select {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'}`}>
      {children}
    </select>

    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
