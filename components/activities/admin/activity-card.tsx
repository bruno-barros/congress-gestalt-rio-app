import Button from "react-bootstrap/Button";
import { ActivitySchema } from "../../../src/types/activity.type";
import Date from "./card/date";
import Vacancies from "./card/vacancies";
import { useAdmActivitiesContext } from "./adm-activities-context";
import Place from "./card/place";

interface ActivityCardProps {
    activity: ActivitySchema;
}
export default function ActivityCard(props: ActivityCardProps) {
    const { activity: a } = props;
    const { openSubscriptionPanel } = useAdmActivitiesContext()


    function handleSubscriptionPanel(){
        openSubscriptionPanel(a.id)
    }

    return (
        <div className="card">
        <div className="card-header font-weight-bold">{a.title}</div>
        <div className="card-body">
            <Date activity={a} />
            <Vacancies activity={a} />   
            <Place activity={a} />         
        </div>
        {a.occupation > 0 && <div className="card-footer bg-white">
            {a.occupation > 0 && <Button size="sm" type="button" onClick={handleSubscriptionPanel}>Inscrições</Button>}            
        </div>}
        
        </div>
    );
}