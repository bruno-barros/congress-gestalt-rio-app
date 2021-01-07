import {ErrorMessage, Field, Form as FormikForm, Formik} from "formik";
import Curtain from "../ui/curtain";
import WpUser from "../../src/http/wp-user";
import * as Yup from "yup";
import useTrans from "../hooks/useTrans";
import {useEffect, useRef, useState} from "react";
import {StepProps} from "./registration.d";
import Select from "../ui/form/formik/select";
import {blockUi} from "../../src/store/ui.actions";
import {errorNotification} from "../../src/resources/responses";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import Form from "react-bootstrap/cjs/Form";
import {useQuery} from "react-query";
import {saveCart} from "../../src/store/user.actions";


export default function StepPlan(props: StepProps) {


  const disp = useDispatch()
  const {step, user, event, edition, onLoading, goPrev, goNext, formInstance} = props
  const t = useTrans()
  const router = useRouter()
  const [response, setResponse] = useState({success: null, msg: ''})
  const form = useRef(null)
  const lang = router.locale

  useEffect(() => {
    formInstance(form.current)
    return ()=> formInstance(null)
  }, [])

  function dismissAlert() {
    setTimeout(() => {
      setResponse({success: null, msg: ''})
    }, 5000)
  }

  const FormSchema = Yup.object().shape({
    product: Yup.string().required('validacao.obrigatorio'),
  });

  async function handleSubmit(values) {
    values.locale = lang
    disp(saveCart(values, () => {
      goNext()
    }))

  }

  function Label({prod}) {
    return <span>{prod.name} <span className="price">R$ {prod.price}</span></span>
  }

  return (<div className="px-md-5 py-md-3">
    <h3 className="mb-3 pb-2 border-bottom">{step[router.locale]}</h3>
    {/*<button onClick={goNext}>avançar</button>*/}
    <Formik
      innerRef={form}
      initialValues={{
        product: '',
        variation: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >{({errors, touched, values, isValid, setFieldValue, isSubmitting}) => (
      <FormikForm>
        <div className="row">
          <div className="col-12">

            <p>{t('cadastro.escolha-seu-plano')}</p>
            {edition.getProducts(lang).map(prod => (<div key={prod.id} className="mb-4">
              <Form.Check custom className="radio-lg"
                          onClick={() => setFieldValue('product', prod.id)}
                          name="product" type="radio"
                          label={<Label prod={prod}/>}
                          id={`produto_${prod.id}`}
              />
              <div className="text-sm">{prod.desc}</div>
            </div>))}
            {errors?.product && <Curtain isOpened={!!errors?.product}>
              <div className="alert alert-warning">
                {t(String(errors?.product))}
              </div>
            </Curtain>}


          </div>
        </div>

        {response.msg && <Curtain isOpened={response.msg?.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-danger'}`}>
            {response.msg}
          </div>
        </Curtain>}
      </FormikForm>
    )}</Formik>
  </div>)

}
