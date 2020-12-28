import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Head from "next/head";
import {getGenres, inputFloatClass, siteTitle} from "../src/helpers";
import {useQueryClient} from "react-query";
import Card from "react-bootstrap/cjs/Card";
import ClearLayout from "../components/layout/clear";
import {Field, Form, Formik} from "formik";
import FieldError from "../components/ui/form/field-error";
import useTrans from "../components/hooks/useTrans";
import {countries} from "../src/countries";
import InputMask from "react-input-mask";
import * as Yup from "yup";
import {LoadingButton} from '@brunobarros/react-components'
import WpUser from "../src/http/wp-user";
import {useState} from "react";
import Error from "../src/resources/error";
import Curtain from "../components/ui/curtain";
import {Loading} from "@brunobarros/react-components";


const Register1 = () => {

  const t = useTrans()
  const router = useRouter()
  const queryClient = useQueryClient()
  const {authLoading, user} = useCurrentUser()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState({success: null, msg: ''})

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


  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  if(authLoading){
    return (<ClearLayout>
      <Loading vspace={80}/>
    </ClearLayout>)
  }

  return (<ClearLayout>
    <Head>
      <title>{siteTitle('Cadastro', queryClient)}</title>
    </Head>
    <div className="row">
      <div className="col-12">
        <Formik
          initialValues={{
            country: user.getUserData().country || 'BR',
            cpf: user.getUserData().cpf || '',
            passport: user.getUserData().passport || '',
            first_name: user.getUserData().firstName || '',
            last_name: user.getUserData().lastName || '',
            badge_name: user.getUserData().badge_name || '',
            cellphone:   user.getUserData().cellphone || '',
            phone: user.getUserData().phone || '',
            birthdate: user.getUserData().birthdate || '',
            gender: user.getUserData().gender || 'M',
          }}
          onSubmit={handleSubmit}
          validationSchema={FormSchema}
        >{({errors, touched, values, isValid, handleBlur, handleChange}) => (
          <Form>
            <Card>
              <Card.Body>
                <h3 className="page-title">{t('cadastro.confirme-seus-dados-basicos')}</h3>


                <div className="row">
                  <div className="form-group col-12 col-md">
                    <label htmlFor="country">{t('cadastro.nacionalidade')}</label>
                    <Field id="country" name="country" className="form-control" placeholder="" component="select">{
                      countries.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))
                    }
                    </Field>
                    <FieldError message={touched?.country && errors?.country} fieldId="country"/>
                  </div>
                  {values.country === 'BR' && <div className="form-group col-12 col-md">
                    <label htmlFor="cpf">CPF</label>
                    <Field name="cpf">{({field, form, meta}) => (<InputMask
                      mask="999.999.999-99" maskChar="" alwaysShowMask={false}
                      id="cpf"
                      placeholder="000.000.000-00"
                      className="form-control"
                      value={values.cpf}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />)}</Field>
                    <FieldError message={touched?.cpf && errors?.cpf} fieldId="cpf"/>
                  </div>}
                  {values.country !== 'BR' && <div className="form-group col-12 col-md">
                    <label htmlFor="passport">{t('cadastro.passaporte')}</label>
                    <Field id="passport" name="passport" className="form-control" placeholder=""/>
                    <FieldError message={touched?.passport && errors?.passport} fieldId="passport"/>
                  </div>}
                </div>
                {/*row*/}

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

                <div className="form-group">
                  <label htmlFor="badge_name">{t('cadastro.nome-cracha')}</label>
                  <Field id="badge_name" name="badge_name" className="form-control" placeholder=""/>
                  <FieldError message={touched?.badge_name && errors?.badge_name} fieldId="badge_name"/>
                </div>

                <div className="row">
                  <div className="form-group col-12 col-md">
                    <label htmlFor="cellphone">{t('cadastro.celular')}</label>
                    <Field name="cellphone">{({field}) => (<InputMask
                      mask="(99) 99999-9999" maskChar="" alwaysShowMask={false}
                      id="cellphone"
                      placeholder=""
                      className="form-control"
                      value={values.cellphone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />)}</Field>
                    <FieldError message={touched?.cellphone && errors?.cellphone} fieldId="cellphone"/>
                  </div>
                  <div className="form-group col-12 col-md">
                    <label htmlFor="phone">{t('cadastro.telefone')}</label>
                    <Field name="phone">{({field}) => (<InputMask
                      mask="(99) 9999-9999" maskChar="" alwaysShowMask={false}
                      id="phone"
                      placeholder=""
                      className="form-control"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />)}</Field>
                    <FieldError message={touched?.phone && errors?.phone} fieldId="phone"/>
                  </div>
                </div>
                {/*row*/}

                <div className="row">
                  <div className="form-group col-12 col-md">
                    <label htmlFor="birthdate">{t('cadastro.nascimento')}</label>
                    <Field name="birthdate">{({field}) => (<InputMask
                      mask="99/99/9999" maskChar="" alwaysShowMask={false}
                      id="birthdate"
                      placeholder="00/00/0000"
                      className="form-control"
                      value={values.birthdate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />)}</Field>
                    <FieldError message={touched?.birthdate && errors?.birthdate} fieldId="birthdate"/>
                  </div>
                  <div className="form-group col-12 col-md">
                    <label htmlFor="gender">{t('cadastro.genero')}</label>
                    <Field id="gender" name="gender" className="form-control" component="select">
                      {getGenres().map(g => (<option key={g.value} value={g.value}>{t(g.name)}</option>))}
                    </Field>
                    <FieldError message={touched?.gender && errors?.gender} fieldId="gender"/>
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

export default Register1
