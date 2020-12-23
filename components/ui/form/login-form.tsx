import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import {LoadingButton} from "@brunobarros/react-components";
import FieldError from "./field-error";
import PasswordRecover from "./password-recover";
import {motion} from "framer-motion";
import useTrans from "../../hooks/useTrans";
import Facebook from "../../social-login/facebook";
import Google from "../../social-login/google";
import Hr from "../hr";
import Error from "../../../src/resources/error";
import {Providers} from "../../social-login/social-buttons.d";
import MaybeLoginWithEmail from "../maybe-login-with-email";
import {useQueryClient} from "react-query";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {BlockUi} from "@brunobarros/react-components/dist";
import WpUser from "../../../src/http/wp-user";
import {setUpUser} from "../../../src/store/user.actions";
import MergingUsers from "../merging-users";
import {useRouter} from "next/router";
import useConfig from "../../hooks/useConfig";
import Link from "next/link";
import {inputFloatClass} from "../../../src/helpers";
import SignUp from "./sign-up-form";
import Sweet, {Toast} from '../sweet-alert'

const LoginForm = () => {

  const t = useTrans()
  const router = useRouter()
  const disp = useDispatch()
  const {data: config} = useConfig()
  const queryClient = useQueryClient()
  const [showPassRecover, setShowPassRecover] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [loginWithEmail, setLoginWithEmail] = useState('')
  const [blockUi, setBlockUi] = useState(false)
  const [response, setResponse] = useState(null)
  const [merging, setMerging] = useState(false)

  const LoginSchema = Yup.object().shape({
    username: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
    password: Yup.string().min(8, 'validacao.curto').required('validacao.obrigatorio'),
  });


  async function handleSocialSuccess(user, provider) {
    // console.log(user);
    setBlockUi(true)
    // exibe mensagem de aguarde...
    const resp = await WpUser.socialLogin(user._profile, provider, router.locale)
    const success = resp.data.success
    const data = resp.data.data
    setBlockUi(false)

    if (!success) {
      const error = Error.make(data)
      toast.error(error.message)
    } else if (data?.next_action === 'login' || data?.next_action === 'profile_fase_1') {
      disp(setUpUser({
        locale: router.locale,
        user: data?.current_user,
        tokens: {
          access: data?.login?.authToken,
          refresh: data?.login?.refreshToken
        }
      }, () => {
        data.next_action === 'profile_fase_1' ? router.push('/register1') : router.push('/dashboard')
      }))
    } else if (data?.next_action === 'account_merging') {
      setResponse(data)
      setMerging(true)
      setTimeout(() => {
        router.reload()
      }, 15000)
    } else {
      toast.error('Something happens!')
    }

  }

  async function handleEmailLogin(values) {
    // set loading
    await new Promise((r) => setTimeout(r, 500));
    console.log({values});
  }

  function handleFailure(error: Error, provider: Providers) {
    setLoginWithEmail(t(`vendor.${error.slug}`))
  }

  return (<div className="login-form">

    <BlockUi blocking={blockUi}/>

    <Facebook onFailed={handleFailure} onSuccess={handleSocialSuccess}/>
    <Google onFailed={handleFailure} onSuccess={handleSocialSuccess}/>
    <Hr label={t('cadastro.ou-entre-com-email')} bgColor="#eee"/>
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
          <div className="form-group float-label">
            <Field id="username" name="username" className={inputFloatClass(values.username)} placeholder=""/>
            <label htmlFor="username">{t('seu-email')}</label>
            <FieldError message={touched?.username && errors?.username} fieldId="username"/>
          </div>
          <div className="form-group float-label">
            <Field id="password" name="password" className={inputFloatClass(values.password)} placeholder=""
                   type="password"/>
            <label htmlFor="password">{t('senha')}</label>
            <FieldError message={touched?.password && errors?.password} fieldId="password"/>
          </div>

          <LoadingButton disable={!isValid} loading={false} block>{t('entrar')}</LoadingButton>

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
    <PasswordRecover show={showPassRecover} onDismiss={() => {
      setShowPassRecover(false)
    }}/>
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
