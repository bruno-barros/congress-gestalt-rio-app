import useTrans from "../hooks/useTrans";
import React, {useEffect, useRef, useState} from "react";
import {StepProps} from "./registration.d";
import {Form, Formik} from "formik";
import Text from "../ui/form/formik/text";
import Select from "../ui/form/formik/select";
import {states} from "../../src/helpers";
import Curtain from "../ui/curtain";
import {useDispatch} from "react-redux";
import * as Yup from "yup";
import {blockUi} from "../../src/store/ui.actions";
import WpUser from "../../src/http/wp-user";
import {errorNotification} from "../../src/resources/responses";
import {useRouter} from "next/router";


export default function StepInstitution(props: StepProps) {

  const {step, user, event, edition, onLoading, goNext, goPrev, formInstance} = props
  const t = useTrans()
  const router = useRouter()
  const disp = useDispatch()
  const [response, setResponse] = useState({success: null, msg: ''})
  const form = useRef(null)
  const FormSchema = Yup.object().shape({
    institution_name: Yup.string().notRequired(),
    institution_occupation: Yup.string().notRequired(),
    institution_email: Yup.string().notRequired(),
    institution_phone: Yup.string().notRequired(),
  });

  useEffect(() => {
    formInstance(form.current)
    return ()=> formInstance(null)
  }, [])

  function dismissMessage() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  async function handleSubmit(values) {
    values.databaseId = user.getId()
    values.locale = user.getUserData().locale
    values.email = user.getUserData().email
    disp(blockUi(true))

    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      disp(blockUi(false))
      if (!success) {
        setResponse({success, msg: data.msg})
        dismissMessage()
      } else goNext()

    } catch (err) {
      disp(blockUi(false))
      errorNotification({error: err})
    }
  }

  return (<div className="px-md-5 py-md-3">
    <h3 className="mb-3 pb-2 border-bottom">{step[router.locale]} <small>({t('opcional')})</small></h3>
    {/*<button onClick={goPrev}>voltar</button>*/}
    {/*<button onClick={goNext}>avançar</button>*/}
    <Formik
      innerRef={form}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
      initialValues={{
        institution_name: user.getUserData().institution_name,
        institution_occupation: user.getUserData().institution_occupation,
        institution_email: user.getUserData().institution_email,
        institution_phone: user.getUserData().institution_phone,
      }}
    >{({errors, values, touched, isValid, setFieldValue}) => (
      <Form>
        <Text name="institution_name" label={t('cadastro.instituicao.nome')} containerClass=""/>
        <div className="row">
          <Text name="institution_email" label={`E-mail`} containerClass="col-12 col-md-6"/>
          <Text name="institution_phone" label={t('cadastro.telefone')} containerClass="col-12 col-md-6"/>
        </div>
        <Text name="institution_occupation" label={t('cadastro.ocupacao')} containerClass=""/>

        {response.msg && <Curtain isOpened={response.msg?.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-danger'}`}>
            {response.msg}
          </div>
        </Curtain>}
      </Form>
    )}</Formik>
  </div>)

}
