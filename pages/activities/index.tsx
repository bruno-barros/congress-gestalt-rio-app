import { useRouter } from "next/router";
import EditionSidebar from "../../components/event/edition-sidebar";
import privateRoute from "../../components/hoc/private-route";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useSettings from "../../components/hooks/useSettings";
import MainLayout from "../../components/layout/main";
import Head from "next/head";
import { siteTitle } from "../../src/helpers";
import { useQueryClient } from "react-query";
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
    const { data: event, currentEdition: edition } = useSettings(String(router.query?.edition) || undefined)
    const ActivityCnf = edition?.Activity()
    const isActivityAllowed = ActivityCnf?.isOpenToApply(user)
    const cancelLimit = ActivityCnf?.cancel_limit_at ? moment(ActivityCnf?.cancel_limit_at).format('DD/MM/YYYY') : null
    const endAt = ActivityCnf?.end_at ? moment(ActivityCnf?.end_at).format('DD/MM/YYYY') : null
    const limit = ActivityCnf?.limit_per_participant || null

    return <MainLayout
    sidebar={{title: edition?.getName(), component: <EditionSidebar edition={edition}/>, sidebarCompact: true}}>
    <Head>
      <title>{siteTitle(t('atividades.plural'), queryClient)}</title>
    </Head>
    <div className="row">
        <div className="col-12 col-lg-8 p-4">
            <h1 className="page-title">{t('atividades.plural')}</h1>
            <p>{endAt && `O período de inscrição nas atividades vai até ${endAt}. `}{limit && `É permitido a inscrição em até ${limit} atividades por pessoa.`}</p>
            <p>Selecione as atividades que deseja participar para reservar sua vaga. {cancelLimit && `Você poderá cancelar a inscrição em uma atividade até a data limite de ${cancelLimit}.`}</p>
            {!isActivityAllowed && 
            <div className="alert alert-warning text-center">
                {t('atividades.indisponivel')}
            </div>}            
        </div>
    </div>
    <MyActivitiesContextProvider>
    <div className="row">
        <div className="col-12 col-lg-7 px-lg-4 mb-4">
            <AvailableActivities />
        </div>
        <div className="col-12 col-lg-5 px-lg-4 mb-4">
            <MyActivities />
        </div>
    </div>
    </MyActivitiesContextProvider>

    </MainLayout>
}

export default privateRoute(ActivitiesPage)