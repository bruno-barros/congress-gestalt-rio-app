import {Edition} from "../../src/resources/event";
import React, {useState} from "react";
import {Field, Form, Formik} from "formik";
import * as Yup from 'yup'
import Text from "../ui/form/formik/text";
import {LoadingButton} from "@brunobarros/react-components";
import useTrans from "../hooks/useTrans";
import Select from "../ui/form/formik/select";
import Attachments from "../ui/form/formik/attachments";
import Authors from "../ui/form/formik/authors";
import {generate_tmp_id, rand} from "../../src/helpers";
import useCurrentUser from "../hooks/useCurrentUser";
import {WpAbstract} from "../../src/http/wp-abstract";
import {useDispatch} from "react-redux";
import {blockUi} from "../../src/store/ui.actions";
import {useRouter} from "next/router";
import Abstract from "../../src/resources/abstract";
import AuthorEditModal from "./author-edit-modal";
import {errorNotification, exceptionNotification, successNotification} from "../../src/resources/responses";
import Tags from "../ui/form/formik/tags";
import Wysiwyg from "../ui/form/formik/wysiwyg";
import isFormDisabled from "../ui/form/form-helpers";
import {useQueryClient} from "react-query";


interface AbstractFormProps {
  edition: Edition
  abstract: null | Abstract
}

export default function AbstractForm(props: AbstractFormProps) {

  const t = useTrans()
  const disp = useDispatch()
  const queryClient = useQueryClient()
  const router = useRouter()
  const {user} = useCurrentUser()
  const {edition, abstract} = props
  const [authorModal, setAuthorModal] = useState({show: false, author: null, metadata: null})
  const isEditing = !!abstract
  const isEditable1 = user.canManageAbstracts() || (!isFormDisabled(abstract?.status) && !abstract?.statusPassed('synopsis_approved'))
  const isEditable2 = user.canManageAbstracts() || (!isFormDisabled(abstract?.status) && abstract?.statusPassed('synopsis_approved'))

  const initialAuthor = isEditing ? {} : {
    id: null,
    author_name: user.getUserData().name,
    author_email: user.getUserData().email,
    author_bio: user.getUserData().description || '',
    uuid: null
  }

  const initialValues = {
    _intent: 'update',// update | review
    id: !abstract ? null : abstract.databaseId,
    tmp_id: !abstract ? generate_tmp_id(user.getId()) : null,
    topic: abstract?.topic || '',
    title: abstract?.title || '',
    subtitle: abstract?.subtitle || '',
    tags: abstract?.abstract_tags || [],
    resume: abstract?.excerpt || '',
    content: abstract?.content || '',
    bibliography: abstract?.bibliography || '',
    attachments: abstract?.attachments || [],
    authors: abstract?.authors || [],
  }
  const Validation = Yup.object().shape({
    topic: Yup.string().required('validacao.obrigatorio'),
    title: Yup.string().required('validacao.obrigatorio'),
    // subtitle: Yup.string().required('validacao.obrigatorio'),
    tags: Yup.array().min(edition.abstract.tags.min, 'validacao.obrigatorio')
      .max(edition.abstract.tags.max).required('validacao.obrigatorio'),
    resume: Yup.string().required('validacao.obrigatorio'),
    content: Yup.string().when('topic', {
      is: (val) => abstract?.statusPassed('synopsis_waiting_upd') && edition.abstract.required_fields?.content,
      then: Yup.string().required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    // bibliography: Yup.string().required('validacao.obrigatorio'),
    attachments: Yup.array().when('topic', {
      is: (val) => abstract?.statusPassed('synopsis_waiting_upd') && edition.abstract.required_fields?.attachments,
      then: Yup.array().required('validacao.obrigatorio'),
      otherwise: Yup.array().notRequired()
    }),
    authors: Yup.array().required('validacao.obrigatorio'),
  })

  async function handleSubmit(values) {
    values.locale = router.locale
    if (!isEditing) {
      values.edition_id = edition.id
      values.author_id = user.getId()
    }

    disp(blockUi(true))
    try {
      const resp = await WpAbstract.update(values)
      const success = resp.data.success
      const data = resp.data.data
      disp(blockUi(false))
      if (success) {
        queryClient.invalidateQueries(['abstract', abstract.databaseId])
        successNotification({
          message: isEditing ? t('atualizado-com-sucesso') : t('trabalho.criado-com-sucesso'),
          heroTitle: isEditing ? null : t('parabens')
        })
        if (!isEditing) router.push(`/abstracts/${data.ID}?created=1`)
        if (isEditing && data._intent === 'review') router.reload()
      } else {
        errorNotification({message: data.msg})
      }
    } catch (err) {
      exceptionNotification(err, disp)
    }
  }

  function handleCloseAuthorModal() {
    setAuthorModal({show: false, author: null, metadata: null})
  }

  return (<Formik
    initialValues={initialValues}
    validationSchema={Validation}
    onSubmit={handleSubmit}
  >{({errors, values, isValid, setFieldValue, submitForm}) => (<>
    <Form>

      {(!isEditable1 && !isEditable2)
      && <div className="alert alert-warning">
        {t('trabalho.nao-pode-editar')}
      </div>}
      <fieldset disabled={!isEditable1}>
        {/*<code style={{maxWidth: 700}}>{JSON.stringify(values, null, 2)}</code>*/}
        <Select name="topic" label={t('trabalho.topico')}>
          <option value="" disabled></option>
          {edition?.abstract?.topics
          && edition.abstract.topics.map(top => <option key={top.id} value={top.id}>{top[router.locale]}</option>)}
        </Select>
        <Text name="title" label={t('trabalho.titulo')}/>
        <Text name="subtitle" label={t('trabalho.subtitulo')}/>
        <Tags name="tags" label="Tags" maxTags={edition.abstract.tags.max} disabled={!isEditable1}/>
        <Wysiwyg name="resume" label={t('trabalho.resumo')} maxHeight="sm" disabled={!isEditable1}/>

      </fieldset>
      <fieldset disabled={!isEditable2}>
        {abstract?.statusPassed('synopsis_waiting_upd') &&
        <Wysiwyg name="content" label={t('trabalho.conteudo')} maxHeight="lg" disabled={!isEditable2}/>}

        {abstract?.statusPassed('synopsis_waiting_upd') &&
        <Wysiwyg name="bibliography" label={t('trabalho.bibliografia')} maxHeight="md" disabled={!isEditable2}/>}

        <Authors name="authors" label={t('autores')} maxAuthors={edition.abstract.authors.max}
                 metas={{context: 'abstract', abstract_id: abstract?.databaseId, tmp_id: values.tmp_id}}
                 disabled={!isEditable1}
                 initialAuthor={initialAuthor}
                 onEdit={(author, metadata) => {
                   setAuthorModal({show: true, author, metadata})
                 }}/>


        {(edition.abstract.attachments && abstract?.statusPassed('synopsis_waiting_upd')) &&
        <Attachments name="attachments" label={t('anexos')}
                     maxFiles={edition.abstract.attachments}
                     metas={{context: 'abstract', abstract_id: abstract?.databaseId, tmp_id: values.tmp_id}}
                     disabled={!isEditable2}/>}

      </fieldset>
      <Field name="_intent" type="hidden"/>
      {(isEditable1 || isEditable2) && <div className="row">
        <div className={`pb-3 pb-md-0 ${isEditing ? 'col-12 col-md-auto col-lg-5' : 'col-12'}`}>
          <LoadingButton variant="secondary" size="lg" block loading={false}
                         disable={!isValid}>{t(abstract ? 'trabalho.atualizar' : 'trabalho.submeter')}</LoadingButton>
        </div>
        {isEditing
        && <div className="col-12 col-md">
          <LoadingButton type="button" variant="primary" size="lg" block loading={false}
                         disable={!isValid} onClick={() => {
            setFieldValue('_intent', 'review')
            submitForm()
          }}>{t(abstract ? 'trabalho.atualizar-e-submeter' : 'trabalho.submeter')}</LoadingButton>
        </div>}
      </div>}


    </Form>
    <AuthorEditModal
      show={authorModal.show}
      author={authorModal.author}
      metadata={authorModal.metadata}
      onDismiss={handleCloseAuthorModal}
      onUpdate={(author) => {
        const newAuthors = values.authors.map(a => {
          if (parseInt(a.id) === parseInt(author.id)) a = author
          return a
        })
        setFieldValue('authors', newAuthors)
      }}
    />
  </>)}
  </Formik>)
}
