import ProgressBar from "react-bootstrap/ProgressBar";
import { ActivitySchema } from "../../../../src/types/activity.type";
import moment from "moment";

interface Props {
  activity: ActivitySchema;
}
export default function Place(props: Props) {
  const { activity: a } = props;

  const venue = a?.venue?.label || ''
  const room = a?.room?.label || ''

  return (
    <div className="row -mb-3">
        {venue && <div className="col-auto">
        <div className="text-xs">Local</div>
        <div
          className="font-weight-bold"
          style={{ fontSize: "1em", lineHeight: "1em" }}
        >
          {venue}
        </div>
      </div>}
      {room && <div className="col-auto">
        <div className="text-xs">Sala</div>
        <div
          className="font-weight-bold"
          style={{ fontSize: "1em", lineHeight: "1em" }}
        >
         {room}
        </div>
      </div>}
      
    </div>
  );
}
