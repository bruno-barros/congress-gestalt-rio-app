import {QueryClient, useQuery, useQueryClient} from "react-query";
import Event from "../../src/resources/event";
import { WpSettings } from "../../src/http/wp-settings";

export default function useSettings() {

  return useQuery<Event, any>('settings', async () => {
    const resp = await WpSettings.all()
    // console.log(resp.data?.data)
    return Event.make(resp.data?.data)
  }, {
    staleTime: Infinity,
    // initialData: Event.make({})
  })
}

export function invalidateSettings(queryClient: QueryClient){
  return queryClient.invalidateQueries('settings')
}
