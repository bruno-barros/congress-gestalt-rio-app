interface HrProps {
  label?: string
  className?: string
  bgColor?: string
}

export default function Hr(props: HrProps) {

  const {label, className, bgColor} = props
  return (<div className={`hr ${className || ''}`}>
    {label && <div className="label" style={{backgroundColor: bgColor}}>{label}</div>}
  </div>)
}
