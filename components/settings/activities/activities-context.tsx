import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ActivitiesContext {
  selected: number | null;
  setSelected: Dispatch<SetStateAction<number | null>>;
}

const Context = createContext<ActivitiesContext>({} as ActivitiesContext);

export default function useActivityContext() {
  return useContext(Context);
}

export function ActivityContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  const values = {
    selected, setSelected
  }


  return <Context.Provider value={values}>{children}</Context.Provider>;
}
