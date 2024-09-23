import React, {useEffect, useState} from "react";
import ToolTip from "./tooltip";
import useTrans from "../hooks/useTrans";
import Icon from "./ionicon";
import Loading from "./loading";

interface ButtonDeleteConfirmationProps {
  buttonClass?: string
  buttonConfirmClass?: string
  buttonCancelClass?: string
  loading?: boolean
  onDelete: () => void
}

export default function ButtonDeleteConfirmation(props: ButtonDeleteConfirmationProps) {

  const t = useTrans()
  const {buttonClass: bc, buttonConfirmClass: cc, buttonCancelClass: bcc, onDelete, loading: setload} = props
  const buttonClass = bc || 'btn btn-sm py-0'
  const buttonConfirmClass = cc || 'btn btn-sm btn-outline-success py-0'
  const buttonCancelClass = bcc || 'btn btn-sm btn-outline-danger py-0'
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(!!setload)
  }, [setload])

  function doDelete() {
    onDelete()
    setState('deleted')
  }

  return (<div className="">
    {state === '' && !loading &&
    <ToolTip text={t('apagar')}>
      <button type="button" className={`${buttonClass} py-0`} style={{lineHeight: 0}}
              onClick={() => setState('confirm')}>
        <Icon name={`trash-outline`} style={{fontSize: 20}}/>
      </button>
    </ToolTip>
    }
    {state === 'confirm' && !loading &&
    <div className="btn-group">
      <ToolTip text={t('sim-confirmar')}>
        <button type="button" className={`${buttonConfirmClass} py-0`} style={{lineHeight: 0}} onClick={doDelete}>
          <Icon name={`checkmark-done-outline`} style={{fontSize: 20}}/>
        </button>
      </ToolTip>
      <ToolTip text={t('nao-cancelar')}>
        <button type="button" className={`${buttonCancelClass} py-0`} style={{lineHeight: 0}}
                onClick={() => setState('')}>
          <Icon name={`close-outline`} style={{fontSize: 20}}/>
        </button>
      </ToolTip>
    </div>}
    {(state === 'deleted' && !loading) &&
    <div className={`${buttonClass} py-0`} style={{lineHeight: 0}}>
      <Icon name={`trash-bin-outline`} style={{fontSize: 20}}/>
    </div>}
    {loading &&
    <div className={`${buttonClass} py-0`} style={{lineHeight: 0}}>
      <Loading size="sm"/>
    </div>}

  </div>)
}
