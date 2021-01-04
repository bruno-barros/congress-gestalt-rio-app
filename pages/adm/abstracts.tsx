import MainLayout from "../../components/layout";
import {useCallback, useMemo} from "react";
import {DynamicTable} from "../../components/dynamic-table";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useEvent from "../../components/hooks/useEvent";
import {useQuery} from "react-query";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import {Loading} from "@brunobarros/react-components";
import {useRouter} from "next/router";

const AdmAbstracts = () => {

  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  const {data: event} = useEvent()
  const edition = event && event.currentEdition()
  const editionId = router.query.edition || edition?.id
  const {data: abstracts, error, isLoading} = useQuery<any[], any>(['abstracts', editionId], queryAbstracts, {
    enabled: !!editionId && user.canManageAbstracts()
  })

  function queryAbstracts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      console.count('abstracts')
      console.info('*** FETCHING ABSTRACTS ***');
      WpAbstract.collection({
        edition: String(editionId),
      }).then(resp => {
        if (resp.data.data?.abstractFilters?.nodes) {
          resolve(resp.data.data.abstractFilters.nodes)
        } else {
          reject([])
          errorNotification({error: resp.data.errors})
        }
      }, err => {
        reject([])
        errorNotification({error: err})
      })
    })
  }


  const columns = useMemo(() => {
    return [
      {
        Header: '#',
        accessor: 'databaseId',
      },{
        Header: 'Título',
        accessor: 'title',
      },{
        Header: 'Subtítulo',
        accessor: 'subtitle',
      },{
        Header: 'Tópico',
        accessor: 'topic',
      },{
        Header: 'Status',
        accessor: 'status',
      },{
        Header: 'Status',
        accessor: 'status_pt'
      },{
        Header: 'Autores',
        accessor: 'authors_count',
      },{
        Header: 'Avaliações',
        accessor: 'evaluations_count',
      },{
        Header: 'Anexos',
        accessor: 'attachments_count',
      },{
        Header: 'Enviado em',
        accessor: 'date',
      }
    ]}, [])
  const data = useMemo(() => {
    if(!abstracts || !edition) return []
    return abstracts.map(row => {
      let topic = edition?.abstract?.topics?.find(top => top.id === row.topic)
      row.topic = topic && topic.hasOwnProperty('pt') && topic[router.locale]
      row.status_pt = t(`status.${row.status}`)
      return row
    })
  }, [abstracts, event])

  const dummy = useCallback(() => () => null, [])

  if (!event || isLoading) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  return (<MainLayout fullWidth>
    <DynamicTable<any>
      name={`abstracts`}
      columns={columns}
      data={data}
      hiddenColumns={['status_pt']}
      onAdd={dummy}
      onEdit={dummy}
      onDelete={dummy}/>
  </MainLayout>)
}

export default AdmAbstracts
