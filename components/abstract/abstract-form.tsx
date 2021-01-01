import {Edition} from "../../src/resources/event";
import React, {useState} from "react";
import {FieldArray, Form, Formik} from "formik";
import * as Yup from 'yup'
import Text from "../ui/form/formik/text";
import {LoadingButton} from "@brunobarros/react-components";
import useTrans from "../hooks/useTrans";
import Select from "../ui/form/formik/select";
import Textarea from "../ui/form/formik/textarea";
import Attachments from "../ui/form/formik/attachments";
import Authors from "../ui/form/formik/authors";
import {generate_tmp_id, rand} from "../../src/helpers";
import useCurrentUser from "../hooks/useCurrentUser";
import {WpAbstract} from "../../src/http/wp-abstract";
import {useDispatch} from "react-redux";
import {blockUi} from "../../src/store/ui.actions";
import Error from "../../src/resources/error";
import {toast} from "react-toastify";
import {useRouter} from "next/router";
import Sweet from "../ui/sweet-alert";
import Abstract from "../../src/resources/abstract";

interface AbstractFormProps {
  edition: Edition
  abstract: null | Abstract
}

export default function AbstractForm(props: AbstractFormProps) {

  const t = useTrans()
  const disp = useDispatch()
  const router = useRouter()
  const {user} = useCurrentUser()
  const {edition, abstract} = props
  const [loading, setLoading] = useState(false)
  const isEditing = !!abstract
  const initialValues = {
    id: !abstract ? null : abstract.databaseId,
    tmp_id: !abstract ? generate_tmp_id(user.getId()) : null,
    topic: abstract?.topic || '',
    title: abstract?.title || '',
    subtitle: abstract?.subtitle || '',
    tags: abstract?.abstract_tags || '',
    resume: abstract?.excerpt || '',
    synopsis: abstract?.synopsis || '',
    content: abstract?.content || '',
    bibliography: abstract?.bibliography || '',
    attachments: abstract?.attachments || [],
    authors: abstract?.authors || [],
  }
  const Validation = Yup.object().shape({
    topic: Yup.string().required('validacao.obrigatorio'),
    title: Yup.string().required('validacao.obrigatorio'),
    // subtitle: Yup.string().required('validacao.obrigatorio'),
    tags: Yup.string().required('validacao.obrigatorio'),
    resume: Yup.string().required('validacao.obrigatorio'),
    synopsis: Yup.string().required('validacao.obrigatorio'),
    content: Yup.string().required('validacao.obrigatorio'),
    // bibliography: Yup.string().required('validacao.obrigatorio'),
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
        if (!isEditing) {
          Sweet.fire({
            icon: 'success',
            title: t('parabens'),
            text: t('trabalho.criado-com-sucesso'),
            showCloseButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        } else {
          toast.success(t('atualizado-com-sucesso'))
        }
        router.push(`/abstracts/${data.ID}${!isEditing ? '?created=1' : ''}`)
      } else {
        toast.error(data.msg)
      }
    } catch (err) {
      const error = Error.make(err)
      toast.error(error.message)
      disp(blockUi(false))
    }
  }

  return (<Formik
    initialValues={initialValues}
    validationSchema={Validation}
    onSubmit={handleSubmit}
  >{({errors, values, isValid}) => (
    <Form>
      <Select name="topic" label={t('trabalho.topico')}>
        <option value="" disabled></option>
        {edition?.abstract?.topics
        && edition.abstract.topics.map(top => <option key={top} value={top}>{t(`topico.${top}`)}</option>)}
      </Select>
      <Text name="title" label={t('trabalho.titulo')}/>
      <Text name="subtitle" label={t('trabalho.subtitulo')}/>
      <Text name="tags" label="Tags"/>
      <Textarea name="resume" label={t('trabalho.resumo')}/>
      <Textarea name="synopsis" label={t('trabalho.sinopse')}/>
      <Textarea name="content" label={t('trabalho.conteudo')}/>
      <Textarea name="bibliography" label={t('trabalho.bibliografia')}/>
      <Attachments name="attachments" label={t('anexos')} maxFiles={edition.abstract.attachments}
                   metas={{context: 'abstract', abstract_id: abstract?.databaseId, tmp_id: values.tmp_id}}/>
      <Authors name="authors" label={t('autores')} maxAuthors={edition.abstract.authors.max}
               metas={{context: 'abstract', abstract_id: abstract?.databaseId, tmp_id: values.tmp_id}}/>
      <LoadingButton variant="primary" className=" " block loading={loading}
                     disable={!isValid}>{t(abstract ? 'trabalho.atualizar' : 'trabalho.submeter')}</LoadingButton>

    </Form>
  )}
  </Formik>)
}
