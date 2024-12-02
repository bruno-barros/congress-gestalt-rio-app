import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Head from "next/head";
import { getGenres, siteTitle, getRaces, dump } from '../src/helpers';
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
import useSettings from "../components/hooks/useSettings";
import Phone from "../components/ui/form/formik/phone";
import Checkboxes from "../components/ui/form/formik/checkboxes";


const Register1 = () => {

  const t = useTrans()
  const router = useRouter()
  const queryClient = useQueryClient()
  const {authLoading, user, refetch} = useCurrentUser()
  const [loading, setLoading] = useState(false)
  const [firstAccess, setFirstAccess] = useState(false)
  const [response, setResponse] = useState({success: null, msg: ''})
  // const {data: event} = useEvent()
  // const edition = event && event.currentEdition()
  const {data: event, currentEdition: edition} = useSettings()
  const namingType: 'fullname'|'first-last'|string = 'fullname'; 
  
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
    fullName: Yup.string().when('country', {
      is: (v) => namingType === 'fullname',
      then: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    firstName: Yup.string().when('country', {
      is: (v) => namingType === 'first-last',
      then: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    lastName: Yup.string().when('country', {
      is: (v) => namingType === 'first-last',
      then: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    // firstName: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
    // lastName: Yup.string().min(2, 'validacao.curto').required('validacao.obrigatorio'),
    badge_name: Yup.string().min(5, 'validacao.curto').required('validacao.obrigatorio'),
    cellphone: Yup.string().min(15, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    // phone: Yup.string().min(14, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    birthdate: Yup.string().min(8, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    gender: Yup.string().required('validacao.obrigatorio'),
    // allow_newsletter: Yup.boolean(),
    agreedTerms: Yup.object().shape({
      truthy: Yup.boolean().oneOf([true], 'validacao.obrigatorio'),
      image: Yup.boolean().oneOf([true], 'validacao.obrigatorio'),
      terms: Yup.boolean().oneOf([true], 'validacao.obrigatorio')
    })
  });

  async function handleSubmit(values) {
    values.databaseId = user.getId()
    values.email = user.getUserData().email
    values._context = 'register1'
    if(namingType === 'fullname'){
      // break the name by space, and set the first word as first name and the rest as last name
      const name = values.fullName.split(' ')
      values.firstName = name[0]
      values.lastName = name.slice(1).join(' ')
      delete values.fullName
    }
    // console.log({values});
    setLoading(true)
    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      const isAffirmative = values.is_affirmative_action === '1'
      setLoading(false)
      setResponse({success, msg: data.msg})
      success === false && dismissAlert()
      if (success) {
        refetch()
        if(isAffirmative){router.push(`/register3`)}
        else if(edition.Subscription().isAllowed() && !firstAccess) router.push(`/register2`)
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
            fullName: user.getFullName() || '',
            firstName: user.getUserData().firstName || '',
            lastName: user.getUserData().lastName || '',
            email: user.getUserData().email || '',
            alt_email: user.getUserData().alt_email || '',
            badge_name: user.getUserData().badge_name || '',
            social_name: user.getUserData().social_name || '',
            cellphone: user.getUserData().cellphone || '',
            cellphone_country: user.getUserData().cellphone_country || '55',
            phone: user.getUserData().phone || '',
            phone_country: user.getUserData().phone_country || '55',
            birthdate: user.getUserData().birthdate || '',
            gender: user.getUserData().gender || 'M',
            race: user.getUserData().race || '',
            education: user.getUserData().education || '',
            has_institution: user.getUserData().has_institution || '0',
            abg_member: user.getUserData().abg_member || '0',
            institution_name: user.getUserData().institution_name,
            institution_occupation: user.getUserData().institution_occupation,
            allow_newsletter: user.getUserData().allow_newsletter || false,
            agreedTerms: {
              truthy: false,
              image: false,
              terms: edition?.getLgpdUrl(lang).length === 0 // if there is no url, set to true
            }, 
            is_pdc: user.getUserData()?.is_pdc ? String(Number(user.getUserData().is_pdc)) : '0',
            pdc_needs: user.getUserData()?.pdc_needs || '',
            is_child_care: user.getUserData()?.is_child_care ? String(Number(user.getUserData().is_child_care)) : '0',
            child_care_needs: user.getUserData()?.child_care_needs || '',
            is_affirmative_action: user.getUserData()?.is_affirmative_action || '0',
            affirmative_action: user.getUserData()?.affirmative_action || '',
            // apply_affirmative_action: user.getUserData()?.apply_affirmative_action || '0',
            is_artist: user.getUserData()?.is_artist || '0',
            is_artist_volunteer: user.getUserData()?.is_artist_volunteer || '0',
            artistic_skill: user.getUserData()?.artistic_skill || '',
            languages: user.getUserData()?.languages || []
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

                {namingType === 'fullname' && 
                <div className="row">
                  <Text name="fullName" label={t('cadastro.nome-completo')} required containerClass="col-12 col-md"/>
                </div>}
                {namingType === 'first-last' && 
                <div className="row">
                  <Text name="firstName" label={t('cadastro.nome')} required containerClass="col-12 col-md"/>
                  <Text name="lastName" label={t('cadastro.sobrenome')} required containerClass="col-12 col-md"/>
                </div>}
                

                <div className="row">
                <Text name="email" label={`E-mail`} disabled containerClass="col-12 col-md"/>
                <Text name="alt_email" label={t('cadastro.email-alternativo')} containerClass="col-12 col-md"/>
                </div>

                <div className="row">
                  <Text name="badge_name" label={t('cadastro.nome-cracha')} containerClass="col-12 col-md" required />
                  <Text name="social_name" label={t('cadastro.social_name')} containerClass="col-12 col-md"/>
                </div>



                <div className="row">
                  <Phone name="cellphone" countryName="cellphone_country" mask="(99) 99999-9999" label={t('cadastro.celular')} required
                        containerClass="col-12 col-md"/>
                  <Phone name="phone" countryName="phone_country" mask="(99) 9999-9999" label={t('cadastro.telefone')}
                        containerClass="col-12 col-md"/>
                </div>

                <div className="row">
                  <Mask name="birthdate" mask="99/99/9999" label={t('cadastro.nascimento')} required
                        containerClass="col-12 col-md" placeholder="xx/xx/xxxx"/>
                  <Select name="gender" label={t('cadastro.genero')} required containerClass="col-12 col-md">
                    {getGenres().map(g => (<option key={g.value} value={g.value}>{t(g.name)}</option>))}
                  </Select>
                  <Select name="race" label={t('cadastro.raca')} required containerClass="col-12 col-md">
                    {getRaces().map(g => (<option key={g.value} value={g.value}>{t(`raca.${g.name}`)}</option>))}
                  </Select>
                </div>

                <fieldset className="border p-3 mb-3 bg-light">
                  <legend className="px-2 text-sm w-auto"><strong>Ações Afirmativas</strong></legend>
                  <div className="row">
                    <Select name="is_affirmative_action" label="Deseja participar do edital das vagas de Ações afirmativas?" containerClass="col-12 col-md-6">
                      <option value="0">{t('nao')}</option>
                      <option value="1">{t('sim')}</option>
                    </Select>

                    <Select name="affirmative_action" label="Que tipo de Ação Afirmativa?" containerClass="col-12 col-md" disabled={values.is_affirmative_action === '0'}>
                      <option value="" disabled>Selecione</option>
                      <option value="Pessoa negra (pretos e pardos)">Pessoa negra (pretos e pardos)</option>
                      <option value="Indígena">Indígena</option>
                      <option value="Trans">Trans</option>
                      <option value="Travesti">Travesti</option>
                      <option value="Pessoa com deficiência">Pessoa com deficiência</option>
                    </Select>
                  </div>
                  
                  <div className="row">
                    {/* <Select name="apply_affirmative_action" label="Deseja participar do edital para concorrer às vagas das ações afirmativas?" containerClass="col-12">
                      <option value="0">{t('nao')}</option>
                      <option value="1">{t('sim')}</option>
                    </Select> */}
                    {values.is_affirmative_action == '1' && 
                    <div className="col-12"><div className="badge text-danger">É obrigatório o envio de documentos e/ou autodeclaração que comprove sua identidade.</div></div>}
                    
                  </div>

                  {/* {dump(values)} */}

                </fieldset>
                
                <fieldset className="border p-3 mb-3 bg-light">
                  <legend className="px-2 text-sm w-auto"><strong>Acessibilidade</strong></legend>
                  <div className="row">
                    <Select name="is_pdc" label="É pessoa com deficiência (PCD)?" containerClass="col-12 col-md-4">
                      <option value="0">{t('nao')}</option>
                      <option value="1">{t('sim')}</option>
                    </Select>          
                    <Text name="pdc_needs" label="Necessita de alguma assistência ou recurso para acessar o congresso? Qual?" containerClass="col-12 col-md" disabled={values.is_pdc === '0'}/>
                    
                  </div>
                  {/* <div className="row">
                    <Select name="is_child_care" label="Necessita de apoio para criança menor?" containerClass="col-12 col-md-4">
                      <option value="0">{t('nao')}</option>
                      <option value="1">{t('sim')}</option>
                    </Select>
                                     
                    <Select name="child_care_needs" label="Gostaria de levar minha(meu) filha(o) ao Congresso sob supervisão de um recreador/cuidador." containerClass="col-12 col-md"  disabled={values.is_child_care === '0'}>
                      <option value="De zero a um ano">De zero a um ano</option>
                      <option value="De dois a cinco anos">De dois a cinco anos</option>
                      <option value="De seis a sete anos">De seis a sete anos</option>
                      <option value="Acima de oito anos">Acima de oito anos</option>
                      </Select>
                  </div> */}
                </fieldset>
                
                {/* <fieldset className="border p-3 mb-3 bg-light">
                  <legend className="px-2 text-sm w-auto"><strong>Habilidades artísticas</strong></legend>
                  <div className="row">
                    <Select name="is_artist" label="Você tem habilidades artísticas?" containerClass="col-12 col-md-3">
                      <option value="0">{t('nao')}</option>
                      <option value="1">{t('sim')}</option>
                    </Select>
                    <Select name="is_artist_volunteer" label="Deseja participar como voluntário?" containerClass="col-12 col-md-3" disabled={values.is_artist === '0'}>
                      <option value="0">{t('nao')}</option>
                      <option value="1">Ofereço minha participação voluntária</option>
                      <option value="Orçamento">Posso oferecer meu trabalho mediante orçamento prévio</option>
                    </Select>                                     
                    <Text name="artistic_skill" label="Tenho habilidade artística na seguinte área:" containerClass="col-12 col-md" disabled={values.is_artist === '0'}/>                    
                  </div>
                </fieldset> */}

                <fieldset className="border p-3 mb-3 bg-light">
                  <legend className="px-2 text-sm w-auto"><strong>Linguagem</strong></legend>
                  <div className="row_">
                    <Checkboxes name="languages" label="" options={[
                      {value: 'Fluência em espanhol e posso traduzir exposição', label: 'Tenho fluência em espanhol e posso voluntariamente traduzir uma exposição para o português.'},
                      {value: 'Fluência em português e posso traduzir exposição', label: 'Tenho fluência em português e posso traduzir uma exposição para o espanhol.'},
                      {value: 'LIBRAS e posso traduzir', label: 'Tenho domínio da Língua Brasileira de Sinais (LIBRAS) e posso voluntariamente interpretar uma exposição.'}
                    ]} />       
                  </div>
                </fieldset>

                {/* {dump(values)} */}

                <h3 className="page-title mt-5">{t('cadastro.dados-profissionais')}</h3>
                <p className="text-xs">* {t('validacao.obrigatorio')}</p>

                <Select name="education" label={t('cadastro.escolaridade')} required>
                  <option value="" selected disabled>Selecione uma opção</option>
                  <option value="estudante graduacao">Estudante de graduação</option>
                  <option value="estudante pos-graduacao">Estudante de pós-graduação</option>
                  <option value="estudante especializacao">Estudante de especialização</option>
                  <option value="profissional">Profissional</option>
                </Select>

                <Switch name="abg_member" label={lang==='pt' ? 'Sou associada/o/e à ABG e me encontro adimplente com todas as minhas anuidades.' : 'Soy miembro de ABG y cumplo con todas mis cuotas anuales.'}/>

                <Switch name="has_institution" label={t('cadastro.tem_instituicao')} />
                
                <div className="row">
                  <Text name="institution_name" label={t('cadastro.instituicao.nome')} containerClass="col-12 col-md" disabled={!values.has_institution}/>
                  <Select name="institution_occupation" label={t('cadastro.ocupacao')} containerClass="col-12 col-md" disabled={!values.has_institution}>
                    <option value="" selected disabled>Selecione uma opção</option>
                    <option value="Docente">Docente</option>
                    <option value="Colaborador/a/e">Colaborador/a/e</option>
                    <option value="Estudante de graduação">Estudante de graduação</option>
                    <option value="Estudante de pós-graduação">Estudante de pós-graduação</option>
                    <option value="Estudante de especializacao">Estudante de especialização</option>
                  </Select>
                </div>
                

                <hr />
                {/* {dump(values.agreedTerms)} */}
                <Switch name="agreedTerms.truthy" label={lang==='pt'?'Declaro que todas as informações acima são verdadeiras e estou disponível para comprovar todos os dados.':'Declaro que toda la información anterior es cierta y estoy disponible para confirmar todos los datos.'}/>
                <Switch name="agreedTerms.image" label={lang==='pt'?'Autorizo o uso da minha imagem nas atividades do congresso.':'Autorizo ​​el uso de mi imagen en las actividades del congreso.'}/>
                {/* <Switch name="allow_newsletter" label={t('cadastro.aceita-compartinhar-email')}/> */}
                {edition.getLgpdUrl(lang) &&
                <Switch name="agreedTerms.terms" label={<span>Você concorda com os <a href={edition.getLgpdUrl(lang)} target="_blank">Termos de Serviço</a>?</span>}/>}


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
