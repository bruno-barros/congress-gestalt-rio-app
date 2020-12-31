import {useField} from "formik";
import FieldError from "../field-error";
import React, {useEffect, useState} from "react";
import useTrans from "../../../hooks/useTrans";
import zxcvbn from "zxcvbn";
import scope from "ast-types/lib/scope";

interface PasswordProps {
  label: string
  minStrength: number;
  thresholdLength: number;
  containerClass?: string
  submitted?: any;

  passwordStrength(strength: number, isStrong: boolean, reset?: () => void): void;
}

export default function Password({label, containerClass, minStrength, thresholdLength, submitted, passwordStrength, ...props}: PasswordProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);

  minStrength = typeof minStrength === 'number'
    ? Math.max(Math.min(minStrength, 4), 0) : 3;

  thresholdLength = typeof thresholdLength === 'number'
    ? Math.max(thresholdLength, 7) : 7;

  const [strength, setStrength] = useState(0);

  const err = meta?.touched && meta?.error

  useEffect(() => {
    handleChange(field.value)
  }, [field.value])

  useEffect(() => {
    if (props?.submitted) reset()
  }, [props?.submitted])

  function reset() {
    setStrength(0)
    helpers.setValue('')
    helpers.setTouched(false)
    helpers.setError({})
  }

  function handleChange(value: string) {
    let score = zxcvbn(value).score;
    if(value.length < thresholdLength || score < 3){
      helpers.setError('validacao.senha-fraca')
    }
    setStrength(score)
    props.passwordStrength && props.passwordStrength(score, score >= minStrength, reset)
  }


  // console.log({field}, {meta});
  return (<div className={`form-group ${containerClass || ''} ${err && 'has-error'}`}>
    {label && <label htmlFor={`fld_${field.name}`} className="d-flex align-items-center">{label}<div className="bb-strengthMeter flex-grow-1 ml-2">
      <div className="bb-strengthMeterFill" data-strength={strength}/>
    </div></label>}

    <input {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'}`}/>

    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
