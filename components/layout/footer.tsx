import styles from "./main.module.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {siteTitle} from "../../src/helpers";
import {useQueryClient} from "react-query";

export default function Footer() {
  const today = new Date;
  const queryClient = useQueryClient()
  return (<footer>
    <Container>
      <Row>
        <Col>
          <div className="text-center text-muted text-sm">
            &copy;{siteTitle(`${today.getFullYear()}`, queryClient)} - {process.env.version}
          </div>
        </Col>
      </Row>
    </Container>
  </footer>)
}
