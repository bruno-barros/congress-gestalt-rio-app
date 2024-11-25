import Head from "next/head";
import styles from "./main.module.scss";
import {asset, siteTitle} from "../../src/helpers";

import {useSelector} from "react-redux";
import {RootReducers} from "../../src/store/store.d";
import useCurrentUser from "../hooks/useCurrentUser";
import Footer from "./footer";
import {useQueryClient} from "react-query";
import Sidebar from "./sidebar";
import {ReactNode} from "react";
import Header from "./header";
import useSessionCountdown from "../hooks/useSessionCountdown";
import usePushNotification from "../hooks/usePushNotification";
import CurtainDelayed from "../ui/curtain-delayed";
import useTrans from "../hooks/useTrans";
import {Trans} from "react-i18next";
import {useRouter} from "next/router";
import ConsentTerms from '../user/consent-terms';
import Loading from "../ui/loading";
import BlockUi from "../ui/block-ui";
import useSettings from "../hooks/useSettings";
import AffirmativeActionAlert from "../user/affirmative-action-alert";


interface MainLayoutProps {
  children: any
  sidebar?: { title?: string; component: ReactNode, sidebarCompact?: boolean }
  pageHeader?: { title: string }
  fullWidth?: boolean
}

function MainLayout({children, sidebar, pageHeader, fullWidth}: MainLayoutProps) {

  const t = useTrans()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: event, isLoading} = useSettings()
  const {authLoading, user} = useCurrentUser()
  const blockUI = useSelector((state: RootReducers) => state?.ui?.blockui);
  const {InitPushNotification, isInitialized} = usePushNotification()
  useSessionCountdown()

  if (isLoading || authLoading) {
    return <Loading vspace={100}/>
  }

  InitPushNotification()

  return (
    <div className={`layout-main`}>
      <BlockUi blocking={blockUI}/>
      <Head>
        <title>{siteTitle('', queryClient)}</title>
        <link rel="icon" href={asset('/favicon.ico')}/>
      </Head>
      <ConsentTerms />
      <Header event={event} user={user}/>

      {!user.hasMinimumRegisteredFields() &&
      <CurtainDelayed>
        <div className="alert alert-warning text-center mb-0">
          <Trans as="p" i18nKey="cadastro.esta-incompleto">Seu cadastro está incompleto. Por favor, <a href="" onClick={(e) => {
            e.preventDefault()
            router.push(`/profile?tab=personal`)
          }}>atualize seu perfil</a>.</Trans>

        </div>
      </CurtainDelayed>}
      <AffirmativeActionAlert />

      {pageHeader && <div className="page-header">
        <div className="title">{pageHeader.title}</div>
      </div>}


      <main className={`main ${fullWidth && 'full-width'} ${pageHeader && 'has-page-header'}`}>
        {sidebar
        && <div className={`sidebar ${!!sidebar?.sidebarCompact && 'compact'}`}>
          <Sidebar sidebar={sidebar} compact={!!sidebar?.sidebarCompact}/>
        </div>}

        <div className={`content`}>
          {children}
        </div>
      </main>

      <Footer/>
    </div>
  )
}

export default MainLayout;
