import { useEffect } from "react"
import { AuthorSchema } from "../../../src/types/authors-panel"
import useTrans from "../../hooks/useTrans"
import AuthorListItem from "./author-list-item"
import AuthorProvider, { useAuthorsContext } from "./authors-context"
import s from "./authors-panel.module.scss"
import SearchAuthor from "./search-author"
import { dump } from "../../../src/helpers"
import { useRouter } from "next/router"
import useSettings from "../../hooks/useSettings"

interface AuthorsPanelProps {
    abstractId: number|null|undefined
    tempId: string|null|undefined
    data: AuthorSchema[]
    mainAuthorId?: number
    disabled?: boolean
    maxAuthors?: number
}
/**
 * O contexto subiu para 'pages\abstracts\[id].tsx'
 * @param props 
 * @returns 
 */
export function MainWithContext(props: AuthorsPanelProps){

    return <AuthorProvider>
        <AuthorsPanel {...props} />
    </AuthorProvider>
}

export default function AuthorsPanel(props: AuthorsPanelProps){

    const router = useRouter()
    const lang = router.locale
    const t = useTrans()
    const {abstractId, tempId, data: originalData, disabled, maxAuthors, mainAuthorId} = props
    const {data, setData, setAbstractId} = useAuthorsContext()
    const count = data.filter(a => a._active !== false).length
    const { currentEdition: edition } = useSettings()
  const AbstractCnf = edition?.Abstract()
  const FieldAuthors2 = AbstractCnf?.getField('authors2')
    const existsInvalid = data.map(a => isProfileComplete(a)).filter(a => !a).length > 0
    const isOnLimit = maxAuthors ? count >= maxAuthors : false

function isProfileComplete(author: AuthorSchema){
    if(!author.name || !author.email) return false
    if(FieldAuthors2.bio_max > 0 && !author.bio) return false
    if(FieldAuthors2.bio2_max > 0 && !author.bio2) return false
    if(FieldAuthors2.bio3_max > 0 && !author.bio3) return false
    return true
  }
    useEffect(()=>{
        const data = originalData.map((author) => {
            return {...author, _main: author.wp_user_id == mainAuthorId}
        })
        setData([...data])
        setAbstractId(abstractId)
    }, [originalData, abstractId])

    return <div className="bg-light mb-3">
        <div className={`${s.header}`}>
            <div className="label">{t('autores')}</div>
            {maxAuthors && <small>({t('trabalho.maximo-de')} {maxAuthors})</small>}
        </div>
        {existsInvalid && 
        <div className="alert alert-warning text-sm">
            {t('autor.complete-informacoes')}
        </div>}
        
        <div className={s.list}>
            {/* {dump(data)} */}
            {(data.length > 0 && data.map((author) => {
                return <AuthorListItem key={author.id} abstractId={abstractId} tempId={tempId} author={author} isMainAuthor={mainAuthorId == author.wp_user_id} />
            })) }
        </div>
        {(!isOnLimit && abstractId) && 
        <div className={s.search}>
            <SearchAuthor abstractId={abstractId} onAdded={()=>{}} />
        </div>}
        {!abstractId && <div className="alert alert-warning">
            {lang == 'pt' 
                ? 'Salve o trabalho antes de adicionar autores.' 
                : 'Guarde su trabajo antes de agregar autores.'}
        </div>}

    </div>
}