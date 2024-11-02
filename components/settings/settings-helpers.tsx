import { PropsWithChildren } from "react";
import s from './setting-helpers.module.scss'

interface FieldProps {
  infos?: string
  noLabel?: boolean
}
export function Field(props: PropsWithChildren<FieldProps>) {
  const { children, infos, noLabel } = props;
  const nl = typeof noLabel !== 'undefined' ? noLabel : false;
  return (
    <div className={s.wrapper}>
      <div className={s.input}>
        {children}
      </div>
      <div className={`${s.infos} ${nl && s.nolabel}`}>
        <div dangerouslySetInnerHTML={{__html: infos}}/>
      </div>
    </div>
  );

}
