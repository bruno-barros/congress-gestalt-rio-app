import { createContext, useContext, useState } from "react";

import { AuthorSchema } from "../../../src/types/authors-panel";



interface AuthorsContext {
    data: AuthorSchema[]
    setData?: React.Dispatch<React.SetStateAction<AuthorSchema[]>>
}

const Context = createContext<AuthorsContext>({
    data: [],
    setData: () => {}
})

export function useAuthorsContext(){
    return useContext(Context)
}

export default function Provider({children}: {children: any}){
    const [data, setData] = useState<AuthorSchema[]>([])
    const value = {
        data,
        setData
    }
    return <Context.Provider value={value}>
        {children}
    </Context.Provider>

}