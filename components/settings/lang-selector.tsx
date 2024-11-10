import Image from "next/image";
import useSettingsContext from "./settings-context";
import s from './setting-helpers.module.scss'
import { useRouter } from "next/router";

interface LangSelectorProps {
  onUpdate?: (lang: any) => void
}
export default function LangSelector(props: LangSelectorProps) {
  const { onUpdate } = props
  const router = useRouter()
  const { lang, setLang } = useSettingsContext()
  const w = 20
  const languages = router.locales

  // console.log(router.locales)
  function handleClick(e){
    e.preventDefault()
    const value = e.target.parentElement.parentElement.getAttribute('data-lang')
    // console.log(value)
    setLang(value)
    // onUpdate?.(value)
  }

  return <div className={s.lang_selector}>
    {languages.map(l => (
        <a key={l} href="#" className={`lang-item ${l === lang ? 'active' : ''}`} data-lang={l} onClick={handleClick}>
          <Image src={`/img/${l}.svg`} width={w} height={w}/>
        </a>
    ))}
  </div>
}
