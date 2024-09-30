import {QueryClient, useQuery, useQueryClient} from "react-query";
import Event, { Edition } from "../../src/resources/event";
import { WpSettings } from "../../src/http/wp-settings";

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
