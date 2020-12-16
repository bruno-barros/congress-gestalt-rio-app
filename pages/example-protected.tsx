import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "../components/layout";
import privateRoute, {AuthProps} from "../components/hoc/private-route";
import AuthToken from "../src/http/auth-token";
import Button from "react-bootstrap/Button";
import {useDispatch} from "react-redux";
import {fetchUserData, renewAuthToken} from "../src/store/user.actions";

type Props = AuthProps;

function ExampleProtected({auth}: Props) {

  const disp = useDispatch()

  return (<Layout>
      <Row>
        <Col>
          <p><Link href="/" passHref><a>back home</a></Link></p>

          <h1>Protected page</h1>
          <p><strong>user</strong>: {JSON.stringify(auth.decodedToken)}</p>
          <p><strong>isValid</strong>: {auth.isValid.toString()}</p>
          <p><strong>isExpired</strong>: {auth.isExpired.toString()}</p>
          {/*<p><strong>authorizationString</strong>: {auth.authorizationString}</p>*/}
          {/*<p><strong>expiresAt</strong>: {auth.expiresAt.toString()}</p>*/}
          <p><a href="" onClick={() => {
            AuthToken.logout(true);
          }}>logout</a></p>
          <p><Button onClick={() => {
            disp(renewAuthToken())
          }}>Renovar token</Button></p>
          <p><Button onClick={() => {
            disp(fetchUserData())
          }}>Refill user</Button></p>

        </Col>
      </Row>
    </Layout>
  );
}

export default privateRoute(ExampleProtected);
