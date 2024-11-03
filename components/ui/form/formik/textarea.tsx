import {useField} from "formik";
import FieldError from "../field-error";
import React from "react";
import useTrans from "../../../hooks/useTrans";

interface TextareaProps {
  label: string
  rows?: number
  containerClass?: string
}

export default function Textarea({label, containerClass, rows, ...props}: TextareaProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);

  const err = meta?.touched && meta?.error
  // console.log({field}, {meta});
  return (<div className={`form-group ${containerClass || ''} ${err && 'has-error'} ${props?.disabled ? 'text-muted' : ''}`}>
    {label && <label htmlFor={`fld_${field.name}`}>{label}</label>}
    <textarea {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'}`}  rows={rows || 3}/>
    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
