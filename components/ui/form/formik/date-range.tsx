import { useField } from "formik";
import FieldError from "../field-error";
import React, { useEffect, useState } from "react";
import useTrans from "../../../hooks/useTrans";
import InputMask from "react-input-mask";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { start } from "repl";
import moment from "moment";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DateRangeProps {
  label: string;
  startDateName: string;
  endDateName: string;
  containerClass?: string;
  dateFormat?: string;
  defaultValue?: Value;
}


export default function DateRange(_props: DateRangeProps & any) {
  const {
    label,
    mask,
    containerClass,
    startDateName,
    endDateName,
    dateFormat,
    defaultValue,
    ...props
  } = _props;
  const format = dateFormat || "DD/MM/YYYY";
  // @ts-ignore
  const [field1, meta1, helpers1] = useField(startDateName);
  const [field2, meta2, helpers2] = useField(endDateName);
  const v1 = typeof defaultValue[0] !== 'undefined' ? moment(defaultValue[0]).toDate() : null;
  const v2 = typeof defaultValue[1] !== 'undefined' ? moment(defaultValue[1]).toDate() : null;
  const [dates, setDates] = useState<Value>([v1, v2]);

  const err = meta1?.touched && meta1?.error;

  function handleDateChange(date: Value) {
    if (Array.isArray(date) && date?.length === 2) {
      console.log({date})
      setDates(date);
        const d1 = moment(date[0]).format(format);
      const d2 = moment(date[1]).format(format);
      helpers1.setValue(d1);
      helpers2.setValue(d2);
    }
  }

  return (
    <div className={`form-group ${containerClass || ""}`}>
      {label && (
        <label>{`${label} ${ props?.required ? "*" : ""}`}</label>
      )}
      <div className="d-block">
        <DateRangePicker
          value={dates}
          defaultValue={dates}
          onChange={handleDateChange}
          format="dd/MM/y"
          locale="pt-BR"
          className=""
        />
      </div>

      <FieldError message={err} fieldId={`fld_${field1.name}`} />
    </div>
  );
}
