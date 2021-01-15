import {useField} from "formik";
import FieldError from "../field-error";
import React from "react";
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(
  () => import('react-quill'),
  { ssr: false }
)

interface WysiwygProps {
  label: string
  maxHeight?: 'sm'|'md'|'lg'
  containerClass?: string
  disabled?: boolean
}

export default function Wysiwyg({label, containerClass, maxHeight: mh, disabled, ...props}: WysiwygProps & any) {

  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  const maxHeight = mh || 'md'

  // console.log({field}, {meta});
  return (<div className={`form-group ${containerClass || ''} ${err && 'has-error'}`}>
    {label && <label htmlFor={`fld_${field.name}`}>{label}</label>}
    <ReactQuill readOnly={disabled} theme="snow" className={`editor-height-${maxHeight} ${disabled && 'disabled'}`} value={field.value} onChange={(content, delta, source, editor)=>{
      helpers.setValue(content)
      // console.log(editor.getText(), editor.getLength());
    }}/>
    {/*<textarea {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'}`}  rows={rows || 3}/>*/}
    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
