import React, {useState} from "react";
import {Icon} from "@brunobarros/react-components";
import ToolTip from "./tooltip";

interface ButtonDeleteConfirmationProps {
  buttonClass?: string
  buttonConfirmClass?: string
  buttonCancelClass?: string
  onDelete: () => void
}

export default function ButtonDeleteConfirmation(props: ButtonDeleteConfirmationProps) {

  const {buttonClass: bc, buttonConfirmClass: cc, buttonCancelClass: bcc, onDelete} = props
  const buttonClass = bc || 'btn btn-sm py-0'
  const buttonConfirmClass = cc || 'btn btn-sm btn-outline-success py-0'
  const buttonCancelClass = bcc || 'btn btn-sm btn-outline-danger py-0'
  const [state, setState] = useState('')

  function doDelete() {
    onDelete()
    setState('deleted')
  }

  return (<div className="">
    {state === '' &&
    <ToolTip text="Apagar">
      <button type="button" className={`${buttonClass} py-0`} style={{lineHeight: 0}}
              onClick={() => setState('confirm')}>
        <Icon name={`trash-outline`} style={{fontSize: 20}}/>
      </button>
    </ToolTip>
    }
    {state === 'confirm' &&
    <div className="btn-group">
      <ToolTip text="Sim, confirmar deleção">
        <button type="button" className={`${buttonConfirmClass} py-0`} style={{lineHeight: 0}} onClick={doDelete}>
          <Icon name={`checkmark-done-outline`} style={{fontSize: 20}}/>
        </button>
      </ToolTip>
      <ToolTip text="Não, cancelar">
        <button type="button" className={`${buttonCancelClass} py-0`} style={{lineHeight: 0}}
                onClick={() => setState('')}>
          <Icon name={`close-outline`} style={{fontSize: 20}}/>
        </button>
      </ToolTip>
    </div>}
    {state === 'deleted' &&
    <div className={`${buttonClass} py-0`} style={{lineHeight: 0}}>
      <Icon name={`trash-bin-outline`} style={{fontSize: 20}}/>
    </div>}

  </div>)
}
