import {Edition} from "../../src/resources/event";
import useEvent from "../hooks/useEvent";
import {Status} from "./abstract.d";
import useTrans from "../hooks/useTrans";
import {useState} from "react";
import {LoadingButton} from "@brunobarros/react-components";

interface AbstractStatusBarProps {
  edition: Edition
  currentStatus: Status
  className?: string
  editable: boolean
}

export default function AbstractStatusBar(props: AbstractStatusBarProps) {

  const t = useTrans()
  const {data: event} = useEvent()
  const {edition, currentStatus, className, editable} = props
  const statuses = edition.abstract.statuses
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  let isPast = true

  function handleClick(e) {
    e.preventDefault()
    if(!editable) return;
    const status = e.target.id.substr(7)
    if(status === currentStatus) return;

    setSelected(status)
  }

  function handleSaveStatus(){
    console.log(selected);
    setLoading(true)

    setTimeout(()=>{
      setLoading(false)
      setSelected('')
    }, 2000)
  }

  return (<div className={`abstract-statuses ${className || ''} ${editable && 'editable'}`}>
    <p className="mb-1"><strong>Status</strong></p>
    <div className="status-container">
      {statuses.map((stats, i) => {
        let active = stats === currentStatus
        let sel = stats === selected
        if (active && isPast) {
          isPast = false
        }
        return (<div key={stats}>
          <div id={`status@${stats}`} className={`step ${stats} ${active && 'current'} ${isPast && 'past'} ${sel && 'selected'}`}
               onClick={handleClick}>
            <div className="bullet"></div>
            <div className="lbl">{t(`status.${stats}`)}</div>
          </div>
          {i < (statuses.length - 1) && <div className="line"/>}
        </div>)
      })}
    </div>
    {selected && <div className="btn-group btn-group-sm">
      <LoadingButton onClick={handleSaveStatus} type="button" className=" " variant="success" loading={loading}>{t('confirmar')}</LoadingButton>
      {!loading && <button type="button" className="btn btn-sm btn-outline-secondary" onClick={()=>{
        setSelected('')
        setLoading(false)
      }}>{t('cancelar')}</button>}

    </div>}
  </div>)
}
