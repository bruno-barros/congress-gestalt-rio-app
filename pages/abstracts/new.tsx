import MainLayout from "../../components/layout";
import useTrans from "../../components/hooks/useTrans";
import useEvent from "../../components/hooks/useEvent";
import {Edition} from "../../src/resources/event";
import EditionSidebar from "../../components/event/edition-sidebar";
import AbstractForm from "../../components/abstract/abstract-form";


interface NewAbstractProps {

}

const NewAbstract = (props: NewAbstractProps) => {

  const t = useTrans()
  const {data: event, isLoading} = useEvent()
  const edition: Edition = event?.currentEdition()

  if(isLoading) {
    return null;
  }

  return (<MainLayout sidebar={{title: edition.name, component: <EditionSidebar edition={edition}/>}}>
    <div className="row">
      <div className="col-12 col-md-8 pl-lg-4 pl-xl-5">
        <h1 className="page-title mt-3">Novo trabalho</h1>
        <AbstractForm edition={edition} abstract={null}/>

      </div>
      <div className="col-12 col-md-4">

        <div className="border-info pl-4 my-5" style={{borderLeft: 'solid 3px'}}>
          Confira as <a href="#" target="_blank">regras de submissão de trabalhos</a>.
        </div>
        <div className="border-info pl-4 py-1 my-1 text-sm " style={{borderLeft: 'solid 3px'}}>
          <h6>Título</h6>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa dolorem doloremque ea error explicabo,
            inventore iure modi, necessitatibus nihil officiis pariatur quam quas rem repellendus sequi soluta suscipit
            velit voluptatibus.</p>
        </div>
        <div className="border-info pl-4 py-1 my-1 text-sm" style={{borderLeft: 'solid 3px'}}>
          <h6>Conteúdo</h6>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa dolorem doloremque ea error explicabo,
            inventore iure modi, necessitatibus nihil officiis pariatur quam quas rem repellendus sequi soluta suscipit
            velit voluptatibus.</p>
        </div>

      </div>
    </div>
    <hr/>
        {/*<pre>{JSON.stringify(edition, null, 2)}</pre>*/}
  </MainLayout>)
}

export default NewAbstract
