import Head from 'next/head'
import Link from 'next/link';
import Layout from "../components/layout";
import {asset, siteTitle} from "../src/helpers";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useDispatch, useSelector} from "react-redux";
import {useQueryClient} from "react-query";


export default function Home() {
  const disp = useDispatch()
  const queryClient = useQueryClient()

  return (
    <div className="container vh-100 d-flex align-items-center ">
      <Head>
        <title>{siteTitle('', queryClient)}</title>
      </Head>
      <div className="row">
        <div className="col">

          <Row>
            <Col md>
              <h1 className="text-right">Tela de desenvolvimento</h1>
            </Col>
            <Col  md>
              <p>
                <Link href="/login" passHref>
                  <a className="btn btn-outline-primary">Login</a>
                </Link>
              </p>
              <p>
                <Link href="/example-form" passHref>
                  <Button variant="outline-secondary">Entrar como admin</Button>
                </Link>
              </p>
              <p>
                <Link href="/example-api" passHref>
                  <Button variant="outline-info">Entrar como usuário</Button>
                </Link>
              </p>

            </Col>

          </Row>
        </div>
      </div>
    </div>
  )
}
