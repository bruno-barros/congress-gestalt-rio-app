import {useField} from "formik";
import FieldError from "../field-error";
import React from "react";
import useTrans from "../../../hooks/useTrans";
import InputMask from "react-input-mask";

interface MaskProps {
  label: string
  mask: string
  containerClass?: string
}

export default function Mask({label, mask, containerClass, ...props}: MaskProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  return (<div className={`form-group ${containerClass || ''}`}>
    {label && <label htmlFor={`fld_${field.name}`}>{`${label} ${props?.required ? '*': ''}`}</label>}

    <InputMask {...field} {...props}
               id={`fld_${field.name}`}
               className={`form-control ${err && 'is-invalid'}`}
               mask={mask}
               alwaysShowMask={false}
               maskChar=""
    />

    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
