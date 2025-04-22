import { useRouter } from "next/router";
import { ActivitySchema } from "../../../src/types/activity.type";
import useTrans from "../../hooks/useTrans";
import moment from "moment";
import Model from "../../../src/resources/activity";
import { dump } from "../../../src/helpers";
import { AddToCalendarButton } from 'add-to-calendar-button-react';

interface Props {
    activity: ActivitySchema;
}
export default function ActivityAddCalendar(props: Props) {
  const { activity } = props;
  const router = useRouter();
  const t = useTrans();
  const lang = router.locale || "pt";
  const Activity = Model.make(activity);
  const ds = moment(activity.start_at);
  const de = moment(activity.end_at);
  const hs = moment(activity.start_at).format("HH:mm");
  const he = moment(activity.end_at).format("HH:mm");
  let items = [
    { outlook: 'Outlook' },
    { outlookcom: 'Outlook.com' },
    { apple: 'Apple Calendar' },
    { yahoo: 'Yahoo' },
    { google: 'Google' }
 ];
  const eventObj = {
    title: Activity.getTitle(lang),
    description: Activity.getDescription(lang),
    location: Activity?.venue?.label || Activity?.room?.label || "",
    // startTime: ds.format("YYYY-MM-DDTHH:mm:ss"),
    // endTime: de.format("YYYY-MM-DDTHH:mm:ss"),
    startTime: '2016-09-16T20:15:00-04:00',
    endTime: '2016-09-16T21:45:00-04:00',
    timeZone: 'America/Sao_Paulo',
};

return <><AddToCalendarButton
name={eventObj.title}
description={eventObj.description}
options={['Google','Apple','Microsoft365','iCal']}
location={eventObj.location}
startDate={ds.format("YYYY-MM-DD")}
endDate={de.format("YYYY-MM-DD")}
startTime={ds.format("HH:mm")}
endTime={de.format("HH:mm")}
timeZone={eventObj.timeZone}
label={t("tempo.adicionar-calendario")}
></AddToCalendarButton></>
}