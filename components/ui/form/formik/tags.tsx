import {FieldArray, useField} from "formik";
import FieldError from "../field-error";
import React, {useRef, useState} from "react";
import useTrans from "../../../hooks/useTrans";
import {errorNotification} from "../../../../src/resources/responses";
import {dispatchOnENTER} from "../../../../src/helpers";
import Icon from "../../ionicon";

interface TagsProps {
  label: string
  containerClass?: string
  minTags?: number
  maxTags?: number
  disabled?: boolean
}

export default function Tags({label, containerClass, minTags: min, maxTags: ma, disabled, ...props}: TagsProps & any) {

  const t = useTrans()
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.error
  const [newTag, setNewTag] = useState('');
  const minTags = min || 0
  const maxTags = ma || 20
  const tagInput = useRef(null)

  async function handleAdd(push) {
    if (newTag.length < 2) {
      errorNotification({message: t('validacao.curto')})
      return;
    }

    push(newTag)
    reset()
  }


  function reset() {
    setNewTag('')
    tagInput.current.focus()
  }

  function LabelMinMax(){
    if(minTags > 0 && maxTags > 0){
      return <small>({t('trabalho.minimo-de')} {minTags}, {t('trabalho.maximo-de')} {maxTags})</small>
    }
    if(minTags > 0){
      return <small>({t('trabalho.minimo-de')} {minTags})</small>
    }
    if(maxTags > 0){
      return <small>({t('trabalho.maximo-de')} {maxTags})</small>
    }
    return null
  }

  return (<div className={`form-panel bg-light px-3 py-2 mb-3 ${err && 'has-error'} ${props?.disabled ? 'text-muted' : ''}`}>
    <div className="">{label} <LabelMinMax /></div>
    <FieldArray name={field.name}>{({insert, remove, push}) => {

      return (<div className="tags-container">
        {field.value?.length > 0 && field.value.map((tag, idx) => (
          <div className="border rounded d-inline-block py-1 px-2 mr-1 mb-1" key={idx} style={{}}>
            <div className="d-flex align-items-center justify-content-between">
              {tag}
              {!disabled &&
              <button type="button" className="btn btn-sm py-0" style={{lineHeight: 1}} onClick={() => {
                remove(idx)
              }}><Icon name={`close-outline`} style={{fontSize: 18}}/>
              </button>}

            </div>
          </div>
        ))}

        {!disabled && (maxTags > field.value.length)
        && <div className="mt-0">
          <div className="input-group">
            <input ref={tagInput} type="text" name="new_tag" value={newTag}
                   className="form-control" onChange={(e) => {
              setNewTag(e.target.value)
            }} onKeyDown={e => dispatchOnENTER(e, ()=>{
                handleAdd(push)
            })}/>
            <div className="input-group-append">
              <button type="button" onClick={() => {
                handleAdd(push)
              }}
                      className="btn btn-outline-primary">{t('adicionar')}
              </button>
            </div>
          </div>
        </div>}

      </div>)
    }}</FieldArray>
    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
