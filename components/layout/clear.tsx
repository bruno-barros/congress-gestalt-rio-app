import Head from "next/head";
import Image from 'next/image'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./main.module.scss";
import {asset, siteTitle} from "../../src/helpers";
import {useSelector} from "react-redux";
import {RootReducers} from "../../src/store/store.d";
import useEvent from "../hooks/useEvent";
import useCurrentUser from "../hooks/useCurrentUser";
import Footer from "./footer";
import {useQueryClient} from "react-query";
import useSessionCountdown from "../hooks/useSessionCountdown";
import Loading from "../ui/loading";
import BlockUi from "../ui/block-ui";
import useSettings from "../hooks/useSettings";

interface ClearLayoutProps {
  children: any;
  ignoreSessionCountDown?: boolean
}

function ClearLayout({children, ignoreSessionCountDown}: ClearLayoutProps) {

  const queryClient = useQueryClient()
  const { data: event, currentEdition: edition, isLoading} = useSettings()
  const {authLoading, user} = useCurrentUser()
  const blockUI = useSelector((state: RootReducers) => state?.ui?.blockui);
  useSessionCountdown({ignore: !!ignoreSessionCountDown});

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
              {edition.getLogo()
                ? <img src={edition.getLogo()} className="brand img-fluid" alt={edition.getName()}/>
                : <div className="brand">{edition.getName()}</div>}
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
