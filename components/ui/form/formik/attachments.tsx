import {FieldArray, useField} from "formik";
import FieldError from "../field-error";
import React, {useRef, useState} from "react";
import useTrans from "../../../hooks/useTrans";
import {useUppy} from "../../../hooks/useUppy";
import {uppyDocument} from "../../../../src/http/uppy";
import useCurrentUser from "../../../hooks/useCurrentUser";
import {toast} from "react-toastify";
import {DragDrop, StatusBar} from "@uppy/react";
import {Icon} from "@brunobarros/react-components";
import {useRouter} from "next/router";

interface AttachmentsProps {
  label: string
  metas: any
  containerClass?: string
}

export default function Attachments({label, metas, containerClass, ...props}: AttachmentsProps & any) {

  // @ts-ignore
  const router = useRouter()
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  const [metaData, setMetaData] = useState<any>(metas);
  const added = useRef(false)

  const uppy = useUppy(uppyDocument({locale: router.locale}))
  metas && uppy.setMeta(metas)
  uppy.on('upload', (data) => {
    added.current = false
  })

  return (<div className={`form-panel bg-light p-4 mb-3 ${err && 'has-error'}`}>
    <div className="header">{label}</div>
    <FieldArray name={field.name}>{({insert, remove, push}) => {

      uppy.on('upload-success', (file, resp) => {
        if (resp.body.success) {
          if (!added.current){
            push(resp.body.data)
            added.current = true
          }
        } else {
          toast.error(resp.body.data.msg, {toastId: 'upload-error'});
        }
        uppy.reset();
      })

      return (<div className="attachments-container">
        {field.value?.length > 0 && field.value.map((file, idx) => (
          <div className="border d-flex align-items-center justify-content-between" key={idx}>
            <div className="text-truncate">{file.name}</div>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => {remove(idx)}}><Icon name={`trash-outline`}/></button>
          </div>
        ))}

        <div className="mt-3">
          <StatusBar
            uppy={uppy}
            hideUploadButton
            hideAfterFinish={false}
            showProgressDetails
          />
          <DragDrop
            uppy={uppy}
            height={130}
            locale={{
              strings: {
                // dropHereOr: 'Solte um documento aqui ou %{browse}',
                // browse: 'explorar arquivos'
              }
            }}
          />
        </div>
      </div>)
    }}</FieldArray>
    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
