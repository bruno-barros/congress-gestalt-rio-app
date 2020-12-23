import {useQuery} from "react-query";
import WpConfig from "../../src/http/wp-config";
import Config from "../../src/resources/config";

export default function useConfig() {

  return useQuery<Config, any>('configurations', async ():Promise<Config> => {
    const resp = await WpConfig.load()
    return Config.make(resp.data)
  }, {
    cacheTime: Infinity
  })
}
