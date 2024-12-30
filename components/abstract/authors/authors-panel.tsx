import { useEffect } from "react"
import { AuthorSchema } from "../../../src/types/authors-panel"
import useTrans from "../../hooks/useTrans"
import AuthorListItem from "./author-list-item"
import AuthorProvider, { useAuthorsContext } from "./authors-context"
import s from "./authors-panel.module.scss"
import SearchAuthor from "./search-author"
import { dump } from "../../../src/helpers"
interface AuthorsPanelProps {
    abstractId: number|null|undefined
    tempId: string|null|undefined
    data: AuthorSchema[]
    mainAuthorId?: number
    disabled?: boolean
    maxAuthors?: number
}

export default function MainWithContext(props: AuthorsPanelProps){

    return <AuthorProvider>
        <AuthorsPanel {...props} />
    </AuthorProvider>
}

export function AuthorsPanel(props: AuthorsPanelProps){

    const t = useTrans()
    const {abstractId, tempId, data: originalData, disabled, maxAuthors, mainAuthorId} = props
    const {data, setData} = useAuthorsContext()
    const count = data.length
    const isOnLimit = maxAuthors ? count >= maxAuthors : false
console.log({data, originalData})
    useEffect(()=>{
        setData([...originalData])
    }, [originalData])

    return <div className="bg-light mb-3">
        <div className={`${s.header}`}>
            <div className="label">Autores</div>
            {maxAuthors && <small>({t('trabalho.maximo-de')} {maxAuthors})</small>}
        </div>
        <div className={s.list}>
            {/* {dump(data)} */}
            {(data.length > 0 && data.map((author) => {
                return <AuthorListItem abstractId={abstractId} tempId={tempId} author={author} isMainAuthor={mainAuthorId == author.wp_user_id} />
            })) }
        </div>
        <div className={s.search}>
            <SearchAuthor abstractId={abstractId} onAdded={()=>{}} />
        </div>
        <div className="authors__search__result"></div>

    </div>
}