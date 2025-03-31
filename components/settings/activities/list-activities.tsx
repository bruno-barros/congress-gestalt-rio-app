import { useEffect, useReducer, useState } from "react";
import CustomSidePane from "../../side-pane/side-pane";
import Button from "react-bootstrap/Button";
import useActivities from "../../hooks/activities/useActivities";
import useSettings from "../../hooks/useSettings";
import { event } from "../../../src/gtag";
import useSettingsContext from "../settings-context";
import ProgressBar from "../../ui/progressbar";
import ActivityLine from "./activity-line";
import { ActivitySchema } from "../../../src/types/activity.type";
import useActivityContext from "./activities-context";
import { dump } from "../../../src/helpers";
import ActivityForm from "./activity-form";

export default function ListAcivities({ onActive, ...props }) {
  const { lang, setLang, currentEdition } = useSettingsContext();
  const [open, onClose] = useReducer((p) => !p, false);
  const { data: activities, isFetching, isLoading, refetch } = useActivities(currentEdition);
  const [filtered, setFiltered] = useState<ActivitySchema[]>([]);
  const { selected, setSelected } = useActivityContext();
// console.log(onActive, props)

  useEffect(()=>{
    if(activities){
      setFiltered(activities);
    }
  }, [activities])

  function handleFilter(e){
    if(e.key === 'Enter'){
      const s = e.target.value.toLowerCase()
      // console.log(e.target.value);
      const f = activities.filter((a)=>{
        return a.title.toLowerCase().includes(s)
        || a.start_at.includes(s)
        || a.end_at.includes(s);
      });
      setFiltered(f);
    }
  }

  return (
    <div>
      {/* {dump({selected})} */}
      <div className="d-flex justify-content-between align-items-center">
        <h3>Lista de atividades</h3>
        <Button type="button" variant="warning" size="sm" onClick={() => setSelected(0)}>
            Criar atividade
        </Button>
      </div>
      {(isLoading || isFetching) && <ProgressBar />}

      <div className="form-group">
        <input type="text" className="form-control" placeholder="Pesquisar..." onKeyDown={handleFilter} />
      </div>


      {((!activities || activities?.length === 0) && !isLoading) && 
      <div className="alert alert-warning d-flex justify-content-between align-items-center">
        <div>Nenhuma atividade encontrada. Crie sua primeira atividade!</div>        
      </div>}
      {(filtered?.length > 0) && filtered.map((activity) => {
        return <ActivityLine key={activity.id} activity={activity} />;
      })}
      

      <CustomSidePane
        width={65}
        onActive={onActive}
        open={selected !== null}
        onClose={() => setSelected(null)}
      >
        {() => {
          return <ActivityForm id={selected} onUpdate={() => {
            setSelected(null)
            refetch()
          }} />;
        }}
      </CustomSidePane>
    </div>
  );
}
