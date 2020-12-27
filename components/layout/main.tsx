import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./main.module.scss";
import {asset, siteTitle} from "../../src/helpers";

import {useSelector} from "react-redux";
import {RootReducers} from "../../src/store/store.d";
import {BlockUi, Loading} from "@brunobarros/react-components";
import useEvent from "../hooks/useEvent";
import useCurrentUser from "../hooks/useCurrentUser";
import Footer from "./footer";
import {useQueryClient} from "react-query";
import Sidebar from "./sidebar";
import {ReactNode} from "react";


interface MainLayoutProps {
  children: any
  sidebar?: {title?: string; component: ReactNode, sidebarCompact?: boolean}

}

function MainLayout({children, sidebar}: MainLayoutProps) {

  const queryClient = useQueryClient()
  const {data: event, isLoading} = useEvent()
  const {authLoading, user} = useCurrentUser()
  const blockUI = useSelector((state: RootReducers) => state?.ui?.blockui);


  if(isLoading || authLoading){
    return <Loading vspace={100}/>
  }

  return (
    <div className={`layout-main`}>
      <BlockUi blocking={blockUI}/>
        <Head>
          <title>{siteTitle('', queryClient)}</title>
          <link rel="icon" href={asset('/favicon.ico')}/>
        </Head>

        <header className="mainHeader">
          <Container fluid>
            <Row>
              <Col>
                main header
              </Col>
            </Row>
          </Container>
        </header>

        <main className="main">
          <div className={`sidebar ${!!sidebar.sidebarCompact && 'compact'}`}>
            <Sidebar sidebar={sidebar} compact={!!sidebar.sidebarCompact}/>
          </div>
          <div className="content">
            {children}
          </div>
        </main>

        <Footer/>
    </div>
  )
}

export default MainLayout;
