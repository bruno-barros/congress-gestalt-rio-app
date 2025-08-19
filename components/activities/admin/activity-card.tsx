import Button from "react-bootstrap/Button";
import { ActivitySchema } from "../../../src/types/activity.type";
import Date from "./card/date";
import Vacancies from "./card/vacancies";
import { useAdmActivitiesContext } from "./adm-activities-context";
import Place from "./card/place";
import { useRouter } from "next/router";

interface ActivityCardProps {
    activity: ActivitySchema;
}
export default function ActivityCard(props: ActivityCardProps) {
    const { activity: a } = props;
    const router = useRouter();
    const { openSubscriptionPanel } = useAdmActivitiesContext()


    function handleSubscriptionPanel(){
        openSubscriptionPanel(a.id)
    }

    function handleQrcode(){
        // router.push(`/adm/qrcode?id=${a.id}&uuid=${a.uuid}`);
        window.open(`/adm/qrcode?id=${a.id}&uuid=${a.uuid}`, "_blank");
    }

    return (
        <div className="card">
        <div className="card-header font-weight-bold">{a.title}</div>
        <div className="card-body">
            <Date activity={a} />
            <Vacancies activity={a} />   
            <Place activity={a} />         
        </div>
        <div className="card-footer bg-white d-flex flex-wrap gap-3">
            <Button size="sm" type="button" onClick={handleSubscriptionPanel}>Inscrições</Button>
            <Button size="sm" type="button" variant="outline-primary" onClick={handleQrcode}>qrCode CheckIn</Button>
        </div>
        
        </div>
    );
}