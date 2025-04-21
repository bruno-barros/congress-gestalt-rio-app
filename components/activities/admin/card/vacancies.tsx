import ProgressBar from "react-bootstrap/ProgressBar";
import { ActivitySchema } from "../../../../src/types/activity.type";

interface Props {
  activity: ActivitySchema;
}
export default function Vacancies(props: Props) {
  const { activity: a } = props;

  const now = Math.round((a.occupation / a.vacancies) * 100);
  const perc = now < 5 ? 5 : now

  return (
    <div className="row mb-3">
      <div className="col-auto">
        <div className="text-xs">Vagas</div>
        <div className="font-weight-bold" style={{ fontSize: "1.6em", lineHeight: '1em' }}>
          {a.vacancies}
        </div>
      </div>
      <div className="col">
        <div className="text-xs mb-1">Ocupação</div>
        <ProgressBar variant={perc === 100 ? 'danger' : 'success'} now={perc} label={a.occupation} />
      </div>
    </div>
  );
}
