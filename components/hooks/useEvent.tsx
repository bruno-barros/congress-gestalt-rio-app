import {useQuery} from "react-query";
import WpConfig from "../../src/http/wp-config";
import Event from "../../src/resources/event";

export default function useEvent() {

  return useQuery<Event, any>('event', async () => {
    const resp = await WpConfig.load()
    return Event.make(resp.data)
  }, {
    staleTime: Infinity
  })
}
