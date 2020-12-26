import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Head from "next/head";
import {inputFloatClass, siteTitle} from "../src/helpers";
import {useQueryClient} from "react-query";
import Card from "react-bootstrap/cjs/Card";
import ClearLayout from "../components/layout/clear";
import {Field, Form, Formik} from "formik";
import FieldError from "../components/ui/form/field-error";
import useTrans from "../components/hooks/useTrans";


const Register1 = () => {

  const t = useTrans()
  const router = useRouter()
  const queryClient = useQueryClient()
  const {authLoading, user} = useCurrentUser()

  function handleSubmit(values){

  }

  return (<ClearLayout>
    <Head>
      <title>{siteTitle('Cadastro', queryClient)}</title>
    </Head>
    <div className="row">
      <div className="col-12">
        <Card>
          <Card.Body>
            <h3 className="page-title">Confirme seus dados básicos</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi, consequuntur cupiditate earum eius error est, fuga harum hic, id laboriosam modi neque nisi possimus recusandae tempore velit vero voluptas voluptatum.</p>
            <Formik
            initialValues={{
              country: '2',
              cpf: '',
              passport: '',
              first_name: '',
              last_name: '',
              badge_name: '',
              cellphone: '',
              phone: '',
              birthdate: '',
              gender: '',
            }}
            onSubmit={handleSubmit}
            >{({errors, touched, values, isValid})=>(
              <Form>

                <div className="row">
                  <div className="form-group col-12 col-md">
                    <label htmlFor="country">{t('cadastro.nacionalidade')}</label>
                    <Field id="country" name="country" className="form-control" placeholder="" component="select">{
                      [1, 2].map(n=>(<option value={n}>{n}</option>))
                    }
                    </Field>
                    <FieldError message={touched?.country && errors?.country} fieldId="country"/>
                  </div>
                  {values.country === '1' && <div className="form-group col-12 col-md">
                    <label htmlFor="cpf">CPF</label>
                    <Field id="cpf" name="cpf" className="form-control" placeholder=""/>
                    <FieldError message={touched?.cpf && errors?.cpf} fieldId="cpf"/>
                  </div>}
                  {values.country === '2' && <div className="form-group col-12 col-md">
                    <label htmlFor="passport">{t('cadastro.passaporte')}</label>
                    <Field id="passport" name="passport" className="form-control" placeholder=""/>
                    <FieldError message={touched?.passport && errors?.passport} fieldId="passport"/>
                  </div>}
                </div>{/*row*/}

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
                </div>{/*row*/}

                <div className="form-group">
                  <label htmlFor="badge_name">{t('cadastro.nome-cracha')}</label>
                  <Field id="badge_name" name="badge_name" className="form-control" placeholder=""/>
                  <FieldError message={touched?.badge_name && errors?.badge_name} fieldId="badge_name"/>
                </div>

                <div className="row">
                  <div className="form-group col-12 col-md">
                    <label htmlFor="cellphone">{t('cadastro.celular')}</label>
                    <Field id="cellphone" name="cellphone" className="form-control" placeholder=""/>
                    <FieldError message={touched?.cellphone && errors?.cellphone} fieldId="cellphone"/>
                  </div>
                  <div className="form-group col-12 col-md">
                    <label htmlFor="phone">{t('cadastro.telefone')}</label>
                    <Field id="phone" name="phone" className="form-control" placeholder=""/>
                    <FieldError message={touched?.phone && errors?.phone} fieldId="phone"/>
                  </div>
                </div>{/*row*/}

                <div className="row">
                  <div className="form-group col-12 col-md">
                    <label htmlFor="birthdate">{t('cadastro.nascimento')}</label>
                    <Field id="birthdate" name="birthdate" className="form-control" placeholder=""/>
                    <FieldError message={touched?.birthdate && errors?.birthdate} fieldId="birthdate"/>
                  </div>
                  <div className="form-group col-12 col-md">
                    <label htmlFor="gender">{t('cadastro.genero')}</label>
                    <Field id="gender" name="gender" className="form-control" placeholder=""/>
                    <FieldError message={touched?.gender && errors?.gender} fieldId="gender"/>
                  </div>
                </div>{/*row*/}


                <pre>{JSON.stringify(values, null, 2)}</pre>
              </Form>
            )}</Formik>
          </Card.Body>
        </Card>

      </div>
    </div>
  </ClearLayout>)
}

export default Register1
