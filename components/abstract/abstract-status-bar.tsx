import Edition from "../../src/resources/edition";
import useEvent from "../hooks/useEvent";
import useTrans from "../hooks/useTrans";
import React, {useState} from "react";
import Abstract from "../../src/resources/abstract";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification, successNotification} from "../../src/resources/responses";
import Form from "react-bootstrap/cjs/Form";
import {useRouter} from "next/router";
import useAbstract from "../hooks/useAbstract";
import LoadingButton from "../ui/loading-button";

interface AbstractStatusBarProps {
  edition: Edition
  abstract: Abstract
  className?: string
  editable: boolean
}

export default function AbstractStatusBar(props: AbstractStatusBarProps) {

  const router = useRouter()
  const t = useTrans()
  const {refetch} = useAbstract(Number(router.query?.id))
  const {data: event} = useEvent()
  const {edition, abstract, className, editable} = props
  const statuses = edition.abstract.statuses?.filter(s => s !== 'pre_approved')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [notify, setNotify] = useState(true)
  let isPast = true

  function handleClick(e) {
    e.preventDefault()
    if (!editable) return;
    const status = e.target.id.substr(7)
    if (status === abstract.status) return;

    setSelected(status)
  }

  function handleSaveStatus() {
    setLoading(true)
    WpAbstract.updateStatus({
      abstracts: [abstract.databaseId],
      status: selected,
      notify
    })
      .then(resp => {
        if (resp.data.success) {
          refetch()
          successNotification({message: resp.data.data.msg})
        } else {
          errorNotification({message: resp.data.data.msg})
        }
      }, err => {
        errorNotification({error: err})
      })
      .finally(()=>{
        setLoading(false)
        setSelected('')
      })
  }

  return (<div className={`abstract-statuses ${className || ''} ${editable && 'editable'}`}>
    <p className="mb-1"><strong>Status</strong></p>
    <div className="status-container">
      {statuses.map((stats, i) => {
        let active = stats === abstract.status || (abstract.status === 'pre_approved' && stats === 'synopsis_evaluating')
        let sel = stats === selected
        if (active && isPast) {
          isPast = false
        }
        return (<div key={stats}>
          <div id={`status@${stats}`}
               className={`step ${stats} ${active && 'current'} ${isPast && 'past'} ${sel && 'selected'}`}
               onClick={handleClick}>
            <div className="bullet"></div>
            <div className="lbl">{t(`status.${stats}`)}</div>
          </div>
          {i < (statuses.length - 1) && <div className="line"/>}
        </div>)
      })}
    </div>
    {selected && <div className="action-form">
      <Form.Check
        type="switch"
        label="Enviar e-mail de notificação?"
        id={`fld_notify`}
        checked={notify}
        onChange={()=> setNotify(!notify)}
      />
      <div className="btn-group btn-group-sm">
        <LoadingButton onClick={handleSaveStatus} type="button" className=" " variant="success"
                       loading={loading}>{t('confirmar')}</LoadingButton>
        {!loading && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => {
          setSelected('')
          setLoading(false)
        }}>{t('cancelar')}</button>}

      </div>

    </div>}
  </div>)
}
