import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
import {MapRoles, User} from "../../src/resources/user";
import {countries} from "../../src/countries";
import useTrans from "../hooks/useTrans";
import Text from "../ui/form/formik/text";
import {LoadingButton} from "@brunobarros/react-components";
import Select from "../ui/form/formik/select";
import Mask from "../ui/form/formik/mask";
import {getGenres, MapLocales, states} from "../../src/helpers";
import * as Yup from "yup";
import WpUser from "../../src/http/wp-user";
import {errorNotification, successNotification} from "../../src/resources/responses";
import useAllUsers from "../hooks/useAllUsers";
import Textarea from "../ui/form/formik/textarea";
import useCurrentUser from "../hooks/useCurrentUser";
import Switch from "../ui/form/formik/switch";
import Card from "react-bootstrap/cjs/Card";

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
    postcode: Yup.string().min(8, 'validacao.formato-invalido').required('validacao.obrigatorio'),
    state: Yup.string().required('validacao.obrigatorio'),
    city: Yup.string().required('validacao.obrigatorio'),
    neighborhood: Yup.string().required('validacao.obrigatorio'),
    address: Yup.string().required('validacao.obrigatorio'),
    number: Yup.string().required('validacao.obrigatorio'),
    allow_newsletter: Yup.bool()
    // complemento: Yup.string().notRequired(),
  });

  async function submit(values) {
    values.databaseId = user.getId()
    values._context = 'profile'
    setLoading(true)
    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)

      success === false && errorNotification({message: data?.msg})
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
      cellphone: user.getUserData().cellphone || '',
      phone: user.getUserData().phone || '',
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
    }}
    onSubmit={submit}
    validationSchema={FormSchema}
  >{({errors, values, touched, isValid, setFieldValue}) => (
    <Form>
      <fieldset>
        <legend>{t('dados-pessoais')}</legend>

        {editingMode === 'admin'
        && <div className="row border pt-3 pb-2 mb-3">
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
        </div>}

        <div className="row">
          <Text name="firstName" label={t('cadastro.nome')} required={isRequired} containerClass="col-12 col-md"/>
          <Text name="lastName" label={t('cadastro.sobrenome')} required={isRequired} containerClass="col-12 col-md"/>
        </div>
        <Text name="badge_name" label={t('cadastro.nome-cracha')} required={editingMode === 'user'}/>
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
          <Mask name="cellphone" mask="(99) 99999-9999" label={t('cadastro.celular')} required={isRequired}
                containerClass="col-12 col-md"/>
          <Mask name="phone" mask="99) 9999-9999" label={t('cadastro.telefone')} containerClass="col-12 col-md"/>
        </div>
        <div className="row">
          <Mask name="birthdate" mask="99/99/9999" label={t('cadastro.nascimento')} required={isRequired}
                containerClass="col-12 col-md"/>
          <Select name="gender" label={t('cadastro.genero')} required={isRequired} containerClass="col-12 col-md">
            {getGenres().map(g => (<option key={g.value} value={g.value}>{t(g.name)}</option>))}
          </Select>
        </div>
        <Textarea name="description" label="Bio"/>
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
      <LoadingButton variant="primary" block size="lg" className={` mt-3`} disable={!isValid}
                     loading={loading}>{t('salvar')}</LoadingButton>
      {/*<code>{JSON.stringify(values, null, 2)}</code>*/}
      {/*<hr/>*/}
      {/*<code>{JSON.stringify(user, null, 2)}</code>*/}

    </Form>
  )}</Formik>)
}
