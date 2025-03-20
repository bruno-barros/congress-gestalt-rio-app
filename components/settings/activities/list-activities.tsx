import { useReducer } from "react";
import CustomSidePane from "../../side-pane/side-pane";
import Button from "react-bootstrap/Button";

export default function ListAcivities({onActive, ...props}) {

    const [open, onClose] = useReducer((p) => !p, false);

  return (
    <div>
      <h3>Lista de atividades</h3>
      <div className="alert alert-warning d-flex justify-content-between align-items-center">
        <div>Crie sua primeira atividade</div>
        <Button type="button" variant="warning" onClick={onClose}>Criar atividade</Button>
      </div>



      
     
      <CustomSidePane width={props.width - 5} onActive={onActive} open={open} onClose={onClose}>{() => {
        return <div>
            
            {
        /* loop 10 times */
        Array.from(Array(10).keys()).map((i) => {
          return (
            <div key={i}>
              <h4>Atividade {i}</h4>
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius
                dolorum saepe aut eum, praesentium corporis, iste rerum
                laudantium nihil omnis odio delectus earum voluptatibus animi
                sint nesciunt doloribus culpa mollitia!
              </p>
            </div>
          );
        })
      }
        </div>
      }}</CustomSidePane>
    </div>
  );
}
