import { useField } from "formik";
import FieldError from "../field-error";
import React, { useEffect, useState } from "react";
import useTrans from "../../../hooks/useTrans";
import zxcvbn from "zxcvbn";
import scope from "ast-types/lib/scope";
import { Icon } from "@brunobarros/react-components";

interface PasswordProps {
  label: string;
  minStrength: number;
  thresholdLength: number;
  containerClass?: string;
  submitted?: any;
  floatLabel?: boolean;

  passwordStrength(
    strength: number,
    isStrong: boolean,
    reset?: () => void
  ): void;
}

export default function Password({
  label,
  containerClass,
  minStrength,
  thresholdLength,
  submitted,
  floatLabel: fl,
  passwordStrength,
  ...props
}: PasswordProps & any) {
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const floatLabel = fl ? "float-label" : "";

  minStrength =
    typeof minStrength === "number" ? Math.max(Math.min(minStrength, 4), 0) : 3;

  thresholdLength =
    typeof thresholdLength === "number" ? Math.max(thresholdLength, 7) : 7;

  const [strength, setStrength] = useState(0);
  const [showPwd, setShowPwd] = useState(false);

  const err = field.value.length > 3 && meta?.error;

  useEffect(() => {
    handleChange(field.value);
  }, [field.value]);

  useEffect(() => {
    if (props?.submitted) reset();
  }, [props?.submitted]);

  function reset() {
    setStrength(0);
    helpers.setValue("");
    helpers.setTouched(false);
    helpers.setError({});
  }

  function handleChange(value: string) {
    let score = zxcvbn(value).score;
    if (value.length < thresholdLength || score < 3) {
      helpers.setError("validacao.senha-fraca");
    }
    setStrength(score);
    passwordStrength && passwordStrength(score, score >= minStrength, reset);
  }

  // console.log({field}, {meta});
  return (
    <div
      className={`form-group ${floatLabel} ${containerClass || ""} ${
        err && "has-error"
      }`}
    >
      {label && !floatLabel && (
        <label
          htmlFor={`fld_${field.name}`}
          className="d-flex align-items-center"
        >
          {label}
          <div className="bb-strengthMeter flex-grow-1 ml-2">
            <div className="bb-strengthMeterFill" data-strength={strength} />
          </div>
        </label>
      )}

      <div className="input-group">
        <input
          {...field}
          {...props}
          type={showPwd ? "text" : "password"}
          id={`fld_${field.name}`}
          className={`form-control ${err && "is-invalid"} ${
            field?.value?.length ? "filled" : ""
          }`}
          aria-describedby="password-show"
        />
        {label && floatLabel && (
          <>
            <label htmlFor={`fld_${field.name}`}>{label}</label>
          </>
        )}
        <div
          className="input-group-append"
          style={{ cursor: "pointer" }}
          onClick={() => setShowPwd(!showPwd)}
        >
          <span
            className="input-group-text"
            id="password-show"
            style={{ backgroundColor: "white" }}
          >
            <Icon name={`${showPwd ? "eye-off-outline" : "eye-outline"}`} />
          </span>
        </div>
      </div>

      {label && floatLabel && (
        <>
          <div className="bb-strengthMeter flex-grow-1">
            <div className="bb-strengthMeterFill" data-strength={strength} />
          </div>
        </>
      )}

      <FieldError message={err} fieldId={`fld_${field.name}`} />
    </div>
  );
}
