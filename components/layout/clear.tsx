import Head from "next/head";
import Image from 'next/image'
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
import useSessionCountdown from "../hooks/useSessionCountdown";

interface ClearLayoutProps {
  children: any;
}

function ClearLayout({children}: ClearLayoutProps) {

  const queryClient = useQueryClient()
  const {data: event, isLoading} = useEvent()
  const {authLoading, user} = useCurrentUser()
  const blockUI = useSelector((state: RootReducers) => state?.ui?.blockui);
  useSessionCountdown();

  if (isLoading) {
    return <Loading vspace={100}/>
  }

  return (
    <div className={`layout-clear`}>
      <BlockUi blocking={blockUI}/>
      <Head>
        <title>{siteTitle('', queryClient)}</title>
        <link rel="icon" href={asset('/favicon.ico')}/>
      </Head>

      <header className="mainHeader">
        <Container>
          <Row>
            <Col>
              {event.logoPrimary
                ? <img src={event.logoPrimary} className="brand img-fluid" alt={event.eventName}/>
                : <div className="brand">{event.eventName}</div>}
            </Col>
          </Row>
        </Container>
      </header>

      <main className="main">
        <Container>
          {children}
        </Container>
      </main>

      <Footer/>
    </div>
  )
}

export default ClearLayout;
