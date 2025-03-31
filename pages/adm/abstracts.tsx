import MainLayout from "../../components/layout";
import {useCallback, useMemo} from "react";
import {DynamicTable} from "../../components/dynamic-table";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {useQuery, useQueryClient} from "react-query";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import {useRouter} from "next/router";
import privateRoute from "../../components/hoc/private-route";
import {siteTitle} from "../../src/helpers";
import Head from "next/head";
import Loading from "../../components/ui/loading";
import useSettings from "../../components/hooks/useSettings";
import { access } from "fs";
import { ac } from "../../components/access-control";
import { REQUIREMENTS } from "../../components/access-control/requirements";

const AdmAbstracts = () => {

  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  // const {data: event} = useEvent()
  // const edition = event && event.currentEdition()
  const { data: event, currentEdition: edition } = useSettings()
  const editionId = router.query.edition || edition?.getId()
  const {data: abstracts, error, isLoading} = useQuery<any[], any>(['abstracts', editionId], queryAbstracts, {
    enabled: !!editionId && ac(user, [REQUIREMENTS.abstract.manage]),
  })

  

  function queryAbstracts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // console.count('abstracts')
      // console.info('*** FETCHING ABSTRACTS ***');
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
    let columns = [
      {
        Header: '#',
        accessor: 'databaseId',
      },{
        Header: 'Lang',
        accessor: 'main_language',
      },{
        Header: 'Título',
        accessor: 'title',
      },{
        Header: 'Subtítulo',
        accessor: 'subtitle',
      },
      {
        Header: 'Tópico',
        accessor: 'topic',
      },{
        Header: 'Modalidade',
        accessor: 'modality',
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
        Header: 'Autor',
        accessor: 'author_name',
      },{
        Header: 'Autor e-mail',
        accessor: 'author_email',
      },{
        Header: 'Avaliações',
        accessor: 'evaluations_count',
      },{
        Header: 'Anexos',
        accessor: 'attachments_count',
      },{
        Header: 'Enviado em',
        accessor: 'date',
      },{
        Header: 'Atualizado em',
        accessor: 'ev_last_update',
      }
    ];

    // remove coluna de anexos se status não conta com anexo de trabalhos
    if(event?.abstract?.statuses?.filter(st => st === 'evaluating').length === 0){
      columns = columns.filter(col => col.accessor !== 'attachments_count')
    }

    return columns

  }, [event])

  const data = useMemo(() => {
    if(!abstracts || !edition) return []
    return abstracts.map(row => {
      if(edition?.abstract?.topics){
        let topic = edition?.abstract?.topics?.find(top => top.id === row.topic)
        if(topic){
        row.topic = topic.hasOwnProperty('pt') && topic[router.locale]
        }
      }
      row.main_language = row.main_language.toUpperCase()
      row.modality = row.type    
      row.author_name = row.author?.node?.name
      row.author_email = row.author?.node?.email
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
    <Head>
      <title>{siteTitle('Admin - Trabalhos', queryClient)}</title>
    </Head>
    <DynamicTable<any>
      name={`abstracts`}
      columns={columns}
      data={data}
      hiddenColumns={['status_pt', 'subtitle', 'author_name', 'author_email']}
      onAdd={dummy}
      onEdit={dummy}
      onDelete={dummy}/>
  </MainLayout>)
}

export default privateRoute(AdmAbstracts)
