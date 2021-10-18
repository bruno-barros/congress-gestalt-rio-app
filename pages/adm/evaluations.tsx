import MainLayout from "../../components/layout";
import {useCallback, useMemo} from "react";
import {DynamicTable} from "../../components/dynamic-table";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useEvent from "../../components/hooks/useEvent";
import {useQuery, useQueryClient} from "react-query";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import {Loading} from "@brunobarros/react-components";
import {useRouter} from "next/router";
import privateRoute from "../../components/hoc/private-route";
import WpEvaluation from "../../src/http/wp-evaluation";
import { siteTitle, average } from '../../src/helpers';
import Head from "next/head";
import useEvaluations from "../../components/hooks/useEvaluations";

const AdmEvaluations = () => {

  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTrans()
  const {data: event} = useEvent()
  const edition = event && event.currentEdition()
  const editionId = router.query.edition || edition?.id
  const {data: evaluations, error, isLoading} = useEvaluations(String(editionId))


  const columns = useMemo(() => {
    return [
      {
        Header: '#',
        accessor: 'id',
      },{
        Header: 'Trabalho',
        accessor: 'abs_title',
      },{
        Header: 'Avaliador',
        accessor: 'evaluator_name',
      },{
        Header: 'Avaliador ID',
        accessor: 'evaluator_id',
      },{
        Header: 'E-mail',
        accessor: 'email',
      },{
        Header: 'Telefone',
        accessor: 'cellphone',
      },{
        Header: 'Status',
        accessor: 'status',
      },{
        Header: 'Média',
        accessor: 'average',
      },{
        Header: 'Dias passados',
        accessor: 'days_of_delay',
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
      row.abs_title = `(${row.abstract?.databaseId}) ${row.abstract?.title}`
      row.status_pt = t(`status.${row.status}`)
      row.id = row.databaseId
      row.is_public = row.is_public ? 'SIM' : 'NÃO'


      row.evaluator_id = row.evaluator?.databaseId
      row.evaluator_name = row.evaluator?.name
      row.email = row.evaluator?.email
      row.cellphone = row.evaluator?.cellphone
      row.average = average([row.relevance, row.quality, row.clarity, row.contributions], 1)

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
      <title>{siteTitle('Admin - Avaliações', queryClient)}</title>
    </Head>
    <DynamicTable<any>
      name={`evaluations-adm`}
      columns={columns}
      data={data}
      hiddenColumns={['status_pt', 'evaluator_id']}
      onAdd={dummy}
      onEdit={dummy}
      onDelete={dummy}/>
  </MainLayout>)
}

export default privateRoute(AdmEvaluations)
