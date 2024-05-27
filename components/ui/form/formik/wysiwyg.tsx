import {useField} from "formik";
import FieldError from "../field-error";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import dynamic from 'next/dynamic'
import throttle from 'lodash/throttle'
import {Trans} from "react-i18next";

const ReactQuill = dynamic(
  () => import('react-quill'),
  {ssr: false}
)

interface WysiwygProps {
  label: string
  maxHeight?: 'sm' | 'md' | 'lg'
  containerClass?: string
  disabled?: boolean
  charsMin?: number
  charsMax?: number
  countMethod?: 'char'|'word'
}

export default function Wysiwyg({label, containerClass, maxHeight: mh, disabled, charsMin: cm, charsMax, countMethod, ...props}: WysiwygProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.error
  const maxHeight = mh || 'md'
  const [editorLength, setEditorLength] = useState(0)
  const [editorValid, setEditorValid] = useState(false)
  const charsMin = !cm && charsMax ? 1 : cm
  const method = countMethod || 'char'

  const checkValidity = useCallback(throttle((editorLength) => {
    const isValid = (editorLength >= charsMin && editorLength <= charsMax) || charsMax === 0
    if (!isValid) helpers.setError('Não está dentro do limite de caracteres')
    setEditorValid(isValid)
  }, 1000), [charsMin, charsMax])

  useEffect(() => {
    // console.log(editorLength)
    checkValidity(editorLength)
  }, [editorLength])


  return (<div className={`form-group ${containerClass || ''} ${err && 'has-error'}`}>
    {label && <label htmlFor={`fld_${field.name}`} className="w-100">{label}</label>}
    <ReactQuill
      readOnly={disabled}
      theme="snow"
      className={`editor-height-${maxHeight} ${disabled && 'disabled'}`}
      value={field.value}
      onChange={(content, delta, source, editor) => {
        helpers.setValue(content)
        setTimeout(() => {
          if(method === 'word') setEditorLength(editor.getText().split(/\s+/).length - 1)
          else setEditorLength(editor.getLength() - 1)
        }, 100)
        // console.log(editor.getText(), editor.getText().split(/\s+/).length);
      }}/>
    {(charsMax > 0 && !disabled) &&
    <div className={`wysiwyg-restrictions ${!editorValid ? 'text-danger' : ''}`}>
      <div className={`py-1 px-2 ${(!editorValid && editorLength > charsMin) ? 'bg-danger text-white' : ''}`}>
        <Trans as="div"
               i18nKey={method === 'word' ? "validacao.minimo-de-maximo-de-palavra" : "validacao.minimo-de-maximo-de-caracter"}
               values={{charsMin, charsMax}}
               defaults={`Mínimo de {{charsMin}} e máximo de {{charsMax}} caracteres`}/>
      </div>
      <div className=""><strong>({editorLength})</strong></div>
    </div>}

    {/*<FieldError message={err} fieldId={`fld_${field.name}`}/>*/}
  </div>)
}
