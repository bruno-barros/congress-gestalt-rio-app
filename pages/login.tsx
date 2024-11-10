import LoginForm from "../components/ui/form/login-form";
import {useRouter} from "next/router";
import useTrans from "../components/hooks/useTrans";
import LangSelector from "../components/ui/lang-selector";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Link from "next/link";
import Head from "next/head";
import {asset, siteTitle} from "../src/helpers";
import useEvent from "../components/hooks/useEvent";
import {useQueryClient} from "react-query";
import {useEffect} from "react";
import {toast} from "react-toastify";
import authToken from '../src/http/auth-token'

const Login = () => {

  const today = new Date;
  const queryClient = useQueryClient()
  const {data: event} = useEvent()
  const router = useRouter()
  const t = useTrans()
  const {authLoading, user} = useCurrentUser()

  useEffect(()=>{
    if(router.query.passreseted){
      toast.success( t('cadastro.senha-atualizada-sucesso'), {position: 'top-center'})
    }
  },[router.query])



  return (<div className="login-page">
    <Head>
      <title>{siteTitle('Login', queryClient)}</title>
    </Head>
    <div className="login-main-panel">
      <div className="brand-panel" style={{
        backgroundImage: `url(/img/intro.jpg)`,
        // backgroundSize: 'contain',
      }}>
        <div className="p-4">
          {/* <img src={event?.logoPrimary} className="logo img-fluid"/> */}
        </div>
      </div>
      <div className="form-panel p-4">
          <img src={event?.logoPrimary} className="logo img-fluid "/>
        {event && event.languages.length > 1 && <div className="d-flex align-items-center justify-content-center mb-3">
          <LangSelector/>
        </div>}


        {(user && user.getId() > -1 && authToken.factory().isValid) && <div className="text-center"><div className="alert alert-warning">
          Olá {user?.getFirstName()}. {t('ja-autenticado')}. <br/><Link href={`/dashboard`} passHref><a>{t('entrar')}</a></Link> | <Link href={`/logout`} passHref><a>{t('sair')}</a></Link>
        </div></div>}

        <LoginForm/>

      </div>
    </div>

    <div className="footer-panel px-4 py-3 text-center text-muted d-md-flex align-items-center" style={{fontSize:10, gap: 15}}>
      {t('versao')} {process.env.version} 
      <span className="d-flex align-items-center" style={{gap: 5}}>Apoio: <img src={asset('img/abg.png')} alt="ABG" className="img-fluid" style={{maxWidth: 60}} /></span>
    </div>
  </div>)
}

export default Login
