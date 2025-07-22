import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
import {MapRoles, User} from "../../src/resources/user";
import {countries} from "../../src/countries";
import useTrans from "../hooks/useTrans";
import Text from "../ui/form/formik/text";
import Select from "../ui/form/formik/select";
import Mask from "../ui/form/formik/mask";
import {dump, getGenres, getRaces, MapLocales, states} from "../../src/helpers";
import * as Yup from "yup";
import WpUser from "../../src/http/wp-user";
import {errorNotification, successNotification} from "../../src/resources/responses";
import useAllUsers from "../hooks/useAllUsers";
import Textarea from "../ui/form/formik/textarea";
import useCurrentUser from "../hooks/useCurrentUser";
import Switch from "../ui/form/formik/switch";
import Card from "react-bootstrap/cjs/Card";
import LoadingButton from "../ui/loading-button";
import Ac from "../access-control";
import { REQUIREMENTS } from "../access-control/requirements";
import Phone from "../ui/form/formik/phone";
import { useRouter } from "next/router";
import useSettings from "../hooks/useSettings";
import useUserDocuments from "../hooks/useUserDocuments";

interface ProfileFormProps {
  user: User
  editingMode?: 'user' | 'admin'
}

export default function ProfileForm(props: ProfileFormProps) {

  const t = useTrans()
  const {user, editingMode} = props
  const {refetch: refreshUsers} = useAllUsers()
  const {refetch: refreshMySelf, user: auth} = useCurrentUser()
  const [loading, setLoading] = useState(false)
  let isRequired = !auth.isAdmin()
  const {data: event, currentEdition: edition} = useSettings()
  const {data: documents, isLoading: docLoading} = useUserDocuments(user.getId())
  const router = useRouter()
  const lang = router.locale
  const FormSchema = !isRequired ? null : Yup.object().shape({
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
    badge_name: Yup.string().when('firstName', {
      is: () => editingMode === 'admin',
      then: Yup.string().notRequired(),
      otherwise: Yup.string().min(5, 'validacao.curto').required('validacao.obrigatorio')
    }),
    cellphone: Yup.string().min(15, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    // phone: Yup.string().min(14, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    birthdate: Yup.string().min(8, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    gender: Yup.string().required('validacao.obrigatorio'),
    description: Yup.string().notRequired(),
    postcode: Yup.string().required('validacao.obrigatorio'),
    state: Yup.string().required('validacao.obrigatorio'),
    city: Yup.string().required('validacao.obrigatorio'),
    neighborhood: Yup.string().required('validacao.obrigatorio'),
    address: Yup.string().required('validacao.obrigatorio'),
    number: Yup.string().required('validacao.obrigatorio'),
    allow_newsletter: Yup.bool().notRequired(),
    // complemento: Yup.string().notRequired(),
  });

  async function submit(values) {
    values.databaseId = user.getId()
    values._context = 'profile'
    setLoading(true)
    try {
      const axios = await WpUser.update(values)
      const resp = axios.data
      const success = resp.success
      const msg = resp.message
      const data = resp.data
      setLoading(false)

      success === false && errorNotification({message: msg})
      if(success){
        successNotification({message: t('atualizado-com-sucesso')})
        user.canManageAbstracts() && refreshUsers()
        user.getId() === auth.getId() && refreshMySelf()
      }


    } catch (err) {
      errorNotification({error: err})
      setLoading(false)
    }

  }

  return (<Formik
    enableReinitialize={true}
    initialValues={{
      fn_add_role: user.getUserData().roles?.nodes.map(r => r.name),
      locale: user.getUserData().locale || '',
      user_status: user.getUserData().user_status || '',
      firstName: user.getFirstName() || '',
      lastName: user.getUserData().lastName || '',
      email: user.getUserData().email || '',
      alt_email: user.getUserData().alt_email || '',
      country: user.getUserData().country || 'BR',
      cpf: user.getUserData().cpf || '',
      passport: user.getUserData().passport || '',
      badge_name: user.getUserData().badge_name || '',
      social_name: user.getUserData().social_name || '',
      cellphone: user.getUserData().cellphone || '',
      cellphone_country: user.getUserData().cellphone_country || '55',
      phone: user.getUserData().phone || '',
      phone_country: user.getUserData().phone_country || '55',
      birthdate: user.getUserData().birthdate || '',
      gender: user.getUserData().gender || 'M',
      description: user.getUserData().description || '',
      postcode: user.getUserData().postcode || '',
      state: user.getUserData().state || '',
      city: user.getUserData().city || '',
      neighborhood: user.getUserData().neighborhood || '',
      address: user.getUserData().address || '',
      number: user.getUserData().number || '',
      complement: user.getUserData().complement,
      institution_name: user.getUserData().institution_name,
      institution_occupation: user.getUserData().institution_occupation,
      institution_email: user.getUserData().institution_email,
      institution_phone: user.getUserData().institution_phone,
      allow_newsletter: user.getUserData().allow_newsletter,
      is_pdc: user.getUserData()?.is_pdc ? String(Number(user.getUserData().is_pdc)) : '0',
      pdc_needs: user.getUserData()?.pdc_needs || '',
      is_child_care: user.getUserData()?.is_child_care ? String(Number(user.getUserData().is_child_care)) : '0',
      child_care_needs: user.getUserData()?.child_care_needs || '',
      // --------------------------------
      race: user.getUserData().race || '',
      education: user.getUserData().education || '',
      has_institution: user.getUserData().has_institution || '0',
      abg_member: user.getUserData().abg_member || '0',
      is_affirmative_action: user.getUserData()?.is_affirmative_action || '0',
      affirmative_action: user.getUserData()?.affirmative_action || '',
    }}
    onSubmit={submit}
    validationSchema={FormSchema}
  >{({errors, values, touched, isValid, setFieldValue}) => (
    <Form>
      {/* {dump(documents)} */}
      <fieldset>
        <legend>{t('dados-pessoais')}</legend>

      <Ac requires={[REQUIREMENTS.user.editSensitive]}>
        <div className="row border bg-light pt-3 pb-2 mb-3">
          <Select name="fn_add_role" label={`Perfil`} containerClass="col-12 col-md" multi required={isRequired}>
            {MapRoles.map(r => (<option key={r.name} value={r.name}>{r.label}</option>))}
          </Select>
          <div className="col-12 col-md">
            <Select name="locale" label={`Localização`} containerClass="" required>
              {MapLocales.map(l => (<option key={l.site} value={l.site}>{l.label}</option>))}
            </Select>
            <Select name="user_status" label={`Status`} containerClass="-col-12 -col-md" required>
              <option value="0">Ativo</option>
              <option value="1">Inativo</option>
            </Select>
          </div>
        </div>
      </Ac>

        <div className="row">
          <Text name="firstName" label={t('cadastro.nome')} required={isRequired} containerClass="col-12 col-md"/>
          <Text name="lastName" label={t('cadastro.sobrenome')} required={isRequired} containerClass="col-12 col-md"/>
        </div>
        <div className="row">
          <Text name="badge_name" label={t('cadastro.nome-cracha')} containerClass="col-12 col-md" required={editingMode === 'user'} />
          <Text name="social_name" label={t('cadastro.social_name')} containerClass="col-12 col-md"/>
        </div>
        <div className="row">
          <Select name="country" label={t('cadastro.nacionalidade')} containerClass="col-12 col-md" required={isRequired}>
            {countries.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))}
          </Select>
          {values.country === 'BR'
          && <Mask name="cpf" mask="999.999.999-99" label="CPF" containerClass="col-12 col-md" required={isRequired}/>}
          {values.country !== 'BR'
          && <Text name="passport" label={t('cadastro.passaporte')} containerClass="col-12 col-md" required={isRequired}/>}
        </div>
        <div className="row">
        <Text name="email" type="email" label="E-mail" required containerClass="col-12 col-md"/>
        <Text name="alt_email" type="email" label={t('cadastro.email-alternativo')} containerClass="col-12 col-md"/>
        </div>
        <div className="row">
          <Phone name="cellphone" countryName="cellphone_country" mask="(99) 99999-9999" label={t('cadastro.celular')} required={isRequired}
                        containerClass="col-12 col-md"/>
          <Phone name="phone" countryName="phone_country" mask="(99) 9999-9999" label={t('cadastro.telefone')}
                        containerClass="col-12 col-md"/>
        </div>
        <div className="row">
          <Mask name="birthdate" mask="99/99/9999" label={t('cadastro.nascimento')} required={isRequired}
                containerClass="col-12 col-md"/>
          <Select name="gender" label={t('cadastro.genero')} required={isRequired} containerClass="col-12 col-md">
            {getGenres().map(g => (<option key={g.value} value={g.value}>{t(g.name)}</option>))}
          </Select>
          <Select name="race" label={t('cadastro.raca')} required containerClass="col-12 col-md">
            <option value="" disabled>Selecione</option>
            {getRaces().map(g => (<option key={g.value} value={g.value}>{t(`raca.${g.name}`)}</option>))}
          </Select>
        </div>
        <Textarea name="description" label="Bio"/>
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
        
      </fieldset>

      <fieldset className="border p-3 mb-3 bg-light">
        <legend className="px-2 text-sm w-auto"><strong>Ações Afirmativas</strong></legend>
        <div className="row">
          <Select name="is_affirmative_action" label="Você se identifica como Ação Afirmativa?" containerClass="col-12 col-md-6">
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
          {values.is_affirmative_action == '1' && 
          <div className="col-12"><div className="badge text-danger">É obrigatório o envio de documentos e/ou autodeclaração que comprove sua identidade.</div></div>}
        </div>

        {/* {dump(values)} */}

      </fieldset>

      <fieldset>
        <legend>{t('cadastro.endereco')}</legend>
        <div className="form-row">
          <Text name="postcode" label={t('cadastro.cep')} required={isRequired} containerClass="col-12 col-md-4"
                cepCallback={(data)=>{
                  if(data){
                    setFieldValue('address', data.address)
                    setFieldValue('city', data.city)
                    setFieldValue('neighborhood', data.neighborhood)
                    setFieldValue('state', data.state)
                  }
          }}/>
        </div>
        <div className="form-row">
          {values.country !== 'BR'
            ? <Text name="state" label={t('cadastro.estado')} required={isRequired} containerClass="col-12 col-md-4"/>
            : <Select name="state" label={t('cadastro.estado')} required={isRequired} containerClass="col-12 col-md-4">
              {states().map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </Select>}
          <Text name="city" label={t('cadastro.cidade')} required={isRequired} containerClass="col-12 col-md-4"/>
          <Text name="neighborhood" label={t('cadastro.bairro')} required={isRequired} containerClass="col-12 col-md-4"/>
        </div>
        <Text name="address" label={t('cadastro.logradouro')} required={isRequired} containerClass=""/>
        <div className="row">
          <Text name="number" type="number" label={t('cadastro.numero')} required={isRequired} containerClass="col-12 col-md-6"/>
          <Text name="complement" type="text" label={t('cadastro.complemento')} containerClass="col-12 col-md-6"/>
        </div>
      </fieldset>
      <fieldset>
        <legend>{t('cadastro.instituicao.instituicao')} <small style={{fontSize: 14}}>({t('opcional')})</small></legend>
        <div className="row">
          <Text name="institution_name" label={t('cadastro.instituicao.nome')} containerClass="col-12 col-md-6"/>
          <Text name="institution_occupation" label={t('cadastro.ocupacao')} containerClass="col-12 col-md-6"/>
        </div>
        <div className="row">
          <Text name="institution_phone" label={t('cadastro.telefone')} containerClass="col-12 col-md-6"/>
          <Text name="institution_email" label={`E-mail`} containerClass="col-12 col-md-6"/>
        </div>
      </fieldset>
      <fieldset>
        <Switch name="allow_newsletter" label={t('cadastro.aceita-compartinhar-email')}/>
      </fieldset>
      {edition?.getLgpdUrl(lang) && <p>Leia os <a href={edition.getLgpdUrl(lang)} target="_blank">Termos de Serviço</a></p>}
      
      
      <LoadingButton variant="primary" block size="lg" className={` mt-3`} disable={!isValid}
                     loading={loading}>{t('salvar')}</LoadingButton>

    </Form>
  )}</Formik>)
}
