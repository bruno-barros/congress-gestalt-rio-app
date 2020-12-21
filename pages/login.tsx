import Image from "next/image";
import LoginForm from "../components/ui/form/login-form";
import {useRouter} from "next/router";
import useTrans from "../components/hooks/useTrans";
import LangSelector from "../components/ui/lang-selector";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Link from "next/link";

const Login = () => {

  const today = new Date;
  const router = useRouter()
  const t = useTrans()
  const {authLoading, user} = useCurrentUser()


  return (<div className="login-page d-flex flex-column">
    <div className="brand-panel">
      <div className="p-4">
        <Image src="/img/logo-h.jpg" width={363} height={91} className="img-fluid"/>
      </div>
    </div>
    <div className="form-panel p-4">

      <div className="d-flex align-items-center justify-content-between">
        <Link href="/cadastro" passHref><a>{t('cadastro.nao-tenho-cadastro')}</a></Link>
        <LangSelector/>
      </div>
      <LoginForm/>

    </div>
    <div className="footer-panel px-4 py-3 text-center text-xs text-muted">
      {t('versao')} {process.env.version} &nbsp; @{today.getFullYear()} <a
      href="https://conceito-online.com.br??utm_source=app&utm_medium=link&utm_campaign=Sistema_Evento"
      target="_blank">Conceito</a>
    </div>
  </div>)
}

export default Login
