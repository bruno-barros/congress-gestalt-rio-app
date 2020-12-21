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


const LoginForm = () => {

  const t = useTrans()
  const router = useRouter()
  const disp = useDispatch()
  const queryClient = useQueryClient()
  const [showPassRecover, setShowPassRecover] = useState(false)
  const [loginWithEmail, setLoginWithEmail] = useState('')
  const [blockUi, setBlockUi] = useState(false)
  const [response, setResponse] = useState(null)
  const [merging, setMerging] = useState(true)

  const LoginSchema = Yup.object().shape({
    username: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
    password: Yup.string().min(8, 'validacao.curto').required('validacao.obrigatorio'),
  });

  async function handleSocialSuccess(user, provider) {
    // console.log(user);
    setBlockUi(true)
    // exibe mensagem de aguarde...
    const resp = await WpUser.socialLogin(user._profile, provider)
    const success = resp.data.success
    const data = resp.data.data
    setBlockUi(false)
    console.log(data);
    if (!success) {
      const error = Error.make(data)
      toast.error(error.message)
    } else if (data?.next_action === 'login' || data?.next_action === 'profile_fase_1') {
      disp(setUpUser({
        user: data?.current_user,
        tokens: {
          access: data?.login?.authToken,
          refresh: data?.login?.refreshToken
        }
      }, () => {
        data.next_action === 'profile_fase_1' ? router.push('/cadastro1') : router.push('/dashboard')
      }))
    } else if (data?.next_action === 'account_merging') {
      setResponse(data)
      setMerging(true)
      // data.prev_user
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
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={handleEmailLogin}
    >
      {({errors, touched, isValid}) => (
        <Form>
          <div className="form-group">
            <label htmlFor="username">{t('seu-email')}</label>
            <Field id="username" name="username" className="form-control" placeholder={t('seu-email')}/>
            <FieldError message={touched?.username && errors?.username} fieldId="username"/>
          </div>
          <div className="form-group">
            <label htmlFor="password">{t('senha')}</label>
            <Field id="password" name="password" className="form-control" placeholder="" type="password"/>
            <FieldError message={touched?.password && errors?.password} fieldId="password"/>
          </div>

          <LoadingButton disable={!isValid} loading={false} block>{t('entrar')}</LoadingButton>

          <a href="#" className="d-inline-block mt-2" onClick={(e) => {
            e.preventDefault()
            setShowPassRecover(true)
          }}>{t('cadastro.esqueci-senha')}</a>

        </Form>
      )}
    </Formik>
    <Hr label={t('ou')} bgColor="#eee"/>
    <Facebook onFailed={handleFailure} onSuccess={handleSocialSuccess}/>
    <Google onFailed={handleFailure} onSuccess={handleSocialSuccess}/>
    <PasswordRecover show={showPassRecover} onDismiss={() => {
      setShowPassRecover(false)
    }}/>
    <MaybeLoginWithEmail show={!!loginWithEmail} originalMessage={loginWithEmail} onDismiss={() => {
      setLoginWithEmail('')
    }}/>
    <MergingUsers show={merging} response={response} onDismiss={(nextAction) => {
      setMerging(false)
      if(nextAction === 'password') setShowPassRecover(true)
      if(nextAction === 'cadastro') return
    }}/>
  </div>)
}

export default LoginForm
