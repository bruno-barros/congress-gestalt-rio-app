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
import Error from "../../../src/resources/error";
import {setUpUser} from "../../../src/store/user.actions";
import {useDispatch} from "react-redux";
import Curtain from "../curtain";
import Password from "./formik/password";
import Text from "./formik/text";

interface SignUpProps {
  show: boolean

  onDismiss(): void
}

export default function SignUp(props: SignUpProps) {

  const disp = useDispatch();
  const {onDismiss} = props;
  const [show, setShow] = useState(props.show)
  const [loading, setLoading] = useState(false)
  const [isPassStrong, setIsPassStrong] = useState(false)
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
    let success = false
    let data: any = {}
    try {
      const resp = await WpUser.signUpWithEmail(values, router.locale)
      success = resp.data.success
      data = resp.data?.data
      setLoading(false)
      if (!success) {
        let err = Error.make(data)
        setResponse({success: false, msg: err.message})
        setTimeout(() => {
          setResponse({success: null, msg: ''})
        }, 5000)
      } else {
        disp(setUpUser({
          locale: router.locale,
          user: data?.current_user,
          tokens: {
            access: data?.login?.authToken,
            refresh: data?.login?.refreshToken
          }
        }, () => {

          Sweet.fire({
            icon: 'success',
            title: t('bem-vindo') + '!',
            confirmButtonText: t('entrar'),
            didOpen: () => {
              handleClose()
            },
            willClose: () => {
              data.next_action === 'profile_fase_1' ? router.push('/register1?fa=1') : router.push('/dashboard')
            }
          })


        }))
      }

    } catch (err) {
      let error = Error.make(err)
      setResponse({success: false, msg: error.message})
    }
  }


  function handleClose() {
    setShow(false)
    setLoading(false)
    setResponse({success: false, msg: ''})
    onDismiss && onDismiss()
  }

  return (<Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton className="px-4 px-md-5">
      <Modal.Title>{t('cadastro.com-email')}</Modal.Title>
    </Modal.Header>
    <Modal.Body className="p-4 px-md-5">
      <Formik
        initialValues={{
          username: '', password: ''
        }}
        validationSchema={LoginSchema}
        onSubmit={submit}
      >
        {({errors, touched, values, isValid}) => (
          <Form>
            <Text name="username" label={t('seu-email')} floatLabel/>
            <Password
              name="password" label={t('senha')} floatLabel autoComplete="new-password"
              passwordStrength={(strength, isStrong, reset) => {
                setIsPassStrong(isStrong)
              }}
              validate={(val) => {
                return !isPassStrong ? t('validacao.senha-fraca') : ''
              }}/>
              <div className="-alert -alert-light text-muted text-sm mb-3">
                Faça uma senha forte, use: letras maiúsculas, minúsculas, números e caracteres especiais.
              </div>
            <LoadingButton disable={!isValid} loading={loading}>{t('cadastro.cadastrar')}</LoadingButton>
          </Form>
        )}
      </Formik>

      <Curtain isOpened={response?.msg && !response.success}>
        {(response?.msg && !response.success) &&
        <div className={`alert ${response?.success ? 'alert-success' : 'alert-danger'} mb-0 mt-3`}>
          {response?.msg}
        </div>}
      </Curtain>

    </Modal.Body>
  </Modal>)
}
