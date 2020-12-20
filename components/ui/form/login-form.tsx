import {useEffect, useState} from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup';
import {LoadingButton} from "@brunobarros/react-components";
import FieldError from "./field-error";
import PasswordRecover from "./password-recover";
import {motion} from "framer-motion";
import useTrans from "../../hooks/use-trans";
import Facebook from "../../social-login/facebook";
import Google from "../../social-login/google";
import Hr from "../hr";


const LoginForm = () => {

  const t = useTrans()
  const [showPassRecover, setShowPassRecover] = useState(false)

  const LoginSchema = Yup.object().shape({
    username: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
    password: Yup.string().min(8, 'validacao.curto').required('validacao.obrigatorio'),
  });

  return (<div className="login-form">
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={async (values) => {
        await new Promise((r) => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
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
    <Facebook/>
    <Google/>
    <PasswordRecover show={showPassRecover} onDismiss={() => {
      setShowPassRecover(false)
    }}/>
  </div>)
}

export default LoginForm
