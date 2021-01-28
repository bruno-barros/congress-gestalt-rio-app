import ClearLayout from "../components/layout/clear";
import {siteTitle} from "../src/helpers";
import Head from "next/head";
import {useQueryClient} from "react-query";
import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import {useEffect, useState} from "react";
import Card from "react-bootstrap/cjs/Card";
import {LoadingButton} from "@brunobarros/react-components";
import useTrans from "../components/hooks/useTrans";
import {MultiStepForm, Step} from 'react-multi-form'
import useEvent from "../components/hooks/useEvent";
import {Edition} from "../src/resources/event";
import {Loading} from "@brunobarros/react-components";
import StepPlan from "../components/registration/step-plan";
import StepAddress from "../components/registration/step-address";
import StepInstitution from "../components/registration/step-institution";
import StepPayment from "../components/registration/step-payment";
import Curtain from "../components/ui/curtain";
import {FormikProps} from "formik";
import {Icon} from "@brunobarros/react-components";
import privateRoute from "../components/hoc/private-route";
import Link from "next/link";


const Register2 = () => {

  const t = useTrans()
  const queryClient = useQueryClient()
  const router = useRouter()
  const {authLoading, user} = useCurrentUser()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event && event.currentEdition()
  const steps: { pt: string; en: string; id: string }[] = edition?.stepsArr()
  const lang = router.locale
  const [loading, setLoading] = useState(false)

  const [step, setStep] = useState(1)
  const [formInstance, setFormInstance] = useState<FormikProps<any>|any>(null)

  function handleSubmit() {
    // console.log(formInstance);
    formInstance && formInstance.submitForm()
  }

  function handlePostpone(e) {
    e.preventDefault()
    router.push(`/dashboard`)
  }

  if (isLoading) {
    return <ClearLayout><Loading vspace={80}/></ClearLayout>
  }


  return (<ClearLayout>
    <Head>
      <title>{siteTitle('Inscrição', queryClient)}</title>
    </Head>
    <div className="row">

      {edition.subscription.allowed === false &&
      <div className="col-12 d-flex flex-column align-items-center justify-content-center">
        <h4 className="text-center font-weight-light my-4">
          {t('inscrioes-nao-estao-abertas')}
        </h4>
        <Link href={`/dashboard`} passHref><a className="btn btn-outline-primary">{t('voltar-para-dashboard')}</a></Link>
      </div>}

      {edition.subscription.allowed &&
      <div className="col-12 col-lg-8 offset-lg-2">
        <div className="multi-steps">
          <MultiStepForm activeStep={step} accentColor="var(--primary)">
            {steps.map(step => <Step key={step.id} label={step[lang]}/>)}
          </MultiStepForm>
        </div>
        <Card>
          <Card.Body>

            {steps[step - 1].id === 'plan' &&
            <Curtain isOpened={steps[step - 1].id === 'plan'}>
              <StepPlan step={edition.steps()['plan']} user={user} event={event} edition={edition}
                        onLoading={(bool) => setLoading(bool)}
                        goNext={() => setStep(step + 1)} formInstance={(form) => {setFormInstance(form)}}/>
            </Curtain>}
            {steps[step - 1].id === 'address'
            && <Curtain isOpened={steps[step - 1].id === 'address'}>
              <StepAddress step={edition.steps()['address']} user={user} event={event} edition={edition}
                           onLoading={(bool) => setLoading(bool)}
                           goNext={() => setStep(step + 1)} goPrev={() => setStep(step - 1)} formInstance={(form) => {setFormInstance(form)}}/>
            </Curtain>}
            {steps[step - 1].id === 'institution'
            && <Curtain isOpened={steps[step - 1].id === 'institution'}>
              <StepInstitution step={edition.steps()['institution']} user={user} event={event} edition={edition}
                               onLoading={(bool) => setLoading(bool)}
                               goNext={() => setStep(step + 1)} goPrev={() => setStep(step - 1)} formInstance={(form) => {setFormInstance(form)}}/>
            </Curtain>}
            {steps[step - 1].id === 'payment'
            && <Curtain isOpened={steps[step - 1].id === 'payment'} style={{height: 400}}>
              <StepPayment step={edition.steps()['payment']} user={user} event={event} edition={edition}
                           onLoading={(bool) => setLoading(bool)} formInstance={(form) => {setFormInstance(form)}}
                           goPrev={(stp) => setStep(stp || step - 1)}/>
            </Curtain>}


          </Card.Body>
          <Card.Footer className="p-0 border-0">
            <div className="d-flex align-items-center justify-content-between">
              <div className="btn-group btn-group-lg start" role="group">
                {step > 1 && <button onClick={()=> setStep(step-1)} type="button"
                                     className="btn btn-outline-secondary border-0 -px-md-5 d-flex align-items-center"><Icon name={`chevron-back-outline`}/> {t('voltar')}
                </button>}

              </div>
              <div className="btn-group btn-group-lg end" role="group">
                <button onClick={handlePostpone} type="button"
                        className="btn btn-outline-secondary border-0 px-md-5">{t('cadastro.fazer-depois')}
                </button>
                <LoadingButton onClick={handleSubmit} type="button" variant="primary" loading={loading}
                               className=" px-md-5  d-flex align-items-center">{t('continuar')} <Icon name={`chevron-forward-outline`}/></LoadingButton>
              </div>
            </div>
          </Card.Footer>
        </Card>

      </div>}

    </div>
  </ClearLayout>)
}

export default privateRoute(Register2)
