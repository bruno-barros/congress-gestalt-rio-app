import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { ActivitySchema } from '../../src/types/activity.type';
import useActivities from "../hooks/activities/useActivities";
import useSettings from "../hooks/useSettings";
import { useRouter } from "next/router";

interface MyActivitiesContext {
    edition: string | null;
    activities: ActivitySchema[],
    loading: boolean,
    setLoading: Dispatch<SetStateAction<boolean>>;
}

const init = {
    edition: null,
    activities: [],
    loading: false,
    setLoading: () => { },
}

const Context = createContext<MyActivitiesContext>(init);

export function useMyActivitiesContext() {
  return useContext(Context);
}


export default function MyActivitiesContextProvider({children}) {
    const router = useRouter()
    const {data: event, currentEdition} = useSettings(String(router.query?.edition))
    const { data: activities, isLoading: actLoading, isFetching: actFetching } = useActivities(currentEdition?.getId())
    const [loading, setLoading] = useState(false)
    const validActivities = Array.isArray(activities) ? activities?.filter(act => act.active) : []

    useEffect(()=>{
        if(actFetching || actLoading){
            setLoading(true)
        } else {
            setLoading(false)
        }
    }, [
        actFetching, actLoading
    ])

    const values = {
        activities: validActivities || [],
        edition: currentEdition?.getId() || null,
        loading,
        setLoading
    }

    return <Context.Provider value={values}>{children}</Context.Provider>;
}