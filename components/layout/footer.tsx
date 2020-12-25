import styles from "./main.module.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {siteTitle} from "../../src/helpers";

export default function Footer() {
  const today = new Date;
  return (<footer className={styles.footer}>
    <Container>
      <Row>
        <Col>
          <p className="text-center text-muted">
            &copy;{siteTitle(`${today.getFullYear()}`)} - {process.env.version}
          </p>
        </Col>
      </Row>
    </Container>
  </footer>)
}
