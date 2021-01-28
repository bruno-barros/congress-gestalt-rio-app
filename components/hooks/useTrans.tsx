import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {useRouter} from "next/router";

export default function useTrans() {
  const router = useRouter()

  const {t, i18n} = useTranslation(null, {useSuspense: false})

  useEffect(() => {
    i18n.changeLanguage(router.locale)
  }, [router.locale])

  useEffect(() => {
    router.query?.lang && i18n.changeLanguage(String(router.query.lang))
  }, [router.query?.lang])

  return t
}
