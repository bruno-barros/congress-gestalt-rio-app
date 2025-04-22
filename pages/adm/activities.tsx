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
import AdmActivitiesContextProvider from "../../components/activities/admin/adm-activities-context";
import ActivitiesFilters from "../../components/activities/admin/activities-filter";
import ActivitiesPage from "../../components/activities/admin/activities-page";


const AdmActivities = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTrans();

  return (
    <MainLayout fullWidth pageHeader={{ title: "Atividades" }}>
      <Head>
        <title>{siteTitle("Admin - Atividades", queryClient)}</title>
      </Head>
      <AdmActivitiesContextProvider>
      <div className="row">
        <div className="col-12 col-md-2 border-right py-3 px-md-3">
            <ActivitiesFilters />
        </div>
        <div className="col-12 col-md-10">
          <ActivitiesPage />
        </div>
      </div>
      </AdmActivitiesContextProvider>
    </MainLayout>
  );
};

export default privateRoute(AdmActivities);
