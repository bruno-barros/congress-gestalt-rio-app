import Image from "next/image"
import { PropsWithChildren } from "react"
import s from './setting-helpers.module.scss'
interface LangIndicatorProps {    
    lang: string
}
export default function LangIndicator(props: PropsWithChildren<LangIndicatorProps>){
    const {lang, children} = props
    const w = 14
    return <div className={s.lang_indicator}>
        <Image src={`/img/${lang}.svg`} width={w} height={w}/>
        <div>{children}</div>
    </div>

}