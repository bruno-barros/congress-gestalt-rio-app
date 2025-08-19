import { useRouter } from "next/router";
import {
  createContext,
  Dispatch,
  DispatchWithoutAction,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import useSettings from "../../hooks/useSettings";
import useActivities from "../../hooks/activities/useActivities";
import { ActivitySchema } from "../../../src/types/activity.type";

interface ActivitiesContext {
  edition: string;
  // activities: ActivitySchema[];
  loading: boolean;
  setLoading: Dispatch<React.SetStateAction<boolean>>;
  filtered: ActivitySchema[];
  setFiltered: Dispatch<React.SetStateAction<ActivitySchema[]>>;
  activityId: number | null;
  setActivityId: Dispatch<React.SetStateAction<number | null>>;
  openSubscriptionPanel: (id: number) => void;
  showSubscriptionPanel: boolean;
  dispatchSubscriptionPanel: DispatchWithoutAction;
}

const init = {
  edition: "",
  // activities: [],
  filtered: [],
  setFiltered: () => {},
  loading: false,
  setLoading: () => {},
  activityId: null,
  setActivityId: () => {},
  openSubscriptionPanel: () => {},
  showSubscriptionPanel: false,
  dispatchSubscriptionPanel: () => {},
};

const Context = createContext<ActivitiesContext>(init);

export function useAdmActivitiesContext() {
  return useContext(Context);
}

export default function AdmActivitiesContextProvider({ children }) {
  const router = useRouter();
  const editionId = String(router.query.edition);

  const { data: event } = useSettings(editionId);
  // const {
  //   data: activities,
  //   error,
  //   isLoading,
  //   isFetching,
  // } = useActivities(editionId, {
  //   user_id: filters?.user_id || null,
  // });
  const [loading, setLoading] = useState(false);
  const [edition, setEdition] = useState(editionId);
  const [filtered, setFiltered] = useState<ActivitySchema[]>([]);
  const [activityId, setActivityId] = useState<number | null>(null);
  const [showSubscriptionPanel, dispatchSubscriptionPanel] = useReducer(
    (p) => !p,
    false
  );
  function openSubscriptionPanel(id: number) {
    setActivityId(id);
    dispatchSubscriptionPanel();
  }

  // useEffect(() => {
  //   activities && setFiltered(activities.filter((act) => act.active));
  // }, [activities]);

  const values = {
    edition,
    // activities: Array.isArray(activities)
    //   ? activities.filter((act) => act.active)
    //   : [],
    loading: loading,
    setLoading,
    filtered,
    setFiltered,
    activityId,
    setActivityId,
    openSubscriptionPanel,
    showSubscriptionPanel,
    dispatchSubscriptionPanel,
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
}
