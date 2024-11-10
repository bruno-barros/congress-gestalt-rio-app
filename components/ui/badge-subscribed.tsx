import useTrans from "../hooks/useTrans";
import Icon from "./ionicon";

interface BadgeSubscribedProps {
  className?: string
}

export default function BadgeSubscribed(props: BadgeSubscribedProps) {

  const {className} = props
  const t = useTrans()

  return (<div className={`botton-subscribed ${className || ''}`}>
    <Icon name={`checkmark-circle-outline`}/> <span>{t('inscrito')}</span>
  </div>)
}
