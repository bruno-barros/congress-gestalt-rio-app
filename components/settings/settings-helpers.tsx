import { PropsWithChildren } from "react";
import s from './setting-helpers.module.scss'

interface FieldProps {
  infos?: string
}
export function Field(props: PropsWithChildren<FieldProps>) {
  const { children, infos } = props;

  return (
    <div className={s.wrapper}>
      <div className={s.input}>
        {children}
      </div>
      <div className={s.infos}>
        <div dangerouslySetInnerHTML={{__html: infos}}/>
      </div>
    </div>
  );

}
