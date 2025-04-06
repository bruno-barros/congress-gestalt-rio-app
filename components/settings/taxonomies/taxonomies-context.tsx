import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { TaxonomyType } from "../../../src/types/taxonomy.type";

interface TaxonomiesContext {
  taxonmy: TaxonomyType | null;
  setTaxonmy: Dispatch<SetStateAction<TaxonomyType | null>>;
  selected: number | null;
  setSelected: Dispatch<SetStateAction<number | null>>;
}

const Context = createContext<TaxonomiesContext>({} as TaxonomiesContext);

export default function useTaxonomyContext() {
  return useContext(Context);
}

export function TaxonomyContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [taxonmy, setTaxonmy] = useState<TaxonomyType | null>(null);

  const values = {
    selected, setSelected,
    taxonmy, setTaxonmy
  }


  return <Context.Provider value={values}>{children}</Context.Provider>;
}
