import {rand} from "../../src/helpers";
import OverlayTrigger from "react-bootstrap/cjs/OverlayTrigger";
import Popover from "react-bootstrap/cjs/Popover";

interface PopOverProps {
  title?: string
  text: string|JSX.Element
  children: any
  trigger: 'hover' | 'click' |'focus' | Array<'hover' | 'click' |'focus'>
  position?: 'top' | 'bottom' | 'left' | 'right'
}


export default function PopOver(props: PopOverProps) {
  const {text, title, trigger: tg, children, position} = props
  const pos = position || 'top'
  const id = 'popover-'+rand(11111,99999)
  const trigger = tg || 'hover'

  function Pop(props){
    return (<Popover id={id} {...props}>
      {title && <Popover.Title>{title}</Popover.Title>}
      <Popover.Content>{text}</Popover.Content>
    </Popover>)
  }


  return (<OverlayTrigger
  rootClose
    placement={pos}
    trigger={trigger}
    overlay={Pop}
  >
    {children}
  </OverlayTrigger>)
}
