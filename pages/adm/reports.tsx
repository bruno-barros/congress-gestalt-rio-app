import Head from "next/head";
import MainLayout from "../../components/layout";
import { dump, siteTitle } from "../../src/helpers";
import privateRoute from "../../components/hoc/private-route";
import { useQueryClient } from "react-query";
import GlobalUsers from "../../components/reports/global-users";
import useReportsContext, { ReportsContextProvider } from "../../components/reports/reports-context";
import AbstractsReports from "../../components/reports/abstracts-reports";
import SubscriptionsReports from "../../components/reports/subscriptions-reports";
import { useRouter } from "next/router";
import useSettings from "../../components/hooks/useSettings";
import { useEffect } from "react";
import BtnRefresh from "../../components/reports/pieces/btn-refresh";

function ReportsWithContext(){
  return (
    <ReportsContextProvider>
      <Reports />
    </ReportsContextProvider>
  );
}

function Reports() {
  const queryClient = useQueryClient();
  const { edition, setEdition } = useReportsContext();
  const router = useRouter();
  const { data: evt, isLoading, isFetching, currentEdition } = useSettings(edition);
  
    
  useEffect(() => {
    const ed = router.query?.edition ? String(router.query?.edition) : null;
    if(currentEdition) setEdition(currentEdition.getId());
    if (ed) setEdition(ed);
  }, [router.query, currentEdition]);


  return (
    <MainLayout fullWidth>
      <Head>
        <title>{siteTitle("Estatísticas", queryClient)}</title>
      </Head>
      {/* {dump(evt?.getEditionsKeys())} */}
      <div className="row">
        <div className="col-12 p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="page-title">Estatísticas <small className="text-muted">{edition}</small></h1>
            <div className="">
              <BtnRefresh />
            </div>
          </div>
          <GlobalUsers />
          <AbstractsReports />
          <SubscriptionsReports />
        </div>
      </div>
    </MainLayout>
  );
}

export default privateRoute(ReportsWithContext);