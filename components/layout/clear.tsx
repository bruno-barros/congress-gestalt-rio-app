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
import useConfig from "../hooks/useConfig";
import useCurrentUser from "../hooks/useCurrentUser";
import Footer from "./footer";
import {useQueryClient} from "react-query";

interface ClearLayoutProps {
  children: any;
}

function ClearLayout({children}: ClearLayoutProps) {

  const queryClient = useQueryClient()
  const {data: config, isLoading} = useConfig()
  const {authLoading, user} = useCurrentUser()
  const blockUI = useSelector((state: RootReducers) => state?.ui?.blockui);

  if(isLoading){
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
                {config.logoPrimary
                  ? <img src={config.logoPrimary} className="brand img-fluid" alt={config.eventName} />
                : <div className="brand">{config.eventName}</div>}
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
