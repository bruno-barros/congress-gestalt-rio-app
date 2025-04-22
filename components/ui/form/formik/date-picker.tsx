import { useField } from "formik";
import FieldError from "../field-error";
import React, { useEffect, useState } from "react";
import moment from "moment";
import Picker from "react-date-picker";

type ValuePiece = Date | null;
type Value = ValuePiece;

interface DatePickerProps {
  label: string;
  startDateName: string;
  endDateName: string;
  containerClass?: string;
  dateFormat?: string;
  defaultValue?: Value;
}

export default function DatePicker(_props: DatePickerProps & any) {
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
  const [field1, meta1, helpers1] = useField(props.name);
  const v1 =
    typeof defaultValue !== "undefined"
      ? moment(defaultValue).toDate()
      : null;

  const [dates, setDates] = useState<Value>(v1);

  const err = meta1?.touched && meta1?.error;

  useEffect(() => {
    const v1 =
      typeof defaultValue !== "undefined"
        ? moment(defaultValue).toDate()
        : null;
    setDates(v1);
  }, [defaultValue]);

  function handleDateChange(date: Value) {
    if (date) {
    //   console.log({ date });
      setDates(date);
      const d1 = moment(date).format(format);
      helpers1.setValue(d1);
    }
  }

  return (
    <div className={`form-group ${containerClass || ""}`}>
      {label && <label>{`${label} ${props?.required ? "*" : ""}`}</label>}
      <div className="d-block">
        <Picker
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
