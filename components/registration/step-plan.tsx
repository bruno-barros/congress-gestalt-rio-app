import {Field, Form, Formik} from "formik";
import FieldError from "../ui/form/field-error";
import Curtain from "../ui/curtain";
import WpUser from "../../src/http/wp-user";
import Error from "../../src/resources/error";
import * as Yup from "yup";
import useTrans from "../hooks/useTrans";
import {useState} from "react";
import {StepProps} from "./registration.d";


export default function StepPlan(props: StepProps) {


  const {user, event, edition, onLoading, goPrev, goNext} = props
  const t = useTrans()
  const [response, setResponse] = useState({success: null, msg: ''})

  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  const FormSchema = Yup.object().shape({
    country: Yup.string().matches(/[A-Z]{2}/, 'validacao.obrigatorio').required('validacao.obrigatorio'),
    cpf: Yup.string().when('country', {
      is: (val) => val === 'BR',
      then: Yup.string().min(14, 'validacao.formato-invalido').required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    passport: Yup.string().when('country', {
      is: (val) => val !== 'BR',
      then: Yup.string().required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    first_name: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
    last_name: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
    badge_name: Yup.string().min(5, 'validacao.curto').required('validacao.obrigatorio'),
    cellphone: Yup.string().min(15, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    phone: Yup.string().min(14, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    birthdate: Yup.string().min(8, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    gender: Yup.string().required('validacao.obrigatorio'),

  });

  async function handleSubmit(values) {
    values.databaseId = user.getId()
    values.email = user.getUserData().email
    console.log({values});
    onLoading(true)
    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      onLoading(false)
      setResponse({success, msg: data.msg})
      success === false && dismissAlert()
      // success === true && router.push(`/register2`)// TODO

    } catch (err) {
      const error = Error.make(err)
      setResponse({success: false, msg: error.message})
      dismissAlert()
      onLoading(false)
    }

  }

  return (<div className="">
    <h2>Plano</h2>
    <Formik
      initialValues={{
        country: 'BR',
        cpf: '',
        passport: '',
        first_name: '',
        last_name: '',
        badge_name: '',
        cellphone: '',
        phone: '',
        birthdate: '',
        gender: 'M',
      }}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >{({errors, touched, values, isValid, handleBlur, handleChange}) => (
      <Form>

        <button onClick={goNext}>avançar</button>
        <h3 className="page-title">TODO</h3>

        <div className="row">
          <div className="form-group col-12 col-md">
            <label htmlFor="first_name">{t('cadastro.nome')}</label>
            <Field id="first_name" name="first_name" className="form-control" placeholder=""/>
            <FieldError message={touched?.first_name && errors?.first_name} fieldId="first_name"/>
          </div>
          <div className="form-group col-12 col-md">
            <label htmlFor="last_name">{t('cadastro.sobrenome')}</label>
            <Field id="last_name" name="last_name" className="form-control" placeholder=""/>
            <FieldError message={touched?.last_name && errors?.last_name} fieldId="last_name"/>
          </div>
        </div>
        {/*row*/}

        {response.msg && <Curtain isOpened={response.msg?.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-danger'}`}>
            {response.msg}
          </div>
        </Curtain>}


      </Form>
    )}</Formik>
  </div>)

}
