import { createContext, useContext, useState } from "react";

import { AuthorSchema } from "../../../src/types/authors-panel";



interface AuthorsContext {
    data: AuthorSchema[]
    setData?: React.Dispatch<React.SetStateAction<AuthorSchema[]>>
    abstractId: number|null|undefined
    setAbstractId: React.Dispatch<React.SetStateAction<number|null|undefined>>
    selectedAuthor: AuthorSchema|null
    setSelectedAuthor: React.Dispatch<React.SetStateAction<AuthorSchema|null>>
}

const Context = createContext<AuthorsContext>({
    data: [],
    setData: () => {},
    abstractId: null,
    setAbstractId: () => {},
    selectedAuthor: null,
    setSelectedAuthor: () => {}
})

export function useAuthorsContext(){
    return useContext(Context)
}

export default function AuthorsProvider({children}: {children: any}){
    const [data, setData] = useState<AuthorSchema[]>([])
    const [abstractId, setAbstractId] = useState<number|null|undefined>(null)
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorSchema|null>(null)
    const value = {
        data,
        setData,
        abstractId,
        setAbstractId,
        selectedAuthor,
        setSelectedAuthor
    }
    return <Context.Provider value={value}>
        {children}
    </Context.Provider>

}