import {useField} from "formik";
import FieldError from "../field-error";
import React from "react";
import useTrans from "../../../hooks/useTrans";

interface SelectProps {
  label: string
  containerClass?: string
  children: any
  multi?: boolean
}

export default function Select({label, containerClass, children, multi, ...props}: SelectProps & any) {
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  // console.log({field}, {meta}, {helpers}, {...props});
  return (<div className={`form-group ${containerClass || ''}`}>
    {label && <label htmlFor={`fld_${field.name}`}>{`${label} ${props?.required ? '*': ''}`}</label>}

    <select {...field} {...props} id={`fld_${field.name}`} multiple={multi} className={`form-control ${err && 'is-invalid'}`}>
      {children}
    </select>

    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
