import { createContext, Dispatch, useContext, useState } from "react";

export interface ReportsContextProps {
    colors: string[];
    edition: string;
    setEdition: Dispatch<React.SetStateAction<string>>;
}

const defaultValues: ReportsContextProps = {
    colors: [],
    edition: '',
    setEdition: () => {},
}

const Context = createContext<ReportsContextProps>(defaultValues)

export default function useReportsContext(){
    return useContext(Context)
}

export function ReportsContextProvider(props: React.PropsWithChildren<any>){
    const { children } = props
    const [edition, setEdition] = useState<string>('')

    const values  = {
        colors: ['#006cdc', '#6610f2', '#e83e8c', '#D2072A', '#fd7e14', '#6f42c1', '#E6B40E', '#007A7A', '#20c997', '#17a2b8'],
        edition, setEdition
    }
    return (
        <Context.Provider value={values}>
            {children}
        </Context.Provider>
    )
}