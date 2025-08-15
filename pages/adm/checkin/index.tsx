import Head from "next/head";
import privateRoute from "../../../components/hoc/private-route";
import MainLayout from "../../../components/layout";
import { dump, siteTitle } from "../../../src/helpers";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import useActivities from "../../../components/hooks/activities/useActivities";
import ActivitiesTable from "../../../components/tables/ActivitiesTable";
import ProgressBar from "../../../components/ui/progressbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Icon from "../../../components/ui/ionicon";

const AdmCheckin = () => {
  const queryClient = useQueryClient();
  const {
    query: { edition },
  } = useRouter();
  
  const { data: activities, isLoading, isFetching, refetch } = useActivities(String(edition));

  function handleRefresh(){
refetch();
  }

   function PageHeader(){
    return <div className="d-flex justify-content-between align-items-center">
        <div className="title">Check-In</div>
        <ButtonGroup size="sm" onClick={handleRefresh}>
            <Button variant="secondary">
                <Icon name="refresh-outline" style={{marginRight: '5px'}} />
                atualizar
            </Button>
        </ButtonGroup>
        {/* {dump(activity)} */}
    </div>
  }

  return (
    <MainLayout fullWidth pageHeader={<PageHeader />}>
      <Head>
        <title>{siteTitle("Checkin", queryClient)}</title>
      </Head>
      {(isLoading || isFetching) && <ProgressBar />}
      <div className="">
          {!isLoading && activities && <ActivitiesTable data={activities} />}
          {!activities && !isLoading && <p>Nenhuma atividade.</p>}
  
      </div>
    </MainLayout>
  );
};
export default privateRoute(AdmCheckin);
