import MainLayout from "../components/layout";
import useTrans from "../components/hooks/useTrans";
import {useRouter} from "next/router";
import useEvent from "../components/hooks/useEvent";
import CardDeck from "react-bootstrap/cjs/CardDeck";
import Card from "react-bootstrap/cjs/Card";
import Link from "next/link";
import useCurrentUser from "../components/hooks/useCurrentUser";
import {Edition} from "../src/resources/event";
import {Loading} from "@brunobarros/react-components";
import useUserOrders from "../components/hooks/useUserOrders";
import BadgeSubscribed from "../components/ui/badge-subscribed";

interface DashboardProps {

}

const Dashboard = (props: DashboardProps) => {

  const t = useTrans()
  const router = useRouter()
  const {data: event, isLoading} = useEvent()
  const currentEdition: Edition = event && event.currentEdition()
  const {user} = useCurrentUser()
  const {data: orders, isLoading: ordersLoading} = useUserOrders(user?.getId())

  if (isLoading || ordersLoading) {
    return (<MainLayout><Loading vspace={80}/></MainLayout>)
  }

  const isSubscribed = orders?.hasValidSubscription(currentEdition.id)

  return (<MainLayout>
    <div className="row">
      <div className="col-12 p-4">
        <h1 className="page-title">{t(user.canManageAbstracts() ? 'eventos' : 'meus-eventos')}</h1>

        <CardDeck>
          {event && event.getEditions().map(edition => {
            const isCurrent = edition.id === currentEdition?.id
            return (<Card key={edition.id} style={{maxWidth: 400}}>
              {edition.logoPrimary &&
              <div className="p-4 border-bottom"><Card.Img variant="top" src={edition.logoPrimary}/></div>}
              <Card.Body className="" style={{position: 'relative'}}>
                {isSubscribed && isCurrent && <div style={{position: 'absolute', top: 0, transform: 'translateY(-40%)'}}><BadgeSubscribed /></div>}
                <Card.Title>{edition.name}</Card.Title>
                <Card.Text>
                  {edition.year}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="p-0 border-0 bg-white">
                <div className="btn-group w-100 end start">
                  {(user.canPublishAbstracts()) && <>
                    <Link href={`/abstracts?edition=${edition.id}`} passHref>
                      <a className={`btn ${isCurrent ? 'btn-outline-primary' : 'btn-outline-secondary'}`}>{t('trabalho.meus-trabalhos')}</a>
                    </Link>
                  </>}
                  {isCurrent && <>
                    {(!isSubscribed && currentEdition.isOpenToSubscribe()) && <>
                      <Link href={`/register2`} passHref>
                        <a className="btn btn-primary">{t('fazer-inscricao')}</a>
                      </Link>
                    </>}
                  </>}


                    {user.canManageAbstracts() && <>
                      <Link href={`/adm/abstracts?edition=${edition.id}`} passHref>
                        <a className={`btn ${isCurrent ? 'btn-outline-primary' : 'btn-outline-secondary'}`}>{t('trabalhos')}</a>
                      </Link>
                      <Link href={`/adm/subscriptions?edition=${edition.id}`} passHref>
                        <a className={`btn ${isCurrent ? 'btn-outline-primary' : 'btn-outline-secondary'}`}>{t('inscricoes')}</a>
                      </Link>
                    </>}


                  {/*{!isCurrent && user.canManageAbstracts() && (<>*/}
                  {/*  <Link href={`/adm/subscriptions?edition=${edition.id}`} passHref>*/}
                  {/*    <a className={`btn ${isCurrent ? 'btn-outline-primary' : 'btn-outline-secondary'}`}>{t('inscricoes')}</a>*/}
                  {/*  </Link>*/}
                  {/*</>)}*/}

                </div>
              </Card.Footer>
            </Card>)
          })}
        </CardDeck>

      </div>
    </div>
  </MainLayout>)
}


export default Dashboard
