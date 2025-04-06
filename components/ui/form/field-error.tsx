import useTrans from "../../hooks/useTrans";

interface FieldErrorProps {
  message: any
  fieldId?: string
  className?: string
}

export default function FieldError({message, fieldId, className}: FieldErrorProps) {

  const t = useTrans()
  if(!message) return null;

  return (<>
    {fieldId
      ? <label className={`${className || ''} text-sm text-danger`} htmlFor={fieldId}>{t(message)}</label>
      : <div className={`${className || ''} text-sm text-danger`}>{t(message)}</div>}
  </>)
}
