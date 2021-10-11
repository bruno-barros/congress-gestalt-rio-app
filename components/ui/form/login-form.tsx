import {useState, useEffect} from "react";
import {Form, Formik} from "formik";
import * as Yup from 'yup';
import {LoadingButton} from "@brunobarros/react-components";
import PasswordRecover from "./password-recover";
import useTrans from "../../hooks/useTrans";
import Facebook from "../../social-login/facebook";
import Google from "../../social-login/google";
import Hr from "../hr";
import Error from "../../../src/resources/error";
import {Providers} from "../../social-login/social-buttons.d";
import MaybeLoginWithEmail from "../maybe-login-with-email";
import {useQueryClient} from "react-query";
import {useDispatch} from "react-redux";
import {BlockUi, Icon} from "@brunobarros/react-components";
import WpUser from "../../../src/http/wp-user";
import {postLogin, setUpUser} from "../../../src/store/user.actions";
import MergingUsers from "../merging-users";
import {useRouter} from "next/router";
import useEvent from "../../hooks/useEvent";
import SignUp from "./sign-up-form";
import Text from "./formik/text";
import {errorNotification} from "../../../src/resources/responses";
import AccountRecover from "./account-recover";
import {ErrorMessage} from "../../../src/store/store.d";
import PopOver from "../popover";
import trimStart from 'lodash/trimStart'

const LoginForm = () => {

  const t = useTrans()
  const router = useRouter()
  const disp = useDispatch()
  const {data: event} = useEvent()
  const queryClient = useQueryClient()
  const [showPassRecover, setShowPassRecover] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [showAccountRecover, setShowAccountRecover] = useState(false)
  const [loginWithEmail, setLoginWithEmail] = useState('')
  const [blockUi, setBlockUi] = useState(false)
  const [response, setResponse] = useState(null)
  const [merging, setMerging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(null)

  const LoginSchema = Yup.object().shape({
    username: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
    password: Yup.string().min(6, 'validacao.curto').required('validacao.obrigatorio'),
  });

  useEffect(()=>{
    if(router.query?.redirect){
      setRedirect(router.query.redirect)
    }
  },[router.query])


  async function handleSocialSuccess(user, provider) {
    // console.log(user);
    setBlockUi(true)
    // exibe mensagem de aguarde...
    const resp = await WpUser.socialLogin(user._profile, provider, router.locale)
    const success = resp.data.success
    const data = resp.data.data
    setBlockUi(false)

    if (!success) {
      errorNotification({error: data})
    } else if (data?.next_action === 'login' || data?.next_action === 'profile_fase_1') {
      disp(setUpUser({
        locale: router.locale,
        user: data?.current_user,
        tokens: {
          access: data?.login?.authToken,
          refresh: data?.login?.refreshToken
        }
      }, () => {
        redirectAfterSuccess(data.next_action === 'profile_fase_1' ? '/register1' : '/dashboard')

      }))
      setTimeout(() => {
        queryClient.refetchQueries('auth')
      }, 1000)
    } else if (data?.next_action === 'account_merging') {
      setResponse(data)
      setMerging(true)
      setTimeout(() => {
        router.reload()
      }, 15000)
    } else {
      errorNotification({message: 'Something happens!'})
    }

  }

  function handleEmailLogin(values) {
    setLoading(true)
    disp(postLogin({
        login: values.username,
        password: values.password
      },
      (user: any, error: ErrorMessage) => {
        if(user) {
          redirectAfterSuccess();
        } else if(error){
          errorNotification({message: t(`validacao.${error.msg}`)})
        }
        setLoading(false)
      }))
  }

  function redirectAfterSuccess(preferred: string|null = null ){
    let page = '/dashboard'
    if(redirect){
      page = `/${trimStart(redirect)}`
    } else if(preferred){
      page = String(preferred)
    }
    router.push(page)
  }

  function handleFailure(error: Error, provider: Providers) {
    setLoginWithEmail(t(`vendor.${error.slug}`))
  }

  return (<div className="login-form">

    <BlockUi blocking={blockUi}/>
    <PopOver title={t('cadastro.login-social')} text={t('cadastro.login-social-texto')} trigger={['hover', 'focus']} position="bottom">
      <button type="button" className="btn btn-sm text-muted" style={{lineHeight: 0}}>
        <Icon name={`help-circle-outline`} style={{verticalAlign: 'middle', marginRight: 4}}/>
        <span className="text-xs">{t('cadastro.login-social')}</span>
      </button>
    </PopOver>
    <Facebook onFailed={handleFailure} onSuccess={handleSocialSuccess}/>
    <Google onFailed={handleFailure} onSuccess={handleSocialSuccess}/>

    <Hr label={t('cadastro.ou-entre-com-email')} className="" bgColor="#ffffff"/>
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={handleEmailLogin}
    >
      {({errors, touched, isValid, values}) => (
        <Form>
          <Text name="username" label={t('seu-email')} floatLabel/>
          <Text name="password" type="password" label={t('senha')} autoComplete="current-password" floatLabel/>
          <LoadingButton disable={!isValid} loading={loading} block>{t('entrar')}</LoadingButton>

          <div className="d-flex justify-content-between my-4">
            <a href="#" onClick={(e) => {
              e.preventDefault()
              setShowSignUp(true)
            }}>{t('cadastro.cadastrar')}</a>
            <a href="#" className="d-inline-block" onClick={(e) => {
              e.preventDefault()
              setShowPassRecover(true)
            }}>{t('cadastro.esqueci-senha')}</a>
          </div>


        </Form>
      )}
    </Formik>

    <SignUp show={showSignUp} onDismiss={() => {
      setShowSignUp(false)
    }}/>
    <PasswordRecover show={showPassRecover} onDismiss={(accountRecover) => {
      setShowPassRecover(false)
      if (accountRecover === true) setShowAccountRecover(true)
    }}/>
    <AccountRecover show={showAccountRecover} onDismiss={() => setShowAccountRecover(false)}/>
    <MaybeLoginWithEmail show={!!loginWithEmail} originalMessage={loginWithEmail} onDismiss={() => {
      setLoginWithEmail('')
    }}/>
    <MergingUsers show={merging} response={response} onDismiss={(nextAction) => {
      setMerging(false)
      if (nextAction === 'password') setShowPassRecover(true)
      if (nextAction === 'cadastro') return
    }}/>
  </div>)
}

export default LoginForm
