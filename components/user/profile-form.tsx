import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
import {User} from "../../src/resources/user";
import {countries} from "../../src/countries";
import FieldError from "../ui/form/field-error";
import useTrans from "../hooks/useTrans";
import Text from "../ui/form/formik/text";
import {LoadingButton} from "@brunobarros/react-components";
import Select from "../ui/form/formik/select";
import Mask from "../ui/form/formik/mask";
import {getGenres} from "../../src/helpers";
import * as Yup from "yup";
import WpUser from "../../src/http/wp-user";
import Error from "../../src/resources/error";
import {toast} from "react-toastify";

interface ProfileFormProps {
  user: User
}

export default function ProfileForm(props: ProfileFormProps) {

  const t = useTrans()
  const {user} = props
  const [loading, setLoading] = useState(false)
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

  });

  async function submit(values) {
    values.databaseId = user.getId()
    console.log({values});
    setLoading(true)
    try {
      const resp = await WpUser.update(values)
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)

      success === false && toast.error(data?.msg)
      success === true && toast.success(t('atualizado-com-sucesso'))

    } catch (err) {
      const error = Error.make(err)
      toast.error(error.message)
      setLoading(false)
    }

  }

  return (<Formik
    initialValues={{
      firstName: user.getFirstName() || '',
      lastName: user.getUserData().lastName || '',
      email: user.getUserData().email || '',
      country: user.getUserData().country || 'BR',
      cpf: user.getUserData().cpf || '',
      passport: user.getUserData().passport || '',
      badge_name: user.getUserData().badge_name || '',
      cellphone: user.getUserData().cellphone || '',
      phone: user.getUserData().phone || '',
      birthdate: user.getUserData().birthdate || '',
      gender: user.getUserData().gender || 'M',
    }}
    onSubmit={submit}
    validationSchema={FormSchema}
  >{({errors, values, touched, isValid}) => (
    <Form>
      <div className="row">
        <Select name="country" label={t('cadastro.nacionalidade')} containerClass="col-12 col-md" required>
          {countries.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))}
        </Select>
        {values.country === 'BR'
        && <Mask name="cpf" mask="999.999.999-99" label="CPF" containerClass="col-12 col-md"/>}
        {values.country !== 'BR'
        && <Text name="passport" label={t('cadastro.passaporte')} containerClass="col-12 col-md"/>}
      </div>
      <div className="row">
        <Text name="firstName" label={t('cadastro.nome')} required containerClass="col-12 col-md"/>
        <Text name="lastName" label={t('cadastro.sobrenome')} required containerClass="col-12 col-md"/>
      </div>
      <Text name="badge_name" label={t('cadastro.nome-cracha')} required/>
      <Text name="email" type="email" label="E-mail" required/>
      <div className="row">
        <Mask name="cellphone" mask="(99) 99999-9999" label={t('cadastro.celular')} required
              containerClass="col-12 col-md"/>
        <Mask name="phone" mask="99) 9999-9999" label={t('cadastro.telefone')} containerClass="col-12 col-md"/>
      </div>
      <div className="row">
        <Mask name="birthdate" mask="99/99/9999" label={t('cadastro.nascimento')} required
              containerClass="col-12 col-md"/>
        <Select name="gender" label={t('cadastro.genero')} required containerClass="col-12 col-md">
          {getGenres().map(g => (<option key={g.value} value={g.value}>{t(g.name)}</option>))}
        </Select>
      </div>

      <LoadingButton variant="primary" block className={` mt-3`} disable={!isValid}
                     loading={loading}>{t('salvar')}</LoadingButton>
      {/*<pre>{JSON.stringify(values, null, 2)}</pre>*/}

    </Form>
  )}</Formik>)
}
