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

interface DashboardProps {

}

const Dashboard = (props: DashboardProps) => {

  const t = useTrans()
  const router = useRouter()
  const {data: event, isLoading} = useEvent()
  const currentEdition: Edition = event && event.currentEdition()
  const {user} = useCurrentUser()

  if(isLoading){
    return (<MainLayout><Loading/></MainLayout>)
  }

  return (<MainLayout>
    <div className="row">
      <div className="col-12 p-4">
        <h1 className="page-title">{t(user.canManageAbstracts() ? 'eventos' : 'meus-eventos')}</h1>

        <CardDeck>
          {event && event.getEditions().map(edition => {
            const isCurrent = edition.id === currentEdition?.id
            return (<Card key={edition.id} style={{maxWidth: 400}}>
              {edition.logoPrimary && <div className="p-4 border-bottom"><Card.Img variant="top" src={edition.logoPrimary}/></div>}
              <Card.Body>
                <Card.Title>{edition.name}</Card.Title>
                <Card.Text>
                  {edition.year}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="p-0 border-0">
                <div className="btn-group w-100 end start">
                  {user.canManageAbstracts()
                    ? (<>
                      <Link href={`/adm/abstracts?edition=${edition.id}`} passHref><a className="btn btn-outline-secondary">Administrar trabalhos</a></Link>
                      <Link href={`/register2`} passHref><a className="btn btn-outline-secondary -btn-block">Ver inscrições</a></Link>
                    </>)
                    : (<>
                      <Link href={`/abstracts?edition=${edition.id}`} passHref><a className="btn btn-outline-secondary">Enviar trabalho</a></Link>
                      {(isCurrent && currentEdition.isOpenToSubscribe()) && <Link href={`/register2`} passHref><a className="btn btn-primary -btn-block">Fazer inscrição</a></Link>}

                    </>)}

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
