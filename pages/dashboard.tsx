import MainLayout from "../components/layout";
import useTrans from "../components/hooks/useTrans";
import {useRouter} from "next/router";
import useEvent from "../components/hooks/useEvent";
import CardDeck from "react-bootstrap/cjs/CardDeck";
import Card from "react-bootstrap/cjs/Card";
import Link from "next/link";
import useCurrentUser from "../components/hooks/useCurrentUser";
import Edition from "../src/resources/edition";
import useUserOrders from "../components/hooks/useUserOrders";
import BadgeSubscribed from "../components/ui/badge-subscribed";
import privateRoute from "../components/hoc/private-route";
import {useEffect} from "react";
import {dump, siteTitle} from "../src/helpers";
import Head from "next/head";
import {useQueryClient} from "react-query";
import Loading from "../components/ui/loading";
import useSettings from "../components/hooks/useSettings";
import useEditions from "../components/hooks/useEditions";
import EditionCard from "../components/edition/edition-card";
import Ac from "../components/access-control";

interface DashboardProps {

}

const Dashboard = (props: DashboardProps) => {

  const queryClient = useQueryClient()
  const t = useTrans()
  const router = useRouter()
  const { data: event, currentEdition: current, isLoading } = useSettings()
  const {user} = useCurrentUser()
  const {data: orders, isLoading: ordersLoading} = useUserOrders(user?.getId())
  const {data: editions} = useEditions()
  const ActvCnf = current?.Activity()
  /**
   * -----------------------------
   * Redirect to client: ABRISCO
   * -----------------------------
   */
  useEffect(()=>{
    if(!user || !user?.getUserData().roles) return
    // if(user.canManageAbstracts()) router.push(`/adm/abstracts`)
    // else router.push(`/abstracts`)
  }, [user])
  // return (<MainLayout><Loading vspace={80}/></MainLayout>)


  if (isLoading || ordersLoading) {
    return (<MainLayout><Loading vspace={80}/></MainLayout>)
  }

  return (<MainLayout>
    {/* {dump({isOpenToApply: ActvCnf.isOpenToApply(user)})} */}
    {/* {dump(current?.abstract?.topics)} */}
    <Head>
      <title>{siteTitle('Dashboard', queryClient)}</title>
    </Head>
    <div className="row">
      <div className="col-12 p-4">
        <h1 className="page-title">{t(user.canManageAbstracts() ? 'eventos' : 'meus-eventos')}</h1>

        {/* {dump(prods)} */}

        <CardDeck>
        {(editions && editions.length > 0) && editions.map(edition => {
          return (<EditionCard edition={edition} key={edition.id} orders={orders} />)
        })}
        </CardDeck>

      </div>
    </div>
  </MainLayout>)
}


export default privateRoute(Dashboard)
