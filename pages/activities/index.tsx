import { useRouter } from "next/router";
import EditionSidebar from "../../components/event/edition-sidebar";
import privateRoute from "../../components/hoc/private-route";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useSettings from "../../components/hooks/useSettings";
import MainLayout from "../../components/layout/main";
import Head from "next/head";
import { siteTitle } from "../../src/helpers";
import { QueryCache, useQueryClient } from "react-query";
import useTrans from "../../components/hooks/useTrans";
import AvailableActivities from "../../components/activities/available-activities";
import MyActivities from "../../components/activities/my-activities";
import MyActivitiesContextProvider from "../../components/activities/my-actvities-context";
import { dump } from "../../src/helpers";
import moment from "moment";

function ActivitiesPage() {

    const t  = useTrans()
    const queryClient = useQueryClient()
    const router = useRouter()
    const { user } = useCurrentUser()
    const editionKey = String(router.query?.edition) || undefined
    const { data: event, currentEdition: edition } = useSettings(editionKey)
    const ActivityCnf = edition?.Activity()
    const isActivityAllowed = ActivityCnf?.isOpenToApply(user)
    const isCheckinAllowed = ActivityCnf?.isCheckinAllowed()
    const cancelLimit = ActivityCnf?.cancel_limit_at ? moment(ActivityCnf?.cancel_limit_at).format('DD/MM/YYYY') : null
    const endAt = ActivityCnf?.end_at ? moment(ActivityCnf?.end_at).format('DD/MM/YYYY') : null
    const limit = ActivityCnf?.limit_per_participant || null
    const myActs: any[] = queryClient.getQueryData(["user_activities",user?.getId(),editionKey]) || [];
    const hasActivities = myActs && myActs.length > 0;

    return <MainLayout
    sidebar={{title: edition?.getName(), component: <EditionSidebar edition={edition}/>, sidebarCompact: true}}>
    <Head>
      <title>{siteTitle(t('atividades.plural'), queryClient)}</title>
    </Head>
    {/* {dump(myActs)} */}
    <div className="row">
        <div className="col-12 col-lg-8 p-4">
            <h1 className="page-title">{t('atividades.plural')}</h1>
            {isActivityAllowed && <>
                <p>{endAt && `O período de inscrição nas atividades vai até ${endAt}. `}{limit && `É permitido a inscrição em até ${limit} atividades por pessoa.`}</p>
                <p>Selecione as atividades que deseja participar para reservar sua vaga. {cancelLimit && `Você poderá cancelar a inscrição em uma atividade até a data limite de ${cancelLimit}.`}</p>            
            </>}
            {(!isActivityAllowed && !hasActivities) && 
            <div className="alert alert-warning text-center">
                {t('atividades.indisponivel')}
            </div>}            
        </div>
    </div>
    <MyActivitiesContextProvider>
    <div className="row">
        {isActivityAllowed && 
        <div className="col-12 col-lg-7 px-lg-4 mb-4">
            <AvailableActivities />
        </div>}
        <div className={`${isActivityAllowed ? 'col-12 col-lg-5' : 'col-12 col-lg-8'} px-lg-4 mb-4`}>
            <MyActivities checkinAllowed={isCheckinAllowed} />
        </div>
    </div>
    </MyActivitiesContextProvider>

    </MainLayout>
}

export default privateRoute(ActivitiesPage)