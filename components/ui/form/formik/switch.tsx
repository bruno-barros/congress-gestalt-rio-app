import {useField} from "formik";
import FieldError from "../field-error";
import React, {useEffect, useRef} from "react";
import  Form  from "react-bootstrap/cjs/Form";


interface SwitchProps {
  label: string
  containerClass?: string
  disabled?: boolean
  checked?: boolean
}

export default function Switch({label, containerClass, disabled, checked, ...props}: SwitchProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error


  // console.log({field}, {meta});
  return (<div className={`form-group  ${containerClass || ''} ${err && 'has-error'}`}>
    <Form.Check
      disabled={!!disabled}
      type="switch"
      label={label}
      id={`fld_${field.name}`}
      checked={!!field.value}
      onChange={(v)=> helpers.setValue(!field.value)}
    />

    {/*<input {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'} ${field?.value?.length ? 'filled' : ''}`}/>*/}


    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
