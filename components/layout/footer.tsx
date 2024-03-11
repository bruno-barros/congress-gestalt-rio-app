import styles from "./main.module.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {asset, siteTitle} from "../../src/helpers";
import {useQueryClient} from "react-query";

export default function Footer() {
  const today = new Date;
  const queryClient = useQueryClient()
  return (<footer>
    <Container>
      <Row>
        <Col>
          <div className="text-center text-muted text-sm d-md-flex align-items-center justify-content-center" style={{gap: 15}}>
            <span>&copy;{siteTitle(`${today.getFullYear()}`, queryClient)} - {process.env.version}</span>
            <span className="d-flex align-items-center" style={{gap: 5}}>Apoio: <img src={asset('img/abg.png')} alt="ABG" className="img-fluid" style={{maxWidth: 60}} /></span>
          </div>
        </Col>
      </Row>
    </Container>
  </footer>)
}
