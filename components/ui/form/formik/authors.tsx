import {FieldArray, Form, Formik, useField} from "formik";
import FieldError from "../field-error";
import React, {useRef, useState} from "react";
import {Icon} from "@brunobarros/react-components";
import Text from "./text";
import {useDispatch} from "react-redux";
import {blockUi} from "../../../../src/store/ui.actions";
import {toast} from "react-toastify";
import useTrans from "../../../hooks/useTrans";
import {WpAbstract} from "../../../../src/http/wp-abstract";
import {useRouter} from "next/router";
import Error from "../../../../src/resources/error";
import Sweet from "../../sweet-alert";
import Swal from "sweetalert2";
import WpDocument from "../../../../src/http/wp-document";
import WpUser from "../../../../src/http/wp-user";
import AuthorLine from "./author-line";

interface AuthorsProps {
  label: string
  metas: any
  containerClass?: string
  maxAuthors?: number
}

export default function Authors({label, metas, containerClass, maxAuthors: ma, ...props}: AuthorsProps & any) {

  const disp = useDispatch()
  const t = useTrans()
  const router = useRouter()
  // @ts-ignore
  const [field, meta, helpers] = useField(props);
  const err = meta?.touched && meta?.error
  const [metaData, setMetaData] = useState<any>(metas);
  const [newAuthor, setNewAuthor] = useState({id: null, author_name: '', author_email: '', author_bio: '', uuid: null});
  const added = useRef(false)
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

      const success = resp.data.success
      const data = resp.data.data

      if (!success) {
        toast.error(data.msg)
      } else {
        toast.success(t('atualizado-com-sucesso'))
        let author: any = {...newAuthor}
        author.name = author.author_name
        author.email = author.author_email
        author.bio = author.author_bio
        author.uuid = metas.tmp_id || null
        push(author)
        reset()
      }
      disp(blockUi(false))
    } catch (err) {
      const error = Error.make(err)
      Sweet.fire({
        icon: 'error',
        title: t('erro-generico'),
        showCloseButton: true
      })
      disp(blockUi(false))
    }
  }


  async function handleDeletion(removeFn, author, index) {
    disp(blockUi(true))
    try {
      const resp = await WpAbstract.deleteAuthor({...author, locale: router.locale})
      const success = resp.data.success
      const data = resp.data?.data
      disp(blockUi(false))
      if(success) {
        removeFn(index)
        toast.success(t('trabalho.autor-deletado'))
      }
      else toast.error(data.msg)
    } catch (err) {
      disp(blockUi(false))
      const error = Error.make(err)
      toast.error(error.message)
    }
  }

  function reset() {
    setNewAuthor({id: null, author_name: '', author_email: '', author_bio: '', uuid: null})
  }

  return (<div className={`form-panel bg-light p-4 mb-3 ${err && 'has-error'}`}>
    <div className="header">{label} <small>({t('trabalho.maximo-de')} {maxAuthors})</small></div>
    <FieldArray name={field.name}>{({insert, remove, push}) => {

      return (<div className="attachments-container">
        {field.value?.length > 0 && field.value.map((author, idx) => (
          <AuthorLine key={idx} author={author} index={idx} onDelete={()=>{
            handleDeletion(remove, author, idx)
          }}/>
        ))}

        {maxAuthors > field.value.length
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
