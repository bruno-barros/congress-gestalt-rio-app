import Head from "next/head";
import privateRoute from "../../components/hoc/private-route";
import MainLayout from "../../components/layout";
import { dump, siteTitle } from "../../src/helpers";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import useActivities from "../../components/hooks/activities/useActivities";
import ActivitiesTable from "../../components/tables/ActivitiesTable";
import ProgressBar from "../../components/ui/progressbar";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Icon from "../../components/ui/ionicon";
import useCertificates from "../../components/hooks/useCertificates";
import CertificatesTable from "../../components/tables/CertificatesTable";

const AdmCertificates = () => {
  const queryClient = useQueryClient();
  const {
    query: { edition },
  } = useRouter();
  
  const { data: certificates, isLoading, isFetching, refetch } = useCertificates(String(edition));

  function handleRefresh(){
refetch();
  }

   function PageHeader(){
    return <div className="d-flex justify-content-between align-items-center">
        <div className="title">Certificados gerados</div>
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
          {!isLoading && certificates && <CertificatesTable data={certificates} />}
          {!certificates && !isLoading && <p>Nenhum certificado gerado.</p>}
  
      </div>
    </MainLayout>
  );
};
export default privateRoute(AdmCertificates);
