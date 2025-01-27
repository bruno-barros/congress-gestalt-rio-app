import {Form, Formik} from "formik";
import * as Yup from 'yup'
import Textarea from "../ui/form/formik/textarea";
import Select from "../ui/form/formik/select";
import {Evaluation} from "../../src/resources/evaluation";
import AbstractRating from "./abstract-rating";
import {useRouter} from "next/router";
import useEvent from "../hooks/useEvent";
import useTrans from "../hooks/useTrans";
import FieldError from "../ui/form/field-error";
import React, {useState} from "react";
import Switch from "../ui/form/formik/switch";
import {errorNotification, successNotification} from "../../src/resources/responses";
import useCurrentUser from "../hooks/useCurrentUser";
import WpEvaluation from "../../src/http/wp-evaluation";
import usePendingReview, { invalidatePendingReview } from "../hooks/usePendingReview";
import LoadingButton from "../ui/loading-button";
import Loading from "../ui/loading";
import { StatusType } from "../../src/types/abstracts";
import useSettings from "../hooks/useSettings";
import { dump } from "../../src/helpers";
import { ItemLanguageWithId } from "../../src/types/settings";
import Button from "react-bootstrap/Button";
import EvaluatorOrientationModal from "./evaluator-orientation-modal";
import { useQueryClient } from "react-query";


interface EvaluationFormProps {
  evaluation: Evaluation
  onUpdate?: () => void
}

export default function EvaluationForm(props: EvaluationFormProps) {

  const {evaluation, onUpdate} = props
  const router = useRouter()
  const lang = router.locale
  const t = useTrans()
  const {user} = useCurrentUser()
  const {refetch: refetchReviews} = usePendingReview()
  const [loading, setLoading] = useState(false)
  const {data: event, isLoading, currentEdition: edition} = useSettings()  
  const ReviewCnf = edition?.Review()
  const questions = edition?.getReviewQuestions()
  const answers = evaluation.getAnswers()
  const queryClient = useQueryClient()

  const FormSchema = Yup.object().shape({
    quality: Yup.number().when('status', {
      is: () => ReviewCnf.hasCriteria('quality'),
      then: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
      otherwise: Yup.number().notRequired()
    }),
    relevance: Yup.number().when('status', {
      is: () => ReviewCnf.hasCriteria('relevance'),
      then: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
      otherwise: Yup.number().notRequired()
    }),
    clarity: Yup.number().when('status', {
      is: () => ReviewCnf.hasCriteria('clarity'),
      then: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
      otherwise: Yup.number().notRequired()
    }),
    contributions: Yup.number().when('status', {
      is: () => ReviewCnf.hasCriteria('contributions'),
      then: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
      otherwise: Yup.number().notRequired()
    }),
    bibliography: Yup.number().when('status', {
      is: () => ReviewCnf.hasCriteria('bibliography'),
      then: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
      otherwise: Yup.number().notRequired()
    }),
    methodology: Yup.number().when('status', {
      is: () => ReviewCnf.hasCriteria('methodology'),
      then: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
      otherwise: Yup.number().notRequired()
    }),
    research: Yup.number().when('status', {
      is: () => ReviewCnf.hasCriteria('research'),
      then: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
      otherwise: Yup.number().notRequired()
    }),
    status: Yup.string().required('validacao.obrigatorio'),
    comment: Yup.string().required('validacao.obrigatorio'),
  })

  if (isLoading) {
    return <Loading vspace={80}/>
  }

  let initialValues = {
    quality: evaluation.quality || -2,
    relevance: evaluation.relevance || -2,
    clarity: evaluation.clarity || -2,
    contributions: evaluation.contributions || -2,
    bibliography: evaluation.bibliography || -2,
    research: evaluation.research || -2,
    methodology: evaluation.methodology || -2,
    status: evaluation.status || '',
    comment: evaluation.comment || '',
    answers: evaluation.getAnswers() || {},
  }

  // editing | use evaluator answers
  if (answers) {
    Object.keys(answers).map(key => {
      initialValues.answers[key] = answers[key]
    })
  }
  // creating | get questions to fill the form
  else if (questions.length > 0) {
    questions.map(q => {
      initialValues.answers[q.id] = false
    })
  }


  function handleSubmit(values) {
    
    setLoading(true)
    WpEvaluation.update(evaluation.id, values)
      .then(axios => {
        const resp = axios.data
        if (resp.success) {
          successNotification({
            heroTitle: 'Avaliação realizada com sucesso!'
          })
          refetchReviews()
          invalidatePendingReview(queryClient, evaluation.user_id)
          onUpdate?.()
          router.push(`/evaluations?edition=${edition.getId()}`)
        } else {
          errorNotification({error: resp.message})
        }
      }, err => {
        errorNotification({error: err})
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  function filterAvailableStatuses() {
    const current: StatusType = evaluation.status
    if (current === 'evaluating') {
      return edition.abstract.statuses.filter(stats => ['rejected', 'waiting_update', 'pre_approved'].indexOf(stats) !== -1)
    }
    else if (current === 'synopsis_evaluating') {
      return edition.abstract.statuses.filter(stats => ['synopsis_rejected', 'synopsis_waiting_upd', 'synopsis_approved'].indexOf(stats) !== -1)
    }

    return edition.abstract.statuses
  }

  function findQuestion(id: string): ItemLanguageWithId{
    return questions.find(q => q.id === id)
  }


  return (<div className="eval-form">
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >{({values, touched, errors, isSubmitting, isValid, setFieldValue}) => (
      <Form>

        <EvaluatorOrientationModal />  
        {/* {dump(lang)}       */}

        {/*<pre>{JSON.stringify(values, null, 2)}</pre>*/}
        <fieldset disabled={!evaluation.isEditable()}>
        <style jsx global>{`
        .evaluation-select {
          display: flex;
          align-items: center;
        }
        .evaluation-select label {
          flex: 1;
          margin-right: 1rem;
          margin-bottom: 0;
        }
        .evaluation-select  .form-control {
          flex: 0 0 70px;
        }
        .custom-control-label {
          line-height: 1em;
          font-size: .9em;
          padding-top: 4px;
        }
        `}</style>
          <h5 className="border-bottom pb-2 mb-3">{evaluation.statusPassed('synopsis_approved')
            ? 'Sua avaliação do trabalho' : 'Sua avaliação do resumo'}</h5>
          {/* {dump(ReviewCnf.hasCriteria('bibliography'))} */}
          {questions.length > 0 && Object.keys(initialValues.answers).map(key => {
            return <div key={key} className="form-group">
              <Switch name={`answers.${key}`} label={findQuestion(key)?.[lang] || '-'}/>
            </div>
          })}

          {/* <div className="form-group row">
            <div className="col-6">
              <label className="m-0">Qualidade</label>
              <AbstractRating value={values.quality} disabled={!evaluation.isEditable()}
                              onChange={(r) => setFieldValue('quality', r)}/>
              <FieldError message={touched?.quality && errors?.quality}/>
            </div>
            <div className="col-6">
              <label className="m-0">Relevância</label>
              <AbstractRating value={values.relevance}  disabled={!evaluation.isEditable()}
                              onChange={(r) => setFieldValue('relevance', r)}/>
              <FieldError message={touched?.relevance && errors?.relevance}/>
            </div>
          </div> */}

          {ReviewCnf.getCriteriasArray().map(criteria => {
            return <Select key={criteria.id} name={criteria.id} label={criteria.title?.[lang]} containerClass="evaluation-select">
            <option value="-2">...</option>
            {Array.from(Array(criteria.max + 1).keys()).map(num => (
              <option key={num} value={num}>{num}</option>))}
          </Select>
          })}


          <Select name="status" label="Status sugerido">
            <option value=""></option>
            {filterAvailableStatuses().map(status => (
              <option key={status} value={status}>{t(`status.${status}`)}</option>))}
          </Select>
          <Textarea name="comment" label="Seu comentário"/>
          {evaluation.isEditable() &&
          <div className="form-group">
            <LoadingButton loading={loading} disable={!isValid} block>Submeter avaliação</LoadingButton>
          </div>}
          {/* {dump({errors, values})} */}

        </fieldset>
        <div className=" my-2 text-right">
          <button onClick={() => router.back()} type="button" className="btn btn-sm btn-light">cancelar</button>
        </div>
      </Form>
    )}</Formik>
  </div>)
}
