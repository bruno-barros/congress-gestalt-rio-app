import LangSelector from "../../components/settings/lang-selector";
import useSettingsContext, { SettingsContextProvider } from "../../components/settings/settings-context";

import Layout from "./layout";
import s from './settings.module.scss';

export default function Context() {
  return <SettingsContextProvider><Global /></SettingsContextProvider>
}

function Global() {
  const { lang, setLang, currentEdition } = useSettingsContext()
  return (<Layout>
    <h2 className={s.title}>
      Trabalhos
      <LangSelector/>
      </h2>

<p>{lang}</p>

    </Layout>);
}
