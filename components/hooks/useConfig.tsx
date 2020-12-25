import {useQuery} from "react-query";
import WpConfig from "../../src/http/wp-config";
import Config, {ConfigI} from "../../src/resources/config";

export default function useConfig() {

  return useQuery<Config, any>('configurations', async () => {
    const resp = await WpConfig.load()
    return Config.make(resp.data)
  }, {
    cacheTime: Infinity
  })
}
