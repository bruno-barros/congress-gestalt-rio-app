import Image from "next/image";
import LoginForm from "../components/ui/form/login-form";
import {useRouter} from "next/router";
import useTrans from "../components/hooks/useTrans";
import LangSelector from "../components/ui/lang-selector";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Link from "next/link";
import Head from "next/head";
import {siteTitle} from "../src/helpers";
import useEvent from "../components/hooks/useEvent";
import {useQueryClient} from "react-query";


const Login = () => {

  const today = new Date;
  const queryClient = useQueryClient()
  const {data: event} = useEvent()
  const router = useRouter()
  const t = useTrans()
  const {authLoading, user} = useCurrentUser()


  return (<div className="login-page d-flex flex-column">
    <Head>
      <title>{siteTitle('Login', queryClient)}</title>
    </Head>
    <div className="brand-panel">
      <div className="p-4">
        <Image src="/img/logo-h.jpg" width={363} height={91} className="img-fluid"/>
      </div>
    </div>
    <div className="form-panel p-4">

      <div className="d-flex align-items-center justify-content-center mb-3">
        <LangSelector/>
      </div>

      {(user && user.getId() > -1) && <div className="text-center"><div className="alert alert-warning d-inline-block w-auto">
        Olá {user?.getFirstName()}. Você já está logado. <Link href={`/dashboard`} passHref><a>Entrar</a></Link> | <Link href={`/logout`} passHref><a>Sair</a></Link>
      </div></div>}

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
