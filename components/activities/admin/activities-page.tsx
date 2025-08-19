import ProgressBar from "../../ui/progressbar";
import { useAdmActivitiesContext } from "./adm-activities-context";
import s from "../activities.module.scss";
import ActivityCard from "./activity-card";
import CustomSidePane from "../../side-pane/side-pane";
import { useEffect, useReducer, useState } from "react";
import SubscriptionsPanel from "./subscription-panel";
import useActivities from "../../hooks/activities/useActivities";
import { useRouter } from "next/router";

export default function ActivitiesPage() {
  const router = useRouter();
  const _filters = router.query.filters
    ? JSON.parse(String(router.query.filters))
    : {};
//   console.log("Filters from query:", _filters);
  const {
    loading,
    edition,
    filtered,
    showSubscriptionPanel,
    dispatchSubscriptionPanel,
  } = useAdmActivitiesContext();

  const {
    data: activities,
    error,
    isLoading,
    isFetching,
  } = useActivities(edition, {
    user_id: _filters?.user_id || null,
  });
 

  if (loading || isLoading || isFetching) {
    return <ProgressBar />;
  }

  return (
    <>
      <div className={s.grid}>
        {activities &&
          activities.length > 0 &&
          activities.map((activity) => {
            return <ActivityCard key={activity.id} activity={activity} />;
          })}
      </div>
      {activities && activities.length === 0 && (
        <div className="text-center mt-5">Nenhuma atividade encontrada</div>
      )}
      <CustomSidePane
        open={showSubscriptionPanel}
        onClose={dispatchSubscriptionPanel}
      >
        {(props) => {
          return <SubscriptionsPanel {...props} />;
        }}
      </CustomSidePane>
    </>
  );
}
