import ClearLayout from "../components/layout/clear";
import {siteTitle} from "../src/helpers";
import Head from "next/head";
import {useQueryClient} from "react-query";
import {useRouter} from "next/router";
import useCurrentUser from "../components/hooks/useCurrentUser";
import {useState} from "react";
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
import Carousel from "react-bootstrap/cjs/Carousel";
import Curtain from "../components/ui/curtain";


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
  const [isStepValid, setIsStepValid] = useState(false)


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
      <div className="col-12">
        <div className="multi-steps">
          <MultiStepForm activeStep={step} accentColor="var(--primary)">
            {steps.map(step => <Step key={step.id} label={step[lang]}/>)}
          </MultiStepForm>
        </div>
        <Card>
          <Card.Body>

              {steps[step - 1].id === 'plan'
              && <Curtain isOpened={steps[step - 1].id === 'plan'}>
                <StepPlan user={user} event={event} edition={edition}
                          onLoading={(bool) => setLoading(bool)}
                          goNext={() => setStep(step + 1)}/>
              </Curtain>}
              {steps[step - 1].id === 'address'
              && <Curtain isOpened={steps[step - 1].id === 'address'}>
                <StepAddress user={user} event={event} edition={edition}
                             onLoading={(bool) => setLoading(bool)}
                             goNext={() => setStep(step + 1)} goPrev={() => setStep(step - 1)}/>
              </Curtain>}
              {steps[step - 1].id === 'institution'
              && <Curtain isOpened={steps[step - 1].id === 'institution'}>
                <StepInstitution user={user} event={event} edition={edition}
                                 onLoading={(bool) => setLoading(bool)}
                                 goNext={() => setStep(step + 1)} goPrev={() => setStep(step - 1)}/>
              </Curtain>}
              {steps[step - 1].id === 'payment'
              && <Curtain isOpened={steps[step - 1].id === 'payment'} style={{height: 400}}>
                <StepPayment user={user} event={event} edition={edition}
                             onLoading={(bool) => setLoading(bool)}
                             goNext={() => {
                             }} goPrev={() => setStep(step - 1)}/>
              </Curtain>}


          </Card.Body>
          <Card.Footer className="p-0 border-0">
            <div className="d-flex align-items-center justify-content-between">
              <div className="px-4 py-2">
                <span className="text-muted"></span>
              </div>
              <div className="btn-group btn-group-lg end" role="group">
                <button onClick={handlePostpone} type="button"
                        className="btn btn-outline-secondary border-0 px-5">{t('cadastro.fazer-depois')}
                </button>
                <LoadingButton type="button" variant="primary" loading={loading} disable={!isStepValid}
                               className=" px-5">{t('continuar')}</LoadingButton>
              </div>
            </div>
          </Card.Footer>
        </Card>

      </div>
    </div>
  </ClearLayout>)
}

export default Register2
