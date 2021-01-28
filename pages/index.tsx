import Head from 'next/head'
import Link from 'next/link';
import Layout from "../components/layout";
import {asset, siteTitle} from "../src/helpers";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {useDispatch, useSelector} from "react-redux";
import {useQueryClient} from "react-query";
import {logUserByType} from "../src/store/user.actions";
import {useRouter} from "next/router";
import React, {useEffect} from "react";
import {Loading} from "@brunobarros/react-components";


export default function Home() {
  const disp = useDispatch()
  const router = useRouter()
  const queryClient = useQueryClient()

  useEffect(()=>{
    if(process.env.production){
      router.push('/login')
    }
  }, [])

  if(process.env.production){
    return <Loading vspace={100}/>
  }

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
                  <Button variant="outline-secondary" onClick={()=>{
                    disp(logUserByType('admin', ()=>{
                      router.push(`/dashboard`)
                    }))
                  }}>Entrar como admin</Button>
              </p>
              <p>
                  <Button variant="outline-info" onClick={()=>{
                    disp(logUserByType('editor', ()=>{
                      router.push(`/dashboard`)
                    }))
                  }}>Entrar como supervisor</Button>
              </p>
              <p>
                  <Button variant="outline-info" onClick={()=>{
                    disp(logUserByType('contributor', ()=>{router.push(`/dashboard`)}))
                  }}>Entrar como avaliador</Button>
              </p>
              <p>
                  <Button variant="outline-info" onClick={()=>{
                    disp(logUserByType('subscriber', ()=>{router.push(`/dashboard`)}))
                  }}>Entrar como usuário</Button>
              </p>

            </Col>

          </Row>
        </div>
      </div>
    </div>
  )
}
