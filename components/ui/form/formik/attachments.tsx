import {FieldArray, useField} from "formik";
import FieldError from "../field-error";
import React, {useRef, useState} from "react";
import {useUppy} from "../../../hooks/useUppy";
import {uppyDocument, uppyUploadV1} from "../../../../src/http/uppy";
import {toast} from "react-toastify";
import {DragDrop, StatusBar} from "@uppy/react";
import {useRouter} from "next/router";
import useTrans from "../../../hooks/useTrans";
import {useDispatch} from "react-redux";
import {blockUi} from "../../../../src/store/ui.actions";
import WpDocument from "../../../../src/http/wp-document";
import Error from "../../../../src/resources/error";
import ButtonDeleteConfirmation from "../../button-delete-confirmation";
import useEvent from "../../../hooks/useEvent";
import moment from "moment";
import useCurrentUser from "../../../hooks/useCurrentUser";
import useSettings from "../../../hooks/useSettings";

interface AttachmentsProps {
  label: string
  metas: any
  containerClass?: string
  maxFiles?: number
  disabled?: boolean
  info?: string
}

export default function Attachments({label, metas, containerClass, maxFiles: mf, disabled, info, ...props}: AttachmentsProps & any) {

  // @ts-ignore
  const { data: event, currentEdition} = useSettings()
  const router = useRouter()
  const disp = useDispatch()
  const t = useTrans()
  const {user}=useCurrentUser()
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  const [metaData, setMetaData] = useState<any>(metas || {});
  const added = useRef(false)
  const maxFiles = mf || 20

  const uppy = useUppy(uppyUploadV1({
    locale: router.locale,
    max_size: event?.abstract?.attachments_max_size
  }))
  // console.log(metas)
  uppy.setMeta(metaData)
  uppy.on('upload', (data) => {
    added.current = false
  })

  async function handleDeletion(removeFn, file, index) {
    disp(blockUi(true))
    try {
      let success = true
      let data = {msg: 'ok'}
      if(file?.id){
        const resp = await WpDocument.delete(file.id)
        success = resp.data.success
        data = resp.data?.data
      } 
      disp(blockUi(false))
      if(success) {
        removeFn(index)
        toast.success(t('trabalho.documento-deletado'))
      }
      else toast.error(data.msg)
    } catch (err) {
      disp(blockUi(false))
      const error = Error.make(err)
      toast.error(error.message)
    }
  }

  return (<div className={`form-panel bg-light p-4 mb-3 ${err && 'has-error'}`}>
    <div className="label">{label} <small>({t('trabalho.maximo-de')} {maxFiles} / {`${event?.abstract?.attachments_max_size}Mb ${t('cada')}`})</small></div>
    {info && <div className="border-left p-2 text-muted text-sm" dangerouslySetInnerHTML={{__html: info}}></div>}
    <FieldArray name={field.name}>{({insert, remove, push}) => {

      uppy.on('upload-success', (file, resp) => {
        if (resp.body.success) {
          if (!added.current) {
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
          <div className="border-top border-bottom  d-flex align-items-center justify-content-between py-2 px-4" key={idx} style={{margin: '0 -1.5rem -1px'}}>
            <div className="d-flex align-items-center text-sm text-truncate">
              <div className="mr-2 text-nowrap">VER {file.version}</div>
              <div className="mr-2 text-nowrap">{moment(file.created_at).format('DD/MM/YYYY')}</div>
              <a href={file.url} target="_blank" className="text-truncate">{file.name}</a>
            </div>
            {(!disabled)
            && <ButtonDeleteConfirmation onDelete={()=>{
                handleDeletion(remove, file, idx)
            }}/>}

          </div>
        ))}

        <div className="mt-3">
          <StatusBar
            uppy={uppy}
            hideUploadButton
            hideAfterFinish={false}
            showProgressDetails
          />
          {(maxFiles > field.value.length && !disabled) && <DragDrop
            uppy={uppy}
            height={130}
            locale={{
              strings: {
                // dropHereOr: 'Solte um documento aqui ou %{browse}',
                // browse: 'explorar arquivos'
              }
            }}
          />}

        </div>
      </div>)
    }}</FieldArray>
    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
