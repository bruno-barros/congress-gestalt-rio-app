import ProgressBar from "react-bootstrap/ProgressBar";
import { ActivitySchema } from "../../../../src/types/activity.type";
import moment from "moment";

interface Props {
  activity: ActivitySchema;
}
export default function Date(props: Props) {
  const { activity: a } = props;

  const ds = moment(a.start_at);
  const de = moment(a.end_at);

  return (
    <div className="row mb-3">
      <div className="col-auto">
        <div className="text-xs">Data</div>
        <div
          className="font-weight-bold"
          style={{ fontSize: "1.2em", lineHeight: "1em" }}
        >
          {ds.format("DD/MM")}
        </div>
      </div>
      <div className="col">
        <div className="text-xs">Período</div>
        <div
          className="font-weight-bold"
          style={{ fontSize: "1.2em", lineHeight: "1em" }}
        >
          {ds.format("HH:mm")} - {de.format("HH:mm")}
        </div>
      </div>
    </div>
  );
}
