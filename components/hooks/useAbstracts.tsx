import { useQuery, QueryClient } from 'react-query';
import { AbstractCollection } from "../abstract/abstract.d";
import { WpAbstract } from "../../src/http/wp-abstract";
import { errorNotification } from "../../src/resources/responses";

export interface AbstractsArguments {

}
export default function useAbstracts(userId: number, editionId: string, args?: AbstractsArguments) {

    function queryAbstracts(): Promise<AbstractCollection> {
        return new Promise((resolve, reject) => {
          WpAbstract.collection({
            edition: editionId,
            authorId: userId,
            // statuses: phase === 'abstract' ?  : (phase === 'synopsis' ? StatusesPhaseSynopsis() : null)
            // statuses: [...StatusesPhaseAbstract(), ...StatusesPhaseSynopsis()]
          }).then(resp => {
            if (resp.data.data?.abstractFilters?.nodes) {
              resolve(AbstractCollection.make(resp.data.data.abstractFilters.nodes))
            } else {
              resolve(AbstractCollection.make([]))
              errorNotification({error: resp.data.errors})
            }
          }, err => {
            resolve(AbstractCollection.make([]))
            errorNotification({error: err})
          })
        })
      }

      return useQuery<AbstractCollection, any>(['abstracts', userId, editionId], queryAbstracts, {
        enabled: !!editionId && userId > 0
      })

}

export function invalidateAbstracts(client: QueryClient){
    client.invalidateQueries('abstracts')
}