import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {useEffect, useState} from "react";
import {useQuery} from "react-query";
import Layout from "../components/layout";
import {asset, siteTitle} from "../src/helpers";
import Imdb from "../src/resources/imdb";


const Example = () => {
  const [keyword, setKeyword] = useState('iron man')
  const { isLoading, isError, data, error } = useQuery([Imdb.collectionKey, keyword], fetchMovies)


  async function  fetchMovies(){
    return await Imdb.search(keyword);
  }

  return (
    <Layout>
      <Row>
        <Col>
          <Card>
            <Card.Header>Featured</Card.Header>
            <Card.Body style={{
              backgroundImage: `url(${asset('/img/bg-pattern.png')})`
            }}>
              <Card.Title>My card</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
              <Card.Text>
                My card
              </Card.Text>
              <Link href="/" passHref>
                <Card.Link>back to home</Card.Link>
              </Link>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <button onClick={()=>{
                setKeyword('iron man')
              }}>iron man</button>
              <button onClick={()=>{
                setKeyword('spider man')
              }}>spider man</button> { keyword }
            </Card.Header>
            <Card.Body>
              {isLoading && <pre>Carregando...</pre>}
              {isError && <pre>{JSON.stringify(error, null, 2)}</pre>}
              {data && <pre>{JSON.stringify(data, null, 2)}</pre>}

            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Layout>
  )
}

export default Example;
