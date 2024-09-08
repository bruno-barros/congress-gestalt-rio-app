"use client";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface SettingsContextType {
  lang: "pt" | "en";
  setLang: Dispatch<SetStateAction<"pt" | "en">>;
  currentEdition: string;
  setCurrentEdition: Dispatch<SetStateAction<string>>;
}

const defaults: SettingsContextType = {
  lang: "pt",
  setLang: () => {},
  currentEdition: "",
  setCurrentEdition: () => {},
};

const Context = createContext<SettingsContextType>(null!);

export default function useSettingsContext() {
  return useContext(Context);
}

export function SettingsContextProvider({ children }) {
  const [lang, setLang] = useState<"pt" | "en">("pt");
  const [currentEdition, setCurrentEdition] = useState<string>("");

  const values: SettingsContextType = {
    lang,
    setLang,
    currentEdition,
    setCurrentEdition,
  };

  return <Context.Provider value={values}>{children}</Context.Provider>;
}
