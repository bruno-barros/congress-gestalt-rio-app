import { useField } from "formik";
import Mask, { Masks } from "./mask";
import Text from "./text";

interface MaskProps {
  label: string;
  mask: string;
  countryName: string;
  containerClass?: string;
  inputClass?: string;
}
export default function Phone({
  label,
  mask,
  countryName,
  containerClass,
  inputClass,
  ...props
}: MaskProps & any) {
  return <div className={`phone-warpper d-flex ${containerClass || ''}`} style={{gap: 5}}>
    <Text name={countryName} type="number" min={0} label="País" defaultValue="55" containerClass={inputClass} required={props.required} style={{width: 60}} disabled={props?.disabled} />
    <Mask name={props.name} mask={mask || Masks.CELLPHONE} label={label} containerClass={inputClass} required={props.required} disabled={props?.disabled} />
  </div>
}
