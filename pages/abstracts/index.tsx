import MainLayout from "../../components/layout";
import Card from "react-bootstrap/cjs/Card";
import useEvent from "../../components/hooks/useEvent";
import EditionSidebar from "../../components/event/edition-sidebar";
import {Loading} from "@brunobarros/react-components";
import AbstractCard from "../../components/abstract/abstract-card";


const Abstracts = () => {

  const {data: event} = useEvent()

  if(!event){
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  const currentEdition = event.getEditions()[0]

  return (<MainLayout sidebar={{title: currentEdition.name , component: <EditionSidebar edition={currentEdition}/>}}>
    <div className="row">
      <div className="col-12 p-4">
        <Card style={{maxWidth: 600}}>
          <Card.Body className="p-5">
            <p>Olá, congressista.</p>
            <p>Antes de submeter seu trabalho confira as <a href="#" target="_blank">regras de submissão de trabalhos</a>.
              Você pode enviar até 2 trabalhos.</p>
            <p><button className="btn btn-primary">Envie seu trabalho agora</button></p>
          </Card.Body>
        </Card>

        <AbstractCard/>

      </div>
    </div>
  </MainLayout>)
}

export default Abstracts
