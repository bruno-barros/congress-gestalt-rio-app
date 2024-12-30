import {useField} from "formik";
import FieldError from "../field-error";
import React, {useEffect, useRef} from "react";
import useBuscaCEP, {CEP} from "../../../hooks/useBuscaCEP";


interface TextProps {
  label: string
  containerClass?: string
  inputClass?: string
  floatLabel?: boolean
  description?: string
  cepCallback?: (data: CEP | null) => void
}

export default function Text({label, containerClass, inputClass, cepCallback, floatLabel: fl, description, ...props}: TextProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  const floatLabel = fl ? 'float-label' : ''
  const cep = useRef(field.value)

  useEffect(() => {

    if (field.value !== cep.current && typeof cepCallback !== 'undefined') {
      cep.current = field.value
      if (!field.value) return null;

      const resp = useBuscaCEP(field.value)
      resp.then(resp => {
        cepCallback(resp || null)
      }, err => {/** silence */})

    }

  }, [field.value])

  // console.log({field}, {meta});
  return (<div className={`form-group ${floatLabel} ${containerClass || ''} ${err && 'has-error'} ${props?.disabled ? 'text-muted' : ''}`}>
    {(label && !floatLabel) && <label htmlFor={`fld_${field.name}`}>{label}{` ${props?.required ? '*': ''}`}</label>}

    <input {...field} {...props} id={`fld_${field.name}`} className={`form-control ${inputClass || ''} ${err && 'is-invalid'} ${field?.value?.length ? 'filled' : ''}`}/>

    {(label && floatLabel) && <label htmlFor={`fld_${field.name}`}>{label}</label>}

    {description && <small className="d-block text-muted">{description}</small>}

    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
