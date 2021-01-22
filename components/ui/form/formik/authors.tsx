import {FieldArray, useField} from "formik";
import FieldError from "../field-error";
import React, {useState} from "react";
import {Icon} from "@brunobarros/react-components";
import {useDispatch} from "react-redux";
import {blockUi} from "../../../../src/store/ui.actions";
import {toast} from "react-toastify";
import useTrans from "../../../hooks/useTrans";
import {WpAbstract} from "../../../../src/http/wp-abstract";
import {useRouter} from "next/router";
import {errorNotification, exceptionNotification, successNotification} from "../../../../src/resources/responses";
import ToolTip from "../../tooltip";
import ButtonDeleteConfirmation from "../../button-delete-confirmation";
import useCurrentUser from "../../../hooks/useCurrentUser";

interface AuthorsProps {
  label: string
  metas: any
  containerClass?: string
  creating: boolean
  maxAuthors?: number
  disabled?: boolean
  onEdit: (author, metadata) => void
}

export default function Authors({label, metas, containerClass, maxAuthors: ma, disabled, creating, onEdit, ...props}: AuthorsProps & any) {

  const disp = useDispatch()
  const t = useTrans()
  const router = useRouter()
  const {user} = useCurrentUser()
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  const [newAuthor, setNewAuthor] = useState({id: null, author_name: '', author_email: '', author_bio: '', author_company: '', uuid: null});
  const maxAuthors = ma || 6

  async function handleAdd(push) {

    // fast validation
    if (newAuthor.author_name.length < 2 || newAuthor.author_email.length < 5) {
      toast.error(t('validacao.todos-sao-obrigatorios'), {toastId: 'author-validation'})
      return;
    }
    disp(blockUi(true))

    try {
      const resp = await WpAbstract.addAuthor({
        tmp_id: metas.tmp_id,
        abstract_id: metas.abstract_id,
        name: newAuthor.author_name,
        email: newAuthor.author_email,
        bio: newAuthor.author_bio,
        company: newAuthor.author_company,
        locale: router.locale
      })
      disp(blockUi(false))
      const success = resp.data.success
      const data = resp.data.data

      if (!success) {
        errorNotification({message: data.msg})
      } else {
        successNotification({message: t('atualizado-com-sucesso')})
        push(data)
        reset()
      }

    } catch (err) {
      exceptionNotification(err, disp)
    }
  }


  async function handleDeletion(removeFn, author, index) {
    disp(blockUi(true))
    try {
      const resp = await WpAbstract.deleteAuthor({...author, locale: router.locale, abstract_id: metas.abstract_id})
      const success = resp.data.success
      const data = resp.data?.data
      disp(blockUi(false))
      if (success) {
        removeFn(index)
        successNotification({message: t('trabalho.autor-deletado')})
      } else toast.error(data.msg)
    } catch (err) {
      exceptionNotification(err, disp)
    }
  }

  async function handleSpeaker(author) {
    const newAuthor = {...author}
    try {
      newAuthor.locale = router.locale
      const resp = await WpAbstract.setSpeaker(newAuthor)
      const success = resp.data.success
      if (success) successNotification({message: t('atualizado-com-sucesso')})
    } catch (err) {
      exceptionNotification(err)
    }
    const newValue = field.value.map(a => {
        a.is_speaker = parseInt(a.id) === parseInt(newAuthor.id)
      return a
    })
    helpers.setValue(newValue)
  }

  function reset() {
    setNewAuthor({id: null, author_name: '', author_email: '', author_bio: '', author_company: '', uuid: null})
  }

  return (<div className={`form-panel bg-light p-4 mb-3 ${err && 'has-error'}`}>
    <div className="header">{label} <small>({t('trabalho.maximo-de')} {maxAuthors})</small></div>

    <FieldArray name={field.name}>{({insert, remove, push}) => {

      return (<div className="attachments-container">
        {field.value?.length > 0 && field.value.map((author, idx) => (
          <div className="border-top border-bottom  py-2 px-4" key={idx} style={{margin: '0 -1.5rem -1px'}}>
            <div className="d-flex align-items-center justify-content-between">
              <a href="" className="d-flex align-items-center flex-grow-1" onClick={(e) => {
                e.preventDefault()
                !creating && !disabled && onEdit(author, metas)
              }}>
                <div className="mr-2">{`#${idx + 1}`}</div>
                <div className="text-truncate mr-3">{author.name}</div>
              </a>
              {(parseInt(author.wp_user_id) === user.getId() || creating && idx === 0) &&
              <span className="badge badge-dark">autor de contato</span>}
              {(!creating && !disabled)
                ? <>
                <ToolTip text={`${t(author.is_speaker ? 'trabalho.e-apresentador':'trabalho.nao-e-apresentador')} (clique para mudar)`}>
                  <button type="button" className="btn btn-sm py-0 d-flex align-items-center" style={{lineHeight: 1}} onClick={() => {
                    handleSpeaker(author)
                  }}>

                    <div className={`badge ${author.is_speaker ? 'badge-warning':'text-muted'}`}
                    style={{opacity: `${author.is_speaker?1:.3}`}}
                    >
                      {t('trabalho.autor-de-apresentacao')}
                    </div>
                    <Icon name={`${author.is_speaker ? 'mic-outline' : 'mic-off-outline'}`} style={{fontSize: 20}}/>
                  </button>
                </ToolTip>
                <ButtonDeleteConfirmation onDelete={()=>{handleDeletion(remove, author, idx)}}/>
              </>
                : author.is_speaker ? <div className="badge badge-warning">{t(author.is_speaker ? 'trabalho.e-apresentador':'trabalho.nao-e-apresentador')}</div> : ''}

            </div>
          </div>
        ))}

        {(maxAuthors > field.value.length && !disabled)
        && <div className="mt-3">
          <div className="form-group text-sm font-weight-bold text-muted">
            {t('trabalho.demais-coaltores')}
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text text-sm" style={{minWidth: 100}}>{t('cadastro.nome')}</span>
            </div>
            <input type="text" name="author_name" value={newAuthor.author_name} placeholder={t('trabalho.autor-nome')}
                   className="form-control" onChange={(e) => {
              setNewAuthor({...newAuthor, [e.target.name]: e.target.value})
            }}/>
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text text-sm" style={{minWidth: 100}}>E-mail</span>
            </div>
            <input type="email" name="author_email" value={newAuthor.author_email}
                   placeholder={t('trabalho.autor-email')}
                   className="form-control" onChange={(e) => {
              setNewAuthor({...newAuthor, [e.target.name]: e.target.value})
            }}/>
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text text-sm" style={{minWidth: 100}}>{t('cadastro.instituicao.instituicao')}</span>
            </div>
            <input type="text" name="author_company" value={newAuthor.author_company}
                   placeholder={t('trabalho.autor-instituicao')}
                   className="form-control" onChange={(e) => {
              setNewAuthor({...newAuthor, [e.target.name]: e.target.value})
            }}/>
          </div>
          {/*<div className="input-group">*/}
          {/*  <div className="input-group-prepend">*/}
          {/*    <span className="input-group-text text-sm" style={{minWidth: 100}}>Bio</span>*/}
          {/*  </div>*/}
          {/*  <textarea rows={3} name="author_bio" value={newAuthor.author_bio} placeholder={t('trabalho.autor-bio')}*/}
          {/*            className="form-control" onChange={(e) => {*/}
          {/*    setNewAuthor({...newAuthor, [e.target.name]: e.target.value})*/}
          {/*  }}/>*/}
          {/*</div>*/}
          <button type="button" onClick={() => {
            handleAdd(push)
          }}
                  className="btn btn-outline-primary btn-sm btn-block mt-1">{t('trabalho.adicionar-autor')}</button>

        </div>}


      </div>)
    }}</FieldArray>
    <FieldError message={err} fieldId={`fld_${field.name}`}/>
  </div>)
}
