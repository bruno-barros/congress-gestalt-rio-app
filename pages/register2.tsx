import ClearLayout from "../components/layout/clear";
import {getGenres, siteTitle} from "../src/helpers";
import Head from "next/head";
import {useQueryClient} from "react-query";
import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import {useState} from "react";
import * as Yup from "yup";
import WpUser from "../src/http/wp-user";
import Error from "../src/resources/error";
import {Field, Form, Formik} from "formik";
import Card from "react-bootstrap/cjs/Card";
import {countries} from "../src/countries";
import FieldError from "../components/ui/form/field-error";
import InputMask from "react-input-mask";
import Curtain from "../components/ui/curtain";
import {LoadingButton} from "@brunobarros/react-components";
import useTrans from "../components/hooks/useTrans";
import {MultiStepForm, Step}  from 'react-multi-form'


const Register2 = () => {

  const t = useTrans()
  const queryClient = useQueryClient()
  const router = useRouter()
  const {authLoading, user} = useCurrentUser()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({success: null, msg: ''})
  const [step, setStep] = useState(1)

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
    setLoading(true)
    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)
      setResponse({success, msg: data.msg})
      success === false && dismissAlert()
      success === true && router.push(`/register2`)// TODO

    } catch (err) {
      const error = Error.make(err)
      setResponse({success: false, msg: error.message})
      dismissAlert()
      setLoading(false)
    }

  }

  function handlePostpone(e) {
    e.preventDefault()
    router.push(`/dashboard`)
  }


  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  return (<ClearLayout>
    <Head>
      <title>{siteTitle('Inscrição', queryClient)}</title>
    </Head>
    <div className="row">
      <div className="col-12">
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
            <div className="multi-steps">
              <MultiStepForm activeStep={step} accentColor="var(--primary)">
                <Step label="Plano"/>
                <Step label="Dados pessoais"/>
                <Step label="Endereço"/>
                <Step label="Instituição"/>
                <Step label="Pagamento"/>
              </MultiStepForm>
            </div>


            <Card>
              <Card.Body>
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


              </Card.Body>
              <Card.Footer className="p-0 border-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="px-4 py-2">
                    <span className="text-muted"></span>
                  </div>
                  <div className="btn-group btn-group-lg end" role="group">
                    <button onClick={handlePostpone} type="button"
                            className="btn btn-outline-secondary border-0 px-5">Fazer depois
                    </button>
                    <LoadingButton variant="primary" loading={loading} disable={!isValid}
                                   className=" px-5">Continuar</LoadingButton>
                  </div>
                </div>

              </Card.Footer>
            </Card>
          </Form>
        )}</Formik>
      </div>
    </div>
  </ClearLayout>)
}

export default Register2
