import { useField } from "formik";
import FieldError from "../field-error";
import React, { useEffect, useState } from "react";
import useTrans from "../../../hooks/useTrans";
import InputMask from "react-input-mask";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { start } from "repl";
import moment from "moment";

interface DateRangeProps {
  label: string;
  startDateName: string;
  endDateName: string;
  containerClass?: string;
  dateFormat?: string;
}

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function DateRange(_props: DateRangeProps & any) {
  const {
    label,
    mask,
    containerClass,
    startDateName,
    endDateName,
    dateFormat,
    ...props
  } = _props;
  const format = dateFormat || "DD/MM/YYYY";
  // @ts-ignore
  const [field1, meta1, helpers1] = useField(startDateName);
  const [field2, meta2, helpers2] = useField(endDateName);
  const v1 = field1.value ? moment(field1.value).toDate() : null;
    const v2 = field2.value ? moment(field2.value).toDate() : null;
  const [dates, setDates] = useState<Value>([v1, v2]);

  const err = meta1?.touched && meta1?.error;

  useEffect(() => {
    if (Array.isArray(dates) && dates?.length === 2) {
      const d1 = moment(dates[0]).format(format);
      const d2 = moment(dates[1]).format(format);
      helpers1.setValue(d1);
      helpers2.setValue(d2);
    }
  }, [dates]);
  useEffect(()=>{
    console.log({field1, field2})
    if(field1.value && field2.value){
      setDates([new Date(field1.value), new Date(field2.value)])

    }
  }, [])

  return (
    <div className={`form-group ${containerClass || ""}`}>
      {label && (
        <label>{`${label} ${ props?.required ? "*" : ""}`}</label>
      )}
      <div className="d-block">
        <DateRangePicker
          value={dates}
          onChange={setDates}
          format="dd/MM/y"
          locale="pt-BR"
          className=""
        //   value={[field1.value || new Date(), field2.value || new Date()]}
        />
      </div>

      <FieldError message={err} fieldId={`fld_${field1.name}`} />
    </div>
  );
}
