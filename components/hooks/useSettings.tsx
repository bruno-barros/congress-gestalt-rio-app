import {QueryClient, useQuery, useQueryClient} from "react-query";
import Event from "../../src/resources/event";
import { WpSettings } from "../../src/http/wp-settings";
import Edition from "../../src/resources/edition";
/**
 * Retorna as configurações globais com a edição atual
 * @param edition 
 * @returns 
 */
export default function useSettings(edition?: string|undefined) {

  const query = useQuery<Event, any>(['settings', edition], async () => {
    const resp = await WpSettings.all({
      edition
    })
    // console.log(resp.data?.data)
    return Event.make(resp.data?.data)
  }, {
    staleTime: Infinity,
    // enabled: !!edition && typeof edition === 'string',
    // initialData: Event.make({})
  })

  const currentEdition: Edition = query.data && query.data.currentEdition()

  return {...query, currentEdition}
}

export function invalidateSettings(queryClient: QueryClient){
  return queryClient.invalidateQueries('settings')
}
