import useTrans from "../hooks/useTrans";
import React, {useEffect, useRef, useState} from "react";
import {StepProps} from "./registration.d";
import {Form, Formik, FormikProps} from "formik";
import * as Yup from "yup";
import Text from "../ui/form/formik/text";
import Select from "../ui/form/formik/select";
import {states} from "../../src/helpers";
import WpUser from "../../src/http/wp-user";
import {useDispatch} from "react-redux";
import {blockUi} from "../../src/store/ui.actions";
import {errorNotification} from "../../src/resources/responses";
import Curtain from "../ui/curtain";
import useCurrentUser from "../hooks/useCurrentUser";
import {useRouter} from "next/router";


export default function StepAddress(props: StepProps) {

  const {step, event, edition, onLoading, goNext, goPrev, formInstance} = props
  const t = useTrans()
  const router = useRouter()
  const disp = useDispatch()
  const {user, refetch} = useCurrentUser()
  const [response, setResponse] = useState({success: null, msg: ''})
  const form = useRef<FormikProps<any>>(null)
  const FormSchema = Yup.object().shape({
    postcode: Yup.string().min(8, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    state: Yup.string().required('validacao.obrigatorio'),
    city: Yup.string().required('validacao.obrigatorio'),
    neighborhood: Yup.string().required('validacao.obrigatorio'),
    address: Yup.string().required('validacao.obrigatorio'),
    number: Yup.string().required('validacao.obrigatorio'),
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
    values._context = 'address'
    disp(blockUi(true))

    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      disp(blockUi(false))
      if (!success) {
        setResponse({success, msg: data.msg})
        dismissMessage()
      } else {
        refetch()
        // form.current.initialTouched()
        goNext()
      }

    } catch (err) {
      disp(blockUi(false))
      errorNotification({error: err})
    }
  }


  return (<div className="px-md-5 py-md-3">
    <h3 className="mb-3 pb-2 border-bottom">{step[router.locale]}</h3>
    {/*<button onClick={goPrev}>voltar</button>*/}
    {/*<button onClick={goNext}>avançar</button>*/}
    <Formik
      key={JSON.stringify(user.getUserData())}
      innerRef={form}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
      initialValues={{
        postcode: user.getUserData().postcode || '',
        state: user.getUserData().state || '',
        city: user.getUserData().city || '',
        neighborhood: user.getUserData().neighborhood || '',
        address: user.getUserData().address || '',
        number: user.getUserData().number || '',
        complement: user.getUserData().complement,
      }}
    >{({errors, values, touched, isValid, setFieldValue}) => (
      <Form>
        <div className="row">
          <Text name="postcode" label={t('cadastro.cep')} required containerClass="col-12 col-md-4"
                cepCallback={(data) => {
                  if (data) {
                    setFieldValue('address', data.address)
                    setFieldValue('city', data.city)
                    setFieldValue('neighborhood', data.neighborhood)
                    setFieldValue('state', data.state)
                  }
                }}/>
        </div>
        <div className="row">
          {user.getUserData().country !== 'BR'
            ? <Text name="state" label={t('cadastro.estado')} required containerClass="col-12 col-md-4"/>
            : <Select name="state" label={t('cadastro.estado')} required containerClass="col-12 col-md-4">
              {states().map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>}
          <Text name="city" label={t('cadastro.cidade')} required containerClass="col-12 col-md-4"/>
          <Text name="neighborhood" label={t('cadastro.bairro')} required containerClass="col-12 col-md-4"/>
        </div>
        <Text name="address" label={t('cadastro.logradouro')} required containerClass=""/>
        <div className="row">
          <Text name="number" type="number" label={t('cadastro.numero')} required containerClass="col-12 col-md-6"/>
          <Text name="complement" type="text" label={t('cadastro.complemento')} containerClass="col-12 col-md-6"/>
        </div>
        {response.msg && <Curtain isOpened={response.msg?.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-danger'}`}>
            {response.msg}
          </div>
        </Curtain>}
      </Form>
    )}</Formik>
  </div>)

}
