import {useField} from "formik";
import FieldError from "../field-error";
import React, {useCallback, useEffect, useRef} from "react";
import axios from 'axios'
import {useDebounce} from "../../../hooks/useDebounce";

interface CEPapi {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: number
  gia: number
  ddd: number
  siafi: string
}

interface TextProps {
  label: string
  containerClass?: string
  cepCallback?: (data: CEPapi | { error: boolean }) => void
}

export default function Text({label, containerClass, cepCallback, ...props}: TextProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error

  const cep = useRef(null)

  useEffect(() => {
    console.log(field.value);
    if (field.value !== cep.current && typeof cepCallback !== 'undefined') {
      cep.current = field.value
      if (!cepCallback || !field.value) return null;
      let nums = field.value.replace(/\D+/g, '')
      if (nums.length !== 8) return null
      console.log({nums});
      axios.get(`https://viacep.com.br/ws/${nums}/json/`)
        .then(resp => {
          if (!resp.data?.error) {
            cepCallback(resp.data)
          }
        }, err => {
          axios.get(`http://cep.la/${nums}`)
            .then(resp => {
              console.log(resp.data);
              // if (!resp.data?.error) {
              //   cepCallback(resp.data)
              // }
            })
        })

        .catch(()=>{
          axios.get(`http://cep.la/${nums}`)
            .then(resp => {
              console.log(resp.data);
              // if (!resp.data?.error) {
              //   cepCallback(resp.data)
              // }
            })
        })
    }

    //   callCep(cep);
    //   if(!cepCallback || !cep) return null;
    //   let nums = cep.replace(/\D+/g, '')
    //   if(nums.length !== 8) return null
    //   console.log({nums});

  }, [field.value])

  // console.log({field}, {meta});
  return (<div className={`form-group ${containerClass || ''} ${err && 'has-error'}`}>
    {label && <label htmlFor={`fld_${field.name}`}>{label}</label>}

    <input {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'}`}/>

    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
