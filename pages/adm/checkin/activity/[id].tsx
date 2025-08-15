import { useRouter } from "next/router";
import useActivity from "../../../../components/hooks/activities/useActivity";
import { dump, siteTitle } from "../../../../src/helpers";

import MainLayout from "../../../../components/layout";
import { useQueryClient } from "react-query";
import Head from "next/head";
import SubscribersTable from "../../../../components/tables/SubscribersTable";
import Link from "next/link";
import ProgressBar from "../../../../components/ui/progressbar";
import Icon from "../../../../components/ui/ionicon";
import  ButtonGroup  from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";

export default function ID() {
  const queryClient = useQueryClient();
  const {
    query: { id, edition },
  } = useRouter();
  const { data: activity, isLoading, isFetching, refetch } = useActivity(Number(id));
  const subscribers = activity?.valid_subscriptions || [];

  function handleRefresh(){
    refetch();
  }

  function PageHeader(){
    return <div className="d-flex justify-content-between align-items-center">
        <div className="title">Check-In: {activity?.title}</div>
        <ButtonGroup size="sm" onClick={handleRefresh} className="text-nowrap">
            <Button variant="secondary">
                <Icon name="refresh-outline" style={{marginRight: '5px'}} />
                atualizar
            </Button>
            <Link href={`/adm/checkin?edition=${edition}`} passHref><a className="btn btn-sm btn-outline-primary d-flex align-items-center">
                <Icon name="arrow-back-outline" style={{marginRight: '5px'}} />
                voltar para atividades</a></Link>
        </ButtonGroup>
        {/* {dump(activity)} */}
    </div>
  }

  return (
    <MainLayout fullWidth pageHeader={<PageHeader />}>
      <Head>
        <title>{siteTitle("Atividade para Checkin", queryClient)}</title>
      </Head>
      {(isLoading || isFetching) && <ProgressBar />}      
      <div>
        {/* {dump(activity)} */}
        <SubscribersTable data={subscribers} onUpdate={()=> refetch()} />

      </div>
    </MainLayout>
  );
}
