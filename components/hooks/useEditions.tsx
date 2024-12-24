import { useQuery } from "react-query";
import { EditionsResponse } from "../../src/types/settings";
import { WpSettings } from "../../src/http/wp-settings";
import Edition from "../../src/resources/edition";

export default function useEditions() {
  async function fetch(): Promise<Edition[]> {
    const axios = await WpSettings.editions();
    //    console.log(axios.data.data)
    const keys = axios.data.data.editions_keys || [];
    const global = axios.data.data.global || {};
    const editions = axios.data.data.editions || {};
    return keys.map((key) => {
      return Edition.make(editions[key], {
        id: key,
        global,
      });
    });
  }

  const query = useQuery("editions", fetch, {
    staleTime: Infinity,
  });

  return query;
}
