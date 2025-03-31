import {QueryClient, useQuery} from "react-query";
import { WpStats } from "../../src/http/wp-stats";
import { StatsSchema } from "../../src/types/stats.types";
/**
 * Retorna as configurações globais com a edição atual
 * @param edition 
 * @returns 
 */
export default function useStats(edition: string) {

  const query = useQuery<StatsSchema[], any>(['stats', edition], async () => {
    const axios = await WpStats.list({
      edition
    })
    const resp = axios.data
    // console.log(resp.data?.data)
    return resp.data
  }, {
    staleTime: Infinity,
    // enabled: !!edition && typeof edition === 'string',
    // initialData: Event.make({})
  })


  return query
}

export function invalidateStats(queryClient: QueryClient){
  return queryClient.invalidateQueries('stats')
}
