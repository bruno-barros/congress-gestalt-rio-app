import OverlayTrigger from "react-bootstrap/cjs/OverlayTrigger";
import {rand} from "../../src/helpers";
import Tooltip from "react-bootstrap/cjs/Tooltip";

interface TooltipProps {
  text: string
  children: any
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function ToolTip(props: TooltipProps) {

  const {text, children, position} = props
  const pos = position || 'top'
  const id = 'tooltip-'+rand(11111,99999)

  function Tip(props){
    return (<Tooltip id={id} {...props}>
      {text}
    </Tooltip>)
  }


  return (<OverlayTrigger
    placement={pos}
    overlay={Tip}
  >
    {children}
  </OverlayTrigger>)
}
