import Head from "next/head";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./main.module.scss";
import {asset, siteTitle} from "../../src/helpers";

import {useSelector} from "react-redux";
import {RootReducers} from "../../src/store/store.d";
import {BlockUi} from "@brunobarros/react-components/dist";
import useConfig from "../hooks/useConfig";
import useCurrentUser from "../hooks/useCurrentUser";

// import BlockUi from "../ui/block-ui";

interface MainLayoutProps {
  children: any;
  home?: boolean;
}

function MainLayout({children, home}: MainLayoutProps) {

  const {data: config} = useConfig()
  const {authLoading, user} = useCurrentUser()
  const blockUI = useSelector((state: RootReducers) => state?.ui?.blockui);
  const today = new Date;

  return (
    <div className={styles.container}>
      <BlockUi blocking={blockUI}/>
        <Head>
          <title>{siteTitle()}</title>
          <link rel="icon" href={asset('/favicon.ico')}/>
        </Head>

        <header className={styles.header}>
          <Container>
            <Row>
              <Col>
                main header
              </Col>
            </Row>
          </Container>
        </header>

        <main className={styles.main}>
          <Container>
            {children}
          </Container>
        </main>

        <footer className={styles.footer}>
          <Container>
            <Row>
              <Col>
                <p className="text-center text-muted">
                  &copy;{siteTitle(`${today.getFullYear()}`)} - {process.env.version}
                </p>
              </Col>
            </Row>
          </Container>
        </footer>
    </div>
  )
}

export default MainLayout;
