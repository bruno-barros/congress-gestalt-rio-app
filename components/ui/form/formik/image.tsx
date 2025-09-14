import { useField } from "formik";
import FieldError from "../field-error";
import { CSSProperties, useRef, useState } from "react";
import { DragDrop, StatusBar, useUppy } from "@uppy/react";
import { uppyUploadV1 } from "../../../../src/http/uppy";
import { toast } from "react-toastify";
import { UploadedFileSchema } from "../../../../src/types/files";
import { dump } from "../../../../src/helpers";
import s from "./image.module.scss";
import Button from "react-bootstrap/Button";

interface ImageProps {
  name: string;
  label: string;
  containerClass?: string;
  required?: boolean;
  disabled?: boolean;
  imgStyle?: CSSProperties;
}
export default function Image(props: ImageProps) {
  const {
    name,
    label,
    containerClass,
    required,
    disabled: _disabled,
    imgStyle,
  } = props;

  const disabled = typeof _disabled !== "undefined" ? _disabled : false;
  const [field, meta, helpers] = useField(name);
  const added = useRef(false);
  const err = meta?.touched && meta?.error;
  const [original, setOriginal] = useState<UploadedFileSchema | null>(null);

  const uppy = useUppy(
    uppyUploadV1({
      locale: "pt",
      max_size: 4,
    })
  );
  uppy.setMeta({
    context: "image",
  });
  uppy.on("upload", (data) => {
    added.current = false;
  });
  uppy.on("upload-success", (file, resp) => {
    if (resp.body.success) {
      const file: UploadedFileSchema = resp.body.data;
      setOriginal(file);
      if (!added.current) {
        helpers.setValue(file.url);
        added.current = true;
      }
    } else {
      toast.error(resp.body.message, { toastId: "upload-error" });
    }
    uppy.reset();
  });

  function handleDelete() {
    helpers.setValue("");
    setOriginal(null);
    added.current = false;
  }

  return (
    <div
      className={`form-group  ${containerClass || ""} ${err && "has-error"}`}
    >
      {label && (
        <label htmlFor={`fld_${field.name}`}>
          {label}
          {` ${required ? "*" : ""}`}
        </label>
      )}

      <div className="">
        <StatusBar
          uppy={uppy}
          hideUploadButton
          hideAfterFinish={false}
          showProgressDetails
        />
        {field.value.length < 5 && !disabled && (
          <DragDrop
            uppy={uppy}
            height={130}
            locale={{
              strings: {
                // dropHereOr: 'Solte um documento aqui ou %{browse}',
                // browse: 'explorar arquivos'
              },
            }}
          />
        )}
      </div>

      {field.value.length > 0 && (
        <div className={s.wrapper}>
          <img src={field.value} alt=" " className={s.img} style={imgStyle} />
          <div>
            <Button size="sm" variant="outline-link" onClick={handleDelete}>
              remover
            </Button>
          </div>
        </div>
      )}

      {/* <input {...field} {...props} id={`fld_${field.name}`} className={`form-control ${err && 'is-invalid'}`}/> */}

      <FieldError message={err} fieldId={`fld_${field.name}`} />
    </div>
  );
}
