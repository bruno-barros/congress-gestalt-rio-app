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
import Error from "../../../../src/resources/error";
import Sweet from "../../sweet-alert";
import {errorNotification, exceptionNotification, successNotification} from "../../../../src/resources/responses";
import ToolTip from "../../tooltip";

interface AuthorsProps {
  label: string
  metas: any
  containerClass?: string
  maxAuthors?: number
  disabled?: boolean
  initialAuthor?: {id: null; author_name: string; author_email: string; author_bio: string; uuid: null}
  onEdit: (author, metadata) => void
}

export default function Authors({label, metas, containerClass, maxAuthors: ma, disabled, initialAuthor, onEdit, ...props}: AuthorsProps & any) {

  const disp = useDispatch()
  const t = useTrans()
  const router = useRouter()
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  const [newAuthor, setNewAuthor] = useState(initialAuthor || {id: null, author_name: '', author_email: '', author_bio: '', uuid: null});
  const maxAuthors = ma || 6

  async function handleAdd(push) {

    // fast validation
    if (newAuthor.author_name.length < 2 || newAuthor.author_email.length < 5 || newAuthor.author_bio.length < 2) {
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
        locale: router.locale
      })
      disp(blockUi(false))
      const success = resp.data.success
      const data = resp.data.data

      if (!success) {
        errorNotification({message: data.msg})
      } else {
        successNotification({message: t('atualizado-com-sucesso')})
        let author: any = {...newAuthor}
        author.name = author.author_name
        author.email = author.author_email
        author.bio = author.author_bio
        author.uuid = metas.tmp_id || null
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
    newAuthor.is_speaker = !author.is_speaker
    try {
      newAuthor.locale = router.locale
      newAuthor.abstract_id = metas.abstract_id
      const resp = await WpAbstract.editAuthor(newAuthor)
      const success = resp.data.success
      if (success) successNotification({message: t('atualizado-com-sucesso')})
    } catch (err) {
      exceptionNotification(err)
    }
    const newValue = field.value.map(a => {
      if (parseInt(a.id) === parseInt(newAuthor.id)) a = newAuthor
      return a
    })
    helpers.setValue(newValue)
  }

  function reset() {
    setNewAuthor({id: null, author_name: '', author_email: '', author_bio: '', uuid: null})
  }

  return (<div className={`form-panel bg-light p-4 mb-3 ${err && 'has-error'}`}>
    <div className="header">{label} <small>({t('trabalho.maximo-de')} {maxAuthors})</small></div>
    <FieldArray name={field.name}>{({insert, remove, push}) => {

      return (<div className="attachments-container">
        {field.value?.length > 0 && field.value.map((author, idx) => (
          <div className="border  py-2 px-4" key={idx} style={{margin: '0 -1.5rem'}}>
            <div className="d-flex align-items-center justify-content-between">
              <a href="" className="d-flex flex-grow-1" onClick={(e) => {
                e.preventDefault()
                onEdit(author, metas)
              }}>
                <div className="mr-2">{`#${idx + 1}`}</div>
                <div className="text-truncate">{author.name}</div>
              </a>
              {!disabled && <>
                <ToolTip text={t(author.is_speaker ? 'trabalho.e-apresentador':'trabalho.nao-e-apresentador')}>
                  <button type="button" className="btn btn-sm py-0" style={{lineHeight: 1}} onClick={() => {
                    handleSpeaker(author)
                  }}><Icon name={`${author.is_speaker ? 'mic-outline' : 'mic-off-outline'}`} style={{fontSize: 20}}/>
                  </button>
                </ToolTip>
                <button type="button" className="btn btn-sm py-0" style={{lineHeight: 1}} onClick={() => {
                  handleDeletion(remove, author, idx)
                }}><Icon name={`trash-outline`} style={{fontSize: 18}}/>
                </button>
              </>}

            </div>
          </div>
        ))}

        {(maxAuthors > field.value.length && !disabled)
        && <div className="mt-3">

          <div className="input-group">
            <div className="input-group-prepend"><span className="input-group-text"
                                                       style={{minWidth: 70}}>{t('cadastro.nome')}</span>
            </div>
            <input type="text" name="author_name" value={newAuthor.author_name} placeholder={t('trabalho.autor-nome')}
                   className="form-control" onChange={(e) => {
              setNewAuthor({...newAuthor, [e.target.name]: e.target.value})
            }}/>
          </div>
          <div className="input-group">
            <div className="input-group-prepend"><span className="input-group-text" style={{minWidth: 70}}>E-mail</span>
            </div>
            <input type="email" name="author_email" value={newAuthor.author_email}
                   placeholder={t('trabalho.autor-email')}
                   className="form-control" onChange={(e) => {
              setNewAuthor({...newAuthor, [e.target.name]: e.target.value})
            }}/>
          </div>
          <div className="input-group">
            <div className="input-group-prepend"><span className="input-group-text" style={{minWidth: 70}}>Bio</span>
            </div>
            <textarea rows={3} name="author_bio" value={newAuthor.author_bio} placeholder={t('trabalho.autor-bio')}
                      className="form-control" onChange={(e) => {
              setNewAuthor({...newAuthor, [e.target.name]: e.target.value})
            }}/>
          </div>
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
