import MainLayout from "../../components/layout";
import {useCallback, useMemo} from "react";
import {DynamicTable} from "../../components/dynamic-table";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useEvent from "../../components/hooks/useEvent";
import {useQuery, useQueryClient} from "react-query";
import {errorNotification} from "../../src/resources/responses";
import {useRouter} from "next/router";
import WpEvaluation from "../../src/http/wp-evaluation";
import privateRoute from "../../components/hoc/private-route";
import {siteTitle} from "../../src/helpers";
import Head from "next/head";
import Loading from "../../components/ui/loading";

const Evaluations = () => {

  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  const {data: event} = useEvent()
  const edition = event && event.currentEdition()
  const editionId = router.query.edition || edition?.id
  const {data: evaluations, error, isLoading} = useQuery<any[], any>(['evaluations', editionId, user.getId()], queryEvaluations, {
    enabled: !!editionId && user.canEvaluateAbstracts(),
    refetchOnMount: true
  })

  function queryEvaluations(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      WpEvaluation.get({
        edition_id: String(editionId),
        user_id: user.getId()
      }).then(resp => {
        if (resp.data.data?.evEvaluations?.nodes) {
          resolve(resp.data.data.evEvaluations.nodes)
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
        accessor: 'id',
      },{
        Header: 'Título',
        accessor: 'title',
      },{
        Header: 'Tópico',
        accessor: 'topic',
      },{
        Header: 'Avaliação',
        accessor: 'status',
      },{
        Header: 'Público',
        accessor: 'is_public',
      },{
        Header: 'Status',
        accessor: 'status_pt'
      },{
        Header: 'Designado em',
        accessor: 'date',
      }
    ]}, [])
  const data = useMemo(() => {
    if(!evaluations || !edition) return []
    return evaluations.map(row => {
      let topic = edition?.abstract?.topics?.find(top => top.id === row.abstract?.topic)
      row.topic = topic && topic.hasOwnProperty('pt') && topic[router.locale]
      row.title = row.abstract?.title
      row.status_pt = t(`status.${row.status}`)
      row.id = row.abstract?.databaseId
      row.is_public = row.is_public ? 'SIM' : 'NÃO'
      row.date = row.created_at
      return row
    })
  }, [evaluations, event])

  const dummy = useCallback(() => () => null, [])

  if (!event || isLoading) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  return (<MainLayout fullWidth>
    <Head>
      <title>{siteTitle('Minhas avaliações', queryClient)}</title>
    </Head>
    <DynamicTable<any>
      name={`evaluations`}
      columns={columns}
      data={data}
      hiddenColumns={['status_pt']}
      onAdd={dummy}
      onEdit={dummy}
      onDelete={dummy}/>
  </MainLayout>)
}

export default privateRoute(Evaluations)
