import Head from 'next/head'
import Link from 'next/link';
import Layout from "../components/layout";
import {asset, siteTitle} from "../src/helpers";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useDispatch, useSelector} from "react-redux";


export default function Home() {
  const disp = useDispatch()
  return (
    <Layout>
      <Head>
        <title>{siteTitle()}</title>
      </Head>
      <Row>
        <Col>
          <h1 className="mb-4">{siteTitle()}</h1>
          <Row>
            <Col xs={12} md>
              <p>
                <Link href="/example-components" passHref>
                  <Button variant="outline-primary">Example components</Button>
                </Link>
              </p>
              <p>
                <Link href="/example-form" passHref>
                  <Button variant="outline-primary">Example form</Button>
                </Link>
              </p>
              <p>
                <Link href="/example-api" passHref>
                  <Button variant="outline-primary">Api debug</Button>
                </Link>
              </p>
              <p>
                <Link href="/example-protected" passHref>
                  <Button variant="outline-primary">Example protected</Button>
                </Link>
              </p>
              <p>
                <Link href="/motion" passHref>
                  <Button variant="outline-primary">Example Motion Frame</Button>
                </Link>
              </p>
            </Col>
            <Col md>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores beatae, consequuntur error
                explicabo
                fugit id, ipsa omnis porro quod ratione suscipit unde veniam. Eligendi esse iusto magni quasi, tempora
                ut!
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layout>
  )
}
