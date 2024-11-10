import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import { dump } from "../../src/helpers";


interface LangSelectorProps {
  label?: string
  size?: number
  context?: string
  className?: string
}

export default function LangSelector(props: LangSelectorProps) {

  const {size, context, label, className} = props
  const router = useRouter()
  const [base, setBase] = useState('/')

  useEffect(() => {
    setBase(router.asPath)
  }, [router])

  if (!router?.locales) return null

  let s = size || 30

  return (<div className={`lang-selector ${className || ''}`}>
    {/* {dump(router)} */}
    {label && <div className="lang-selector-label">{label}</div>}
    {router.locales.map(lng => (
      <Link href={base} locale={lng} key={lng} passHref>
        <a className={`${lng === router.locale ? 'active' : ''}`}>
          <Image src={`/img/${lng}.svg`} width={s} height={s}/>
        </a>
      </Link>
    ))}
  </div>)
}
