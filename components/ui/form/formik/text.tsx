import {useField} from "formik";
import FieldError from "../field-error";
import React from "react";
import useTrans from "../../../hooks/useTrans";

interface TextProps {
  label: string
  containerClass?: string
}

export default function Text({label, containerClass, ...props}: TextProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);

  const err = meta?.touched && meta?.error
  // console.log({field}, {meta});
  return (<div className={`form-group ${containerClass || ''} ${err && 'has-error'}`}>
    {label && <label htmlFor={`fld_${field.name}`}>{label}</label>}

    <input {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'}`}/>

    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
