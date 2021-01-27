import {Form, Formik} from "formik";
import * as Yup from 'yup'
import Textarea from "../ui/form/formik/textarea";
import Select from "../ui/form/formik/select";
import {LoadingButton} from "@brunobarros/react-components";
import {Evaluation} from "../../src/resources/evaluation";
import AbstractRating from "./abstract-rating";
import {useRouter} from "next/router";
import useEvent from "../hooks/useEvent";
import useTrans from "../hooks/useTrans";
import FieldError from "../ui/form/field-error";
import React, {useState} from "react";
import {Status} from "./abstract.d";
import {Loading} from "@brunobarros/react-components";
import Switch from "../ui/form/formik/switch";
import {errorNotification, successNotification} from "../../src/resources/responses";
import useCurrentUser from "../hooks/useCurrentUser";
import WpEvaluation from "../../src/http/wp-evaluation";
import usePendingReview from "../hooks/usePendingReview";


interface EvaluationFormProps {
  evaluation: Evaluation
  onUpdate?: () => void
}

export default function EvaluationForm(props: EvaluationFormProps) {

  const {evaluation, onUpdate} = props
  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  const {refetch: refetchReviews} = usePendingReview()
  const [loading, setLoading] = useState(false)
  const {data: event, isLoading} = useEvent()
  const edition = event && event.currentEdition()
  const questions = edition?.getReviewQuestions()
  const answers = evaluation.getAnswers()

  const FormSchema = Yup.object().shape({
    quality: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
    relevance: Yup.number().moreThan(-2, 'validacao.obrigatorio').required('validacao.obrigatorio'),
    status: Yup.string().required('validacao.obrigatorio'),
    comment: Yup.string().when('status', {
      is: (val) => val?.indexOf('approved') !== -1,
      then: Yup.string().notRequired(),
      otherwise: Yup.string().required('validacao.obrigatorio')
    }),
  })

  if (isLoading) {
    return <Loading vspace={80}/>
  }

  let initialValues = {
    quality: evaluation.quality || -2,
    relevance: evaluation.relevance || -2,
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
  else if (questions) {
    Object.keys(questions).map(key => {
      initialValues.answers[key] = false
    })
  }


  function handleSubmit(values) {
    values.id = evaluation.id
    setLoading(true)
    WpEvaluation.save(values)
      .then(resp => {
        if (resp.data.success) {
          successNotification({
            heroTitle: 'Avaliação realizada com sucesso!'
          })
          refetchReviews()
          onUpdate && onUpdate()
          router.push(`/evaluations?edition=${edition.id}`)
        } else {
          errorNotification({error: resp.data.data})
        }
      }, err => {
        errorNotification({error: err})
      })
      .finally(()=>{
        setLoading(false)
      })
  }

  function filterAvailableStatuses() {
    const current: Status = evaluation.status
    if (current === 'evaluating') {
      return edition.abstract.statuses.filter(stats => ['rejected', 'waiting_update', 'pre_approved'].indexOf(stats) !== -1)
    }
    else if (current === 'synopsis_evaluating') {
      return edition.abstract.statuses.filter(stats => ['synopsis_rejected', 'synopsis_waiting_upd', 'synopsis_approved'].indexOf(stats) !== -1)
    }

    return edition.abstract.statuses
  }


  return (<div className="eval-form">
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >{({values, touched, errors, isSubmitting, isValid, setFieldValue}) => (
      <Form>
        {/*<pre>{JSON.stringify(values, null, 2)}</pre>*/}
        <fieldset disabled={!evaluation.isEditable()}>

          <h5 className="border-bottom pb-2 mb-3">{evaluation.statusPassed('synopsis_approved')
            ? 'Sua avaliação do trabalho' : 'Sua avaliação da sinopse'}</h5>
          {questions && Object.keys(initialValues.answers).map(key => {
            return <div key={key} className="form-group">
              <Switch name={`answers.${key}`} label={questions[key]}/>
            </div>
          })}

          <div className="form-group row">
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
          </div>


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

        </fieldset>
        <div className=" my-2 text-right">
          <button onClick={() => router.back()} type="button" className="btn btn-sm btn-light">cancelar</button>
        </div>
      </Form>
    )}</Formik>
  </div>)
}
