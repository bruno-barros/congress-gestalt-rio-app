import Button from "react-bootstrap/Button";
import { ActivitySchema } from "../../../src/types/activity.type";
import moment from "moment";
import useActivityContext from "./activities-context";

interface ActivityLineProps {
  activity: ActivitySchema;
}
export default function ActivityLine(props: ActivityLineProps) {
  const { activity } = props;
  const sd = moment(activity.start_at);
  const ed = moment(activity.end_at);
  const actv = activity.active
    const { setSelected} = useActivityContext();

  function handleClick(){
    setSelected(activity.id);
  }

  return <div className="border d-flex bg-light align-items-center" style={{marginTop: -1}}>
    <div className="d-flex align-items-center p-2">
        <div className={actv ? 'bg-success' : 'bg-warning'} style={{width: 10, height: 10, borderRadius: 10}}></div>
    </div>
    <div className="w-100 p-2">
        <div>
            <button onClick={handleClick} className={`btn btn-sm- font-weight-bold btn-link  p-0 ${actv?'':'text-muted'}`}>{activity.title}</button>
        </div>
        <div className="border-top_ text-xs d-flex flex-wrap overflow-hidden" style={{columnGap: '1rem'}}>
            <div>{sd.format('DD/MM/YYYY')}</div>
            <div className="text-nowrap">{sd.format('HH:mm')} — {ed.format('HH:mm')}</div>
            <div className="d-flex gap-1">Grupo: 
                <div className="text-truncate" style={{maxWidth: 200}}>jh kjhkj hkjh khkj</div></div>
            <div className="d-flex gap-1">Local: 
                <div className="text-truncate" style={{maxWidth: 200}}>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div></div>
            <div className="d-flex gap-1">Sala: 
                <div className="text-truncate" style={{maxWidth: 200}}>XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</div></div>

        </div>
    </div>
    <div>
        {/* <Button variant="outline-primary" size="sm">Ed</Button> */}
    </div>
    
    </div>;
}
