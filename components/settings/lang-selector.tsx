import Image from "next/image";
import useSettingsContext from "./settings-context";

import s from './setting-helpers.module.scss'

const languages = ['pt', 'en']

interface LangSelectorProps {
  onUpdate?: (lang: any) => void
}
export default function LangSelector(props: LangSelectorProps) {
  const { onUpdate } = props
  const { lang, setLang } = useSettingsContext()
  const w = 20

  function handleClick(e){
    e.preventDefault()
    const value = e.target.parentElement.parentElement.getAttribute('data-lang')
    // console.log(value)
    setLang(value)
    // onUpdate?.(value)
  }

  return <div className={s.lang_selector}>
    {languages.map(l => (
        <a href="#" className={`lang-item ${l === lang ? 'active' : ''}`} data-lang={l} onClick={handleClick}>
          <Image src={`/img/${l}.svg`} width={w} height={w}/>
        </a>
    ))}
  </div>
}
