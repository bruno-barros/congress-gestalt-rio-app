import {Form, Formik} from "formik";
import Select from "../ui/form/formik/select";
import {countries} from "../../src/countries";
import Mask from "../ui/form/formik/mask";
import Text from "../ui/form/formik/text";
import {getGenres} from "../../src/helpers";
import React, {useState} from "react";
import {LoadingButton} from "@brunobarros/react-components";
import {User} from "../../src/resources/user";
import useTrans from "../hooks/useTrans";
import * as Yup from "yup";
import WpUser from "../../src/http/wp-user";
import {toast} from "react-toastify";
import Error from "../../src/resources/error";
import Password from "../ui/form/formik/password";

interface PasswordUpdateFormProps {
  user: User
}

export default function PasswordUpdateForm(props: PasswordUpdateFormProps) {


  const t = useTrans()
  const {user} = props
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const FormSchema = Yup.object().shape({
    newPassword: Yup.string().min(8, 'validacao.senha-fraca').required('validacao.senha-invalida'),
    confirmPassword: Yup.mixed().test("match", 'validacao.senhas-devem-ser-iguais',
      function () {
        return this.parent.newPassword === this.parent.confirmPassword;
      }
    )
  });

  async function submit(values) {
    setLoading(true)

    try {
      const resp = await WpUser.updatePassword(user.getId(), values.newPassword)
      const success = resp.data.success
      const data = resp.data?.data
      setLoading(false)
      setSubmitted(true)

      success === false && toast.error(data?.msg)
      success === true && toast.success(t('atualizado-com-sucesso'))

      setTimeout(()=>{
        setSubmitted(false)
      }, 1000)

    } catch (err) {
      const error = Error.make(err)
      toast.error(error.message)
      setLoading(false)
    }

  }

  return (<Formik
    initialValues={{
      newPassword: '',
      confirmPassword: '',
    }}
    onSubmit={submit}
    validationSchema={FormSchema}
  >{({errors, values, touched, isValid}) => (
    <Form>

      <div className="" style={{maxWidth: 350}}>
        <Password name="newPassword" label={t('senha')} type="password" required submitted={submitted}/>
        <Text name="confirmPassword" label={t('cadastro.confirmar-senha')} type="password" required/>

        <LoadingButton variant="primary" block className={` mt-3`} disable={!isValid}
                       loading={loading}>{t('atualizar')}</LoadingButton>
      </div>

    </Form>
  )}</Formik>)
}
