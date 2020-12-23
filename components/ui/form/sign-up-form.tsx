import Modal from "react-bootstrap/cjs/Modal";
import {useEffect, useState} from "react";
import {LoadingButton} from "@brunobarros/react-components";
import useTrans from "../../hooks/useTrans";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {inputFloatClass} from "../../../src/helpers";
import FieldError from "./field-error";
import WpUser from "../../../src/http/wp-user";
import {useRouter} from "next/router";
import Sweet from '../sweet-alert'

interface SignUpProps {
  show: boolean

  onDismiss(): void
}

export default function SignUp(props: SignUpProps) {

  const {onDismiss} = props
  const [show, setShow] = useState(props.show)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({success: false, msg: ''})
  const t = useTrans()
  const router = useRouter()

  const LoginSchema = Yup.object().shape({
    username: Yup.string().email('validacao.email').required('validacao.obrigatorio'),
    password: Yup.string().min(8, 'validacao.curto').required('validacao.obrigatorio'),
  });

  useEffect(() => {
    setShow(props.show)
  }, [props.show])


  async function submit(values) {
    setLoading(true)
    const resp = await WpUser.signUpWithEmail(values, router.locale)
    setResponse({
      success: resp.data.success,
      msg: resp.data.data.msg
    })
    setLoading(false)

    Sweet.fire({
      icon: 'success',
      title: t('bem-vindo')+'!',
      confirmButtonText: t('entrar'),
      didOpen: () => {
        handleClose()
      },
      willClose: () => {
        router.push('/login')
      }
    })
  }

  function handleClose() {
    setShow(false)
    setResponse({success: false, msg: ''})
    onDismiss && onDismiss()
  }

  return (<Modal show={show} onHide={handleClose} size="sm" centered>
    <Modal.Header closeButton>
      <Modal.Title>{t('cadastro.com-email')}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Formik
        initialValues={{
          username: '', password: ''
        }}
        validationSchema={LoginSchema}
        onSubmit={submit}
      >
        {({errors, touched, values, isValid}) => (
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
            <LoadingButton disable={!isValid} loading={loading}>{t('cadastro.cadastrar')}</LoadingButton>
          </Form>
        )}
      </Formik>
      {response?.msg && <div className={`alert ${response?.success ? 'alert-success' : 'alert-danger'} mb-0 mt-3`}>
        {response?.msg}
      </div>}

    </Modal.Body>
  </Modal>)
}
