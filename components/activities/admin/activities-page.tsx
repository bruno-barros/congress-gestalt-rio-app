import ProgressBar from "../../ui/progressbar";
import { useAdmActivitiesContext } from "./adm-activities-context";
import s from '../activities.module.scss'
import ActivityCard from "./activity-card";
import CustomSidePane from "../../side-pane/side-pane";
import { useReducer } from "react";
import SubscriptionsPanel from "./subscription-panel";

export default function ActivitiesPage() {

    const { activities, loading, filtered, showSubscriptionPanel, dispatchSubscriptionPanel } = useAdmActivitiesContext()
    

    if(loading){
        return <ProgressBar />
    }   

    return <>
        <div className={s.grid}>
        {filtered.map((activity) => {
            return <ActivityCard key={activity.id} activity={activity} />;
        })}
        </div>
        <CustomSidePane open={showSubscriptionPanel} onClose={dispatchSubscriptionPanel}>{(props) => {
            return <SubscriptionsPanel {...props} />;
        }}</CustomSidePane>
    </>
}