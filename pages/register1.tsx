import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Head from "next/head";
import {getGenres, siteTitle} from "../src/helpers";
import {useQueryClient} from "react-query";
import Card from "react-bootstrap/cjs/Card";
import ClearLayout from "../components/layout/clear";
import {Field, Form, Formik} from "formik";
import useTrans from "../components/hooks/useTrans";
import {countries} from "../src/countries";
import * as Yup from "yup";
import WpUser from "../src/http/wp-user";
import React, {useEffect, useState} from "react";
import Error from "../src/resources/error";
import Curtain from "../components/ui/curtain";
import Text from "../components/ui/form/formik/text";
import Select from "../components/ui/form/formik/select";
import Mask from "../components/ui/form/formik/mask";
import privateRoute from "../components/hoc/private-route";
import useEvent from "../components/hooks/useEvent";
import Switch from "../components/ui/form/formik/switch";
import LoadingButton from "../components/ui/loading-button";
import Loading from "../components/ui/loading";


const Register1 = () => {

  const t = useTrans()
  const router = useRouter()
  const queryClient = useQueryClient()
  const {authLoading, user, refetch} = useCurrentUser()
  const [loading, setLoading] = useState(false)
  const [firstAccess, setFirstAccess] = useState(false)
  const [response, setResponse] = useState({success: null, msg: ''})
  const {data: event} = useEvent()
  const edition = event && event.currentEdition()
  const lang = router.locale
// console.log(edition)
  useEffect(()=>{
    if(router.query?.fa){
      setFirstAccess(true)
    }
  }, [router.query])

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
    firstName: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
    lastName: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
    badge_name: Yup.string().min(5, 'validacao.curto').required('validacao.obrigatorio'),
    cellphone: Yup.string().min(15, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    // phone: Yup.string().min(14, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    birthdate: Yup.string().min(8, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    gender: Yup.string().required('validacao.obrigatorio'),
    allow_newsletter: Yup.boolean(),
    agreedTerms: Yup.boolean().oneOf([true], 'validacao.obrigatorio')
  });

  async function handleSubmit(values) {
    values.databaseId = user.getId()
    values.email = user.getUserData().email
    values._context = 'register1'
    // console.log({values});
    setLoading(true)
    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)
      setResponse({success, msg: data.msg})
      success === false && dismissAlert()
      if (success) {
        refetch()
        if(edition.subscription.allowed && !firstAccess) router.push(`/register2`)
        else router.push('/dashboard')
      }

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

  if (authLoading) {
    return (<ClearLayout>
      <Loading vspace={80}/>
    </ClearLayout>)
  }

  return (<ClearLayout>
    <Head>
      <title>{siteTitle('Cadastro', queryClient)}</title>
    </Head>
    <div className="row">
      <div className="col-12 col-lg-10 offset-lg-1">
        <Formik
          initialValues={{
            country: user.getUserData().country || 'BR',
            cpf: user.getUserData().cpf || '',
            passport: user.getUserData().passport || '',
            firstName: user.getUserData().firstName || '',
            lastName: user.getUserData().lastName || '',
            email: user.getUserData().email || '',
            alt_email: user.getUserData().alt_email || '',
            badge_name: user.getUserData().badge_name || '',
            cellphone: user.getUserData().cellphone || '',
            phone: user.getUserData().phone || '',
            birthdate: user.getUserData().birthdate || '',
            gender: user.getUserData().gender || 'M',
            institution_name: user.getUserData().institution_name,
            institution_occupation: user.getUserData().institution_occupation,
            allow_newsletter: user.getUserData().allow_newsletter || false,
            agreedTerms: event?.page?.lgpd[lang].length === 0,  // if there is no url, set to true
            is_pdc: user.getUserData()?.is_pdc ? String(Number(user.getUserData().is_pdc)) : '0',
            pdc_needs: user.getUserData()?.pdc_needs || '',
            is_child_care: user.getUserData()?.is_child_care ? String(Number(user.getUserData().is_child_care)) : '0'
          }}
          onSubmit={handleSubmit}
          validationSchema={FormSchema}
        >{({errors, touched, values, isValid, handleBlur, handleChange}) => (
          <Form>
            <Card>
              <Card.Body>
                <h3 className="page-title">{t('cadastro.confirme-seus-dados-basicos')}</h3>
                <p className="text-xs">* {t('validacao.obrigatorio')}</p>

                <div className="row">
                  <Select name="country" label={t('cadastro.nacionalidade')} required containerClass="col-12 col-md">
                    {countries.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))}
                  </Select>
                  {values.country === 'BR' &&
                  <Mask name="cpf" label="CPF" mask="999.999.999-99" containerClass="col-12 col-md" required/>}
                  {values.country !== 'BR' &&
                  <Text name="passport" label={t('cadastro.passaporte')} containerClass="col-12 col-md" required/>}
                </div>
                {/*row*/}

                <div className="row">
                  <Text name="firstName" label={t('cadastro.nome')} required containerClass="col-12 col-md"/>
                  <Text name="lastName" label={t('cadastro.sobrenome')} required containerClass="col-12 col-md"/>
                </div>

                <div className="row">
                <Text name="email" label={`E-mail`} disabled containerClass="col-12 col-md"/>
                <Text name="alt_email" label={t('cadastro.email-alternativo')} containerClass="col-12 col-md"/>
                </div>

                <Text name="badge_name" label={t('cadastro.nome-cracha')} required/>

                <div className="row">
                  <Mask name="cellphone" mask="(99) 99999-9999" label={t('cadastro.celular')} required
                        containerClass="col-12 col-md"/>
                  <Mask name="phone" mask="99) 9999-9999" label={t('cadastro.telefone')}
                        containerClass="col-12 col-md"/>
                </div>

                <div className="row">
                  <Mask name="birthdate" mask="99/99/9999" label={t('cadastro.nascimento')} required
                        containerClass="col-12 col-md"/>
                  <Select name="gender" label={t('cadastro.genero')} required containerClass="col-12 col-md">
                    {getGenres().map(g => (<option key={g.value} value={g.value}>{t(g.name)}</option>))}
                  </Select>
                </div>

                <fieldset className="border p-3 mb-3">
                  <legend className="px-2 text-sm w-auto">Acessibilidade</legend>
                  <div className="row">
                    <Select name="is_pdc" label="É pessoa com deficiência (PCD)?" containerClass="col-12 col-md-4">
                      <option value="0">{t('nao')}</option>
                      <option value="1">{t('sim')}</option>
                    </Select>

                    <Select name="is_child_care" label="Necessita de sala de apoio para amamentação ou outros cuidados com crianças?" containerClass="col-12 col-md">
                      <option value="0">{t('nao')}</option>
                      <option value="1">{t('sim')}</option>
                    </Select>
                  </div>
                  {values.is_pdc === '1' &&
                  <div className="row">
                    <Text name="pdc_needs" label="Necessita de alguma técnica assistiva (recursos específicos) para acessar o congresso? Se sim, qual?" containerClass="col-12 col-md"/>
                  </div>}

                </fieldset>


                <div className="row">
                  <Text name="institution_name" label={t('cadastro.instituicao.nome')} required containerClass="col-12 col-md"/>
                  <Text name="institution_occupation" label={t('cadastro.ocupacao')} required containerClass="col-12 col-md"/>
                </div>

                <Switch name="allow_newsletter" label={t('cadastro.aceita-compartinhar-email')}/>
                {event.page.lgpd[lang] &&
                <Switch name="agreedTerms" label={<span>Você concorda com os <a href={event.page.lgpd[lang]} target="_blank">Termos de Serviço</a>?</span>}/>}


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
                                   className=" px-5">{t('continuar')}</LoadingButton>
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

export default privateRoute(Register1)
