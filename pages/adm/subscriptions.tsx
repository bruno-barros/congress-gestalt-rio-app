import {useRouter} from "next/router";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {useCallback, useMemo} from "react";
import MainLayout from "../../components/layout";
import {DynamicTable} from "../../components/dynamic-table";
import useSubscriptions from "../../components/hooks/useSubscriptions";
import useEvent from "../../components/hooks/useEvent";
import {Order} from "../../src/resources/order";
import EditionSidebar from "../../components/event/edition-sidebar";
import privateRoute from "../../components/hoc/private-route";
import {useQueryClient} from "react-query";
import {siteTitle} from "../../src/helpers";
import Head from "next/head";
import Loading from "../../components/ui/loading";
import useSettings from "../../components/hooks/useSettings";


const AdmSubscriptions = () => {

  const queryClient = useQueryClient()
  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  // const {data: event} = useEvent()
  // const edition = event && event.getEdition(String(router.query?.edition))
  const { data: event, currentEdition: edition } = useSettings()
  const {data: subscriptions, isLoading, methods} = useSubscriptions(edition)

  const columns = useMemo(() => {
    return [
      {
        Header: '#',
        accessor: 'databaseId',
      },{
        Header: 'Status',
        accessor: 'order_status'
      },{
        Header: 'Status',
        accessor: 'status_woo'
      },
      {
        Header: 'Participante',
        accessor: 'customer_name'
      },
      {
        Header: 'E-mail',
        accessor: 'customer_email'
      },
      {
        Header: 'Pacote',
        accessor: 'package'
      },
      {
        Header: 'Total',
        accessor: 'total'
      },
      {
        Header: 'Método',
        accessor: 'paymentMethodTitle'
      },
      {
        Header: 'Data',
        accessor: 'date',
      },
      {
        Header: 'PcD',
        accessor: 'is_pdc',
      },
      {
        Header: 'AA',
        accessor: 'is_affirmative_action',
      }

    ]}, [])
  const data = useMemo(() => {
    if(!subscriptions || subscriptions.getOrders().length === 0) return []
    return subscriptions.getOrders().map((order: Order) => {
      let row: any = {...order}
      row.package = order.getItems()[0]?.product?.name || 'desconhecido'
      row.customer_name = order.getCustomerName()
      row.customer_email = order.customer.email
      row.order_status = t(`status.${order.status.toLowerCase()}`)
      row.status_woo = order.status
      row.is_pdc = fndMd(order.customer, 'is_pdc', false) ? 'Sim' : 'Não'
      row.is_affirmative_action = fndMd(order.customer, 'affirmative_action', false) ? 'Sim' : 'Não'

      return row
    })
  }, [subscriptions])

  function fndMd(customer, key, def: any = null){
    const metas = customer?.metaData || []
    const meta = metas.find(m => m.key === key)
    if(meta) return meta.value
    return def
  }

  const dummy = useCallback(() => () => null, [])

  if (isLoading || !edition) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  return (<MainLayout sidebar={{
    title: edition.getName(), component: <EditionSidebar edition={edition}/>, sidebarCompact: true
  }}>
    <Head>
      <title>{siteTitle('Admin - Inscrições', queryClient)}</title>
    </Head>
    <DynamicTable<any>
      name={`subscriptions`}
      columns={columns}
      data={data}
      hiddenColumns={['status_woo']}
      onAdd={dummy}
      onEdit={dummy}
      onDelete={dummy}/>
  </MainLayout>)
}

export default privateRoute(AdmSubscriptions)
