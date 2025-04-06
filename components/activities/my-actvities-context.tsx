import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
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
    const { data: activities } = useActivities(currentEdition?.getId())
    const [loading, setLoading] = useState(false)
    const validActivities = activities?.filter(act => act.active) || []

    const values = {
        activities: validActivities || [],
        edition: currentEdition?.getId() || null,
        loading,
        setLoading
    }

    return <Context.Provider value={values}>{children}</Context.Provider>;
}