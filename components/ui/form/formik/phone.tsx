import { useField } from "formik";
import Mask, { Masks } from "./mask";
import Text from "./text";

interface MaskProps {
  label: string;
  mask: string;
  countryName: string;
  containerClass?: string;
}
export default function Phone({
  label,
  mask,
  countryName,
  containerClass,
  ...props
}: MaskProps & any) {
  return <div className="phone-warpper d-flex" style={{gap: 5}}>
    <Text name={countryName} type="number" min={0} label="País" defaultValue="55" containerClass={containerClass} style={{width: 60}} />
    <Mask name={props.name} mask={Masks.CELLPHONE} label={label} containerClass={containerClass} />
  </div>
}
