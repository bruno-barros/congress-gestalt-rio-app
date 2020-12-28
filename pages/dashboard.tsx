import MainLayout from "../components/layout";
import useTrans from "../components/hooks/useTrans";
import {useRouter} from "next/router";
import useEvent from "../components/hooks/useEvent";
import CardDeck from "react-bootstrap/cjs/CardDeck";
import Card from "react-bootstrap/cjs/Card";

interface DashboardProps {

}

function MeuComponente (){
  return (<div className="">
    <div style={{width: 200, height: 200, backgroundColor: 'blue', margin: '2rem auto'}}/>
    <ul className="list-group">
      <li className="list-group-item dismiss">Cras justo odio</li>
      <li className="list-group-item dismiss">Dapibus ac facilisis in</li>
      <li className="list-group-item dismiss">Morbi leo risus</li>
      <li className="list-group-item dismiss">Porta ac consectetur ac</li>
      <li className="list-group-item dismiss">Vestibulum at eros</li>
      <li className="list-group-item dismiss">Cras justo odio</li>
      <li className="list-group-item dismiss">Dapibus ac facilisis in</li>
    </ul>
  </div>)
}

const Dashboard = (props: DashboardProps) => {

  const t = useTrans()
  const router = useRouter()
  const {data: event} = useEvent()

  return (<MainLayout sidebar={{
    title: 'Dashboard ou nome so evento grande', component: <MeuComponente/>, sidebarCompact: true
  }}>
    <div className="row">
      <div className="col-12 p-4">
        <h1 className="page-title">Meus eventos</h1>

        <CardDeck>
          {event && event.getEditions().map(edition => {
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
                  <button className="btn btn-outline-secondary -btn-block">Enviar trabalho</button>
                  <button className="btn btn-primary -btn-block">Fazer inscrição</button>
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
