import Layout from "../components/layout";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {useDispatch} from "react-redux";
import {fetchUserData, postLogin} from "../src/store/user.actions";
import Link from "next/link";
import {blockUi} from "../src/store/ui.actions";
import Router from "next/router";


interface ExampleApiProps {

}

const ExampleApi = (props: ExampleApiProps) => {
  const disp = useDispatch();

  return (<Layout>
    <Row>
      <Col>
        <p><Link href="/" passHref><a>back home</a></Link></p>
        <Button onClick={() => {
          disp(postLogin({
            login: 'admin', password: 'admin'
          }, (user: any, err: any) => {

            console.log('postLogin.callback.user', user);
            console.log('postLogin.callback.err', err);
            Router.push('/example-protected')
          }))
        }}>login as admin</Button>
        <hr className="my-1"/>
        <Button onClick={() => {
          disp(postLogin({
            login: 'admin', password: 'bla blla'
          }, (user: any, err: any) => {
            console.log('postLogin.callback.user', user);
            console.log('postLogin.callback.err', err);
          }))
        }}>failed login</Button>
        <hr className="my-1"/>
      </Col>
    </Row>
  </Layout>)
}

export default ExampleApi;
