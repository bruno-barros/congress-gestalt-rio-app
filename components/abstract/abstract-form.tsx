import Edition from "../../src/resources/edition";
import React, {useRef, useState} from "react";
import {Field, Form, Formik, FormikProps} from "formik";
import * as Yup from 'yup'
import Text from "../ui/form/formik/text";
import useTrans from "../hooks/useTrans";
import Select from "../ui/form/formik/select";
import Attachments from "../ui/form/formik/attachments";
import Authors from "../ui/form/formik/authors";
import { dump, generate_tmp_id, MapLocales, rand, specialValidationRules } from '../../src/helpers';
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
import Switch from '../ui/form/formik/switch';
import Button from "react-bootstrap/cjs/Button";
import AbstractConsentTerms from './abstract-consent-terms';
import LoadingButton from "../ui/loading-button";
import { ac } from "../access-control";
import { REQUIREMENTS } from "../access-control/requirements";
import AuthorsPanel from "./authors/authors-panel";



interface AbstractFormProps {
  edition: Edition
  abstract: null | Abstract
}

export default function AbstractForm(props: AbstractFormProps) {

  const t = useTrans()
  const disp = useDispatch()
  const queryClient = useQueryClient()
  const router = useRouter()
  const lang = router.locale
  const {user} = useCurrentUser()
  const {edition, abstract} = props
  abstract?.setEdition(edition)
  const [authorModal, setAuthorModal] = useState({show: false, author: null, metadata: null})
  const isEditing = !!abstract
  const canManage = ac(user, [REQUIREMENTS.abstract.manage])
  const isEditable1 = canManage || (!isFormDisabled(abstract?.status) && !abstract?.statusPassed('synopsis_approved'))
  const isEditable2 = canManage || (!isFormDisabled(abstract?.status) && abstract?.statusPassed('synopsis_rejected'))
  const [consentModal, setConsentModal] = useState(false)
  const form = useRef<FormikProps<any>>(null)
  const AbstractCnf = edition?.Abstract()
  const FieldTitle = AbstractCnf.getField('title')
  const FieldTag = AbstractCnf.getField('tags')
  const FieldResume = AbstractCnf.getField('resume')
  const FieldContent = AbstractCnf.getField('content')
  const FieldBibliography = AbstractCnf.getField('bibliography')
  const FieldAttachments = AbstractCnf.getField('attachments')
  const FieldAuthors = AbstractCnf.getField('authors')
  const FieldAuthors2 = AbstractCnf.getField('authors2')

  const initialAuthor = isEditing ? {} : {
    id: null,
    name: user.getUserData().name,
    email: user.getUserData().email,
    bio: user.getUserData().description || '',
    company: user.getUserData().institution_name || '',
    uuid: null
  }
//region initialValues
  const initialValues = {
    _intent: 'update',// update | review
    id: !abstract ? null : abstract.databaseId,
    tmp_id: !abstract ? generate_tmp_id(user.getId()) : null,
    main_language: abstract?.getMainLanguage() || 'pt',
    topic: abstract?.topic || '',
    type: abstract?.type || '', // modality
    title: abstract?.title || '',
    title_es: abstract?.title_es || '',
    subtitle: abstract?.subtitle || '',
    tags: abstract?.abstract_tags || [],
    tags_es: abstract?.abstract_tags_es || [],
    resume: abstract?.excerpt || '',
    content: abstract?.content || '',
    bibliography: abstract?.bibliography || '',
    attachments: abstract?.attachments || [],
    professional_proof: abstract?.professional_proof || [],
    authors: abstract?.authors || [initialAuthor],
    jlp: abstract?.jlp || false,
  }
  //region Validation
  const Validation = Yup.object().shape({
    main_language: Yup.string().required('validacao.obrigatorio'),
    topic: Yup.string().required('validacao.obrigatorio'),
    type: Yup.string().required('validacao.obrigatorio'),
    title: Yup.string().max(FieldTitle.max).required('validacao.obrigatorio'),
    // subtitle: Yup.string().required('validacao.obrigatorio'),
    tags: Yup.array().min(FieldTag.min, 'validacao.obrigatorio')
      .max(FieldTag.max).required('validacao.obrigatorio'),
    tags_es: Yup.array().min(FieldTag.min, 'validacao.obrigatorio')
      .max(FieldTag.max).required('validacao.obrigatorio'),
    resume:  Yup.string().when('type', {
      is: (val) => FieldResume.allowed && !user.byPassSynopsis(),
      then: Yup.string().required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    content: Yup.string().when('topic', {
      is: (val) => abstract?.statusPassed('synopsis_waiting_upd') && !!edition.abstract.required_fields?.content?.min,
      then: Yup.string().required('validacao.obrigatorio'),
      otherwise: Yup.string().notRequired()
    }),
    // bibliography: Yup.string().required('validacao.obrigatorio'),
    attachments: Yup.array().when('topic', {
      is: (val) => abstract?.statusPassed('synopsis_waiting_upd') && FieldAttachments.min > 0,
      then: Yup.array().required('validacao.obrigatorio'),
      otherwise: Yup.array().notRequired()
    }),
    professional_proof: Yup.array().when('type', {
      is: (val) => val === 'WS',
      then: Yup.array().required('validacao.obrigatorio'),
      otherwise: Yup.array().notRequired()
    }),
    authors:  Yup.array().when('topic', {
      is: (val) => !!edition.abstract.required_fields?.authors?.min,
      then: Yup.array().required('validacao.obrigatorio'),
      otherwise: Yup.array().notRequired()
    }),
  })
//region Submit
  async function handleSubmit(values) {
    values.locale = router.locale
    if (!isEditing) {
      values.edition_id = edition.getId()
    }

    disp(blockUi(true))
    try {
      const resp = await WpAbstract.update(values)
      const success = resp.data.success
      const data = resp.data.data
      disp(blockUi(false))
      if (success) {
        successNotification({
          message: isEditing ? t('atualizado-com-sucesso') : t('trabalho.criado-com-sucesso'),
          heroTitle: isEditing ? null : t('parabens')
        })
        if (!isEditing) {
          let redirect = `/abstracts/${data.ID}`
          if(!user.byPassSynopsis()) redirect = `${redirect}?created=1`
          setTimeout(()=> router.push(redirect), 2000)
        }
        if(isEditing) queryClient.invalidateQueries(['abstract', abstract?.databaseId])
        if (isEditing && data._intent === 'review') router.reload()
      } else {
        errorNotification({message: resp.data?.message || data.msg})
      }
    } catch (err) {
      exceptionNotification(err, disp)
    }
  }

  function handleCloseAuthorModal() {
    setAuthorModal({show: false, author: null, metadata: null})
  }

  //region Formik
  return (<Formik
    innerRef={form}
    initialValues={initialValues}
    validationSchema={Validation}
    validateOnChange={true}
    validateOnMount={true}
    onSubmit={handleSubmit}
  >{({errors, values, isValid, setFieldValue, submitForm}) => (<>
    <Form onChange={()=>{
      // console.log('form changed', form.current?.)
    }}>
      {abstract && <h2>#{abstract.databaseId}</h2>}
      {(!isEditable1 && !isEditable2)
      && <div className="alert alert-warning">
        {t('trabalho.nao-pode-editar')}
      </div>}
      {(user.byPassSynopsis() && !isEditing) && <div className="alert alert-warning">
        Caro, {user.getUserData().name}. <br/>
        Seu trabalho não passará pela validação da sinopse. Após registrar os dados básicos, você poderá anexar o trabalho final.
      </div>}

      {/* {dump({
        isEditing,
        edition_id: edition.getId(),
      })} */}

      <fieldset disabled={!isEditable1}>
        
        <Select name="main_language" label={t('trabalho.idioma_principal')}>
          <option value="" disabled></option>
          {MapLocales.map(top => <option key={top.app} value={top.app}>{top.label}</option>)}
        </Select>

        {(AbstractCnf.getTopics().length > 0) && 
        <Select name="topic" label={t('trabalho.topico')}>
          <option value="" disabled></option>
          {AbstractCnf.getTopics().map(top => <option key={top.id} value={top.id}>{top[router.locale]}</option>)}
        </Select>}
        
        {(AbstractCnf.getModalities().length > 0) &&
        <Select name="type" label={t('trabalho.tipo')}>
          <option value="" disabled></option>
          {AbstractCnf.getModalities().map(t => <option key={t.id} value={t.id}>{t[router.locale]}</option>)}
        </Select>}

        {/* {dump({
          modalidade: values.type,
        })} */}
        {values.type === 'WS' && <div className="">
          <Attachments name="professional_proof" label={lang == 'pt' ? 'Comprovante Profissional' : 'Comprobante Profesional'}
            maxFiles={1}
            metas={{context: 'professional_proof', abstract_id: abstract?.databaseId, tmp_id: values.tmp_id}}
            disabled={!isEditable2}
            info={lang === 'pt' ? 'Envie um comprovante de que possui, no mínimo, 5 anos de formação como Gestalt-terapeuta.' : 'Enviar prueba de que tienes al menos 5 años de formación como terapeuta Gestalt.'}
            />
          </div>}
        
        <Text name="title" label={`${t('trabalho.titulo')} (em português)`} description={`Entre ${FieldTitle.min} e ${FieldTitle.max} caracteres`}/>
        <Text name="title_es" label={`${t('trabalho.titulo')} (en español)`} description={`Entre ${FieldTitle.min} y ${FieldTitle.max} caracteres`}/>

        {edition.getFieldMax('subtitle') > 0 &&
        <Text name="subtitle" label={t('trabalho.subtitulo')}/>}
  
        {FieldTag.allowed &&
        <Tags name="tags" label={`${t('trabalho.tags')} (em português)`} minTags={FieldTag.min} maxTags={FieldTag.max} disabled={!isEditable1}/>}
        {FieldTag.allowed &&
        <Tags name="tags_es" label={`${t('trabalho.tags')} (en español)`} minTags={FieldTag.min} maxTags={FieldTag.max} disabled={!isEditable1}/>}

        {(!user.byPassSynopsis() && FieldResume.allowed) &&
        <Wysiwyg name="resume" label={t('trabalho.sinopse')}
        maxHeight="md" disabled={!isEditable1}
                 charsMin={FieldResume.min}
                 charsMax={FieldResume.max}
                 countMethod={`char`}/>}


      </fieldset>
      <fieldset disabled={!isEditable2}>
        {(abstract?.statusPassed('synopsis_waiting_upd') && FieldContent.allowed) &&
        <Wysiwyg name="content" label={t('trabalho.conteudo')} maxHeight="lg" disabled={!isEditable2}
                 charsMin={FieldContent.min} charsMax={FieldContent.max}
                 countMethod={`char`}/>}
        
        {FieldBibliography.allowed && 
        <Wysiwyg name="bibliography" label={t('trabalho.bibliografia')}
        maxHeight="md" disabled={!isEditable1}
                 charsMin={FieldBibliography.min}
                 charsMax={FieldBibliography.max}
                 countMethod={`char`}/>}
        
        {/* {dump({
          status: abstract?.status,
          passouSinopsis: abstract?.statusPassed('synopsis_waiting_upd'),
          ableAttach: abstract?.isAbleToAttach() || 'NAO'
        })} */}

        {(FieldAttachments.allowed && abstract?.isAbleToAttach()) && (<>{abstract?.hasConsentsAgreement() 
          ? (<Attachments name="attachments" label={t('anexos')}
                     maxFiles={FieldAttachments.max}
                     metas={{context: 'abstract', abstract_id: abstract?.databaseId, tmp_id: values.tmp_id}}
                     disabled={!isEditable2}
                     info={FieldAttachments[`info_${lang}`]}
                     />
          ) : (
          <div className="bg-light p-3 mb-3">
            <div className="mb-2">{t('anexos')}</div>
            <div className="d-md-flex align-items-center">
            <Button variant="warning" className="col-auto" onClick={()=>{
              setConsentModal(true)
            }}>{t('termo-autorizacao')}</Button>
            <div className="mt-1 mt-md-0 ml-md-4 text-xs">{t('termo-autorizacao-concordar')}</div>
            </div>
            <AbstractConsentTerms show={consentModal} abstract={abstract} onDismiss={()=>{
              setConsentModal(false)
            }}/>
          </div>)}</>
          )}

      </fieldset>

      {/* Exclusivo para ABRISCO */}
      {(false && abstract?.statusPassed('synopsis_waiting_upd')) &&
      <Switch name="jlp" label={<span>Gostaria que seu trabalho fosse considerado no <a href="https://www.journals.elsevier.com/journal-of-loss-prevention-in-the-process-industries" target="_blank">Journal of Loss Prevention in the Process Industries (JLP)</a></span>} />}

      <fieldset disabled={!isEditable1 && !isEditable2}>
        {
          //region Autores 1
        }
        {(FieldAuthors.allowed && !FieldAuthors2.allowed) && 
          <Authors name="authors" label={t('autores')} maxAuthors={FieldAuthors.max}
            metas={{context: 'abstract', abstract_id: abstract?.databaseId, tmp_id: values.tmp_id}}
            mainAuthor={abstract?.author?.node || user.getUserData()}
            disabled={!isEditable1 && !isEditable2}
            creating={!isEditing}
            onEdit={(author, metadata) => {
              setAuthorModal({show: true, author, metadata})
            }}/>}
        {
          //region Autores 2
        }
        {(FieldAuthors2.allowed && !FieldAuthors.allowed) && 
          <></>}
          <AuthorsPanel 
            abstractId={abstract?.databaseId} 
            tempId={values.tmp_id}
            data={values.authors}
            mainAuthorId={abstract?.authorDatabaseId}
            maxAuthors={FieldAuthors2.max}
            disabled={!isEditable1 && !isEditable2}/>
        
      </fieldset>
      <Field name="_intent" type="hidden"/>
      {dump(errors)}
      {dump(values)}

      {(isEditable1 || isEditable2) && <div className="row">
        <div className={`pb-3 pb-md-0 ${isEditing ? 'col-12 col-md-auto col-lg-5' : 'col-12'}`}>
          <LoadingButton variant="secondary" size="lg" block loading={false}
                         disable={!isValid}>{t(abstract ? 'trabalho.atualizar' : 'trabalho.submeter')}</LoadingButton>
        </div>
        {(isEditing && abstract.status !== 'approved')
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
