import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Layout from "../components/layout";
import MyForm from "../components/my-form";
import Link from "next/link";



interface ExampleFormProps {

}

const ExampleForm = (props: ExampleFormProps) => {
  return (<Layout>
    <Row>
      <Col xs>
        <p><Link href="/" passHref><a>bak home</a></Link></p>
        <MyForm/>
      </Col>
    </Row>
  </Layout>)
}

export default ExampleForm;












