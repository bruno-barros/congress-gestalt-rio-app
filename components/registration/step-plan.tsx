import {Form as FormikForm, Formik} from "formik";
import Curtain from "../ui/curtain";
import * as Yup from "yup";
import useTrans from "../hooks/useTrans";
import {useEffect, useRef, useState} from "react";
import {StepProps} from "./registration.d";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import Form from "react-bootstrap/cjs/Form";
import {saveCart} from "../../src/store/user.actions";
import useProducts, { filterByCountry } from "../hooks/useProducts";
import { dump } from "../../src/helpers";
import Loading from "../ui/loading";
import Product from "../../src/resources/product";


export default function StepPlan(props: StepProps) {


  const disp = useDispatch()
  const {step, user, event, edition, onLoading, goPrev, goNext, formInstance} = props
  const t = useTrans()
  const router = useRouter()
  const {data: prods, isLoading, isFetching} = useProducts(edition?.Subscription()?.getCategoryId() || undefined, filterByCountry(user?.getCountry()))
  const [response, setResponse] = useState({success: null, msg: ''})
  const form = useRef(null)
  const lang = router.locale

  useEffect(() => {
    // console.log(form.current)
    formInstance(form.current)
    return ()=> formInstance(null)
  }, [form, prods])

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

  function Label({prod}: {prod: Product}) {
    return <span>{prod.getName()} <span className="price">{prod.getSalePrice(true)}</span></span>
  }

  if(isLoading || isFetching){
    return <Loading />
  }

  return (<div className="px-md-5 py-md-3">
    <h3 className="mb-3 pb-2 border-bottom">{step[router.locale]}</h3>
    {/* {dump({
      sale: prods?.[0]?.getSalePrice(),
      sale_formated: prods?.[0]?.getSalePrice(true),
      full: prods?.[0]?.getFullPrice(),
      full_form: prods?.[0]?.getFullPrice(true),
    })} */}
    {/*<button onClick={goNext}>avançar</button>*/}
    {!isLoading && prods.length === 0 && <div className="alert alert-warning">Nenhum plano disponível.</div>}
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
            {(prods && prods.length > 0) && prods.map(prod => {
              return <div key={prod.getId()} className="mb-4">
                <Form.Check custom className="radio-lg"
                            onClick={() => setFieldValue('product', prod.getId())}
                            name="product" type="radio"
                            label={<Label prod={prod}/>}
                            id={`produto_${prod.id}`}
                />
                <div className="text-sm ml-4" dangerouslySetInnerHTML={{__html: prod.getShortDescription()}}></div>
              </div>
            })}
            {errors?.product && <Curtain isOpened={!!errors?.product}>
              <div className="alert alert-warning">
                {t(String(errors?.product))}
              </div>
            </Curtain>}

            {edition?.Subscription()?.getPlansDescription(lang) && <div className="mt-4 border-left bg-light p-3 text-sm">
              <div dangerouslySetInnerHTML={{__html: edition.Subscription().getPlansDescription(lang)}}></div>  
            </div>}


          </div>
        </div>

        {response.msg && <Curtain isOpened={response.msg?.length > 0}>
          <div className={`alert ${response.success ? 'alert-success' : 'alert-danger'}`}>
            {response.msg}
          </div>
        </Curtain>}
        {/* {dump(values)} */}
      </FormikForm>
    )}</Formik>
  </div>)

}
