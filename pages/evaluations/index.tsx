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
import useSettings from "../../components/hooks/useSettings";
import moment from "moment";

const Evaluations = () => {

  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  const {data: event, currentEdition: edition} = useSettings()
  const editionId = router.query.edition || edition?.getId()
  const AbstractCnf = edition?.Abstract()
  const ReviewCnf = edition?.Review()
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
      },{
        Header: 'Data limite',
        accessor: 'date_limit',
      }
    ]}, [])
  const data = useMemo(() => {
    if(!evaluations || !edition) return []
    return evaluations.map(row => {
      let topic = AbstractCnf?.getTopics()?.find(top => top.id === row.abstract?.topic)
      row.topic = topic && topic[router.locale]
      row.title = row.abstract?.title
      row.status_pt = t(`status.${row.status}`)
      row.id = row.abstract?.databaseId
      row.is_public = row.is_public ? 'SIM' : 'NÃO'
      row.date = row.created_at
      const d = moment(row.created_at).add(edition?.Review().getDaysToEvaluate(), 'days')
      row.date_limit = edition?.Review().getDaysToEvaluate() === 0 ? '-' : d.format('DD/MM/YYYY')
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
