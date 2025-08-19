import MainLayout from "../../components/layout";
import { useCallback, useMemo } from "react";
import { DynamicTable } from "../../components/dynamic-table";
import useTrans from "../../components/hooks/useTrans";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import privateRoute from "../../components/hoc/private-route";
import { siteTitle } from "../../src/helpers";
import Head from "next/head";
import Loading from "../../components/ui/loading";
import useSettings from "../../components/hooks/useSettings";
import useActivities from "../../components/hooks/activities/useActivities";
import AdmActivitiesContextProvider, { useAdmActivitiesContext } from "../../components/activities/admin/adm-activities-context";
import ActivitiesFilters from "../../components/activities/admin/activities-filter";
import ActivitiesPage from "../../components/activities/admin/activities-page";
import FindUser from "../../components/user/find-user";
import useActivityContext from "../../components/settings/activities/activities-context";

const AdmActivities = () => {
  return <AdmActivitiesContextProvider>
    <InnerPage />
  </AdmActivitiesContextProvider>;
}

const InnerPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTrans();
  // const { setFilters } = useAdmActivitiesContext();

  function PageHeader(){
    return <div className="d-flex justify-content-between align-items-center">
      <div className="title">Atividades</div>
      <div>
        <FindUser appendFilter onUpdate={(user)=>{
          // setFilters(p => ({user_id: user?.getId() || null}));
          // console.log('Selected user:', user);
        }} />
      </div>
    </div>
  }

  return (
    <MainLayout fullWidth pageHeader={<PageHeader />} >
      <Head>
        <title>{siteTitle("Admin - Atividades", queryClient)}</title>
      </Head>      
      <div className="row">
        {/* <div className="col-12 col-md-2 border-right py-3 px-md-3">
            <ActivitiesFilters />
        </div> */}
        <div className="col-12 mb-3">
          <ActivitiesPage />
        </div>
      </div>
    </MainLayout>
  );
};

export default privateRoute(AdmActivities);
