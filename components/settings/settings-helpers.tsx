import { Component, CSSProperties, PropsWithChildren, ReactNode } from "react";
import s from "./setting-helpers.module.scss";

interface FieldProps {
  infos?: string | ReactNode;
  noLabel?: boolean;
  style?: CSSProperties;
}
export function Field(props: PropsWithChildren<FieldProps>) {
  const { children, infos, noLabel, style } = props;
  const nl = typeof noLabel !== "undefined" ? noLabel : false;
  return (
    <div className={s.wrapper} style={style}>
      <div className={s.input}>{children}</div>
      <div className={`${s.infos} ${nl && s.nolabel}`}>
        {(typeof infos === "object") ? infos : (
          <div dangerouslySetInnerHTML={{ __html: infos }} />
        )}
      </div>
    </div>
  );
}
