import Card from "react-bootstrap/Card";
import useUserActivities from "../hooks/activities/useUserActivities";
import useCurrentUser from "../hooks/useCurrentUser";
import { useMyActivitiesContext } from "./my-actvities-context";
import ProgressBar from "../ui/progressbar";
import s from './activities.module.scss';
import AvailableActivitiesLine from "./available-activity-line";
import useSettings from "../hooks/useSettings";
import useTrans from "../hooks/useTrans";

export default function MyActivities() {
  const { loading, setLoading, edition } = useMyActivitiesContext();
  const { user } = useCurrentUser();
  const t = useTrans();
  const { data: event, currentEdition } = useSettings(String(edition));
  const ActivityCnf = currentEdition?.Activity()
  const { data: activities, isLoading, isFetching } = useUserActivities(user?.getId(), edition);
  const nothing = activities?.length === 0;
  const limit  = ActivityCnf?.limit_per_participant || 0;
  const myCount = activities?.length || 0;

  if(nothing || isLoading) {
    return <Card>
      {(isLoading) && <ProgressBar />}
      <Card.Body>
        <Card.Title>{t('atividades.intro-titulo')}</Card.Title>
        <Card.Text>
        {t('atividades.intro-desc')}
        </Card.Text>
      </Card.Body>
    </Card>;

  }

  return <Card className={s.my_card}>
    <Card.Header><b>{t('atividades.minhas-atividades')} {limit && <>({myCount}/{limit})</>}</b></Card.Header>
      {(isLoading || isFetching) && <ProgressBar />}
      <div className="list-group list-group-flush">
      {(activities?.length > 0) && activities.map(a => {
        return <AvailableActivitiesLine context="my-activities" key={a.id} activity={a} />;
      })}

    </div>
  </Card>;
}
