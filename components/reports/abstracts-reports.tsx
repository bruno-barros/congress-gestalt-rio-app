import Card from "react-bootstrap/Card";
import TitleDivisor from "./title-divisor";
import CardNumber from "./pieces/card-number";
import s from "../../styles/reports.module.scss";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import useReportsContext from "./reports-context";
import useStats from "../hooks/useStats";
import { getDataFromKey } from "./reports-helpers";
import LoadingData from "./pieces/loading-data";
import { useEffect, useState } from "react";
import BarPercentual from "./pieces/bar-percentual";

export default function AbstractsReports() {
 
    const { colors, edition } = useReportsContext()
    const { data, isLoading, isFetching } = useStats(edition)
    const [total, setTotal] = useState(0)
    const statuses = getDataFromKey('abstracts_status', data)
    const modalities = getDataFromKey('abstracts_modalities', data)
    const languages = getDataFromKey('abstracts_languages', data)
    

    useEffect(()=>{
        if(data) setTotal(getDataFromKey('abstracts_total', data))
    }, [data])
  return (
    <Card className={`mb-4 p-3 ${s.bg_hover}`}>
      <Card.Body>
        <TitleDivisor className="mb-3">Trabalhos</TitleDivisor>
        {(isFetching || isLoading) && <LoadingData />}
        {data && <>
            <div className="row">
                <div className="col-auto  mb-4 mb-md-0">
                    <CardNumber label="total de trabalhos" bg="primary" minWidth={200}>
                    {total}
                    </CardNumber>
                </div>
                {/*
              //region Por Status
              */}
                <div className="col">
                <BarPercentual data={statuses} total={total} height={400}/>
                </div>
            </div>
            {/*
            //region Modalidade e linguagem
            */}
            <div className="row">
              <div className="col-12 col-lg-9">
                <TitleDivisor className="mb-3" level={2}>Modalidades</TitleDivisor>
                <BarPercentual data={modalities} total={total}/>
              </div>
              <div className="col-12 col-lg-3">
                <TitleDivisor className="mb-3" level={2}>Linguagem</TitleDivisor>
                <BarPercentual data={languages} total={total}/>
              </div>
            </div>
        </>}
        
      </Card.Body>
    </Card>
  );
}

function mockData(){
    return [
        {
          "name": "Registrados",
          "value": 400
        },
        {
          "name": "Em avaliação",
          "value": 300
        },
        {
          "name": "Aguardando alterações",
          "value": 90
        },
        {
          "name": "Rejeitados",
          "value": 1
        },
        {
          "name": "Pré-aprovados",
          "value": 190
        },
        {
          "name": "Aprovados",
          "value": 50
        },
      ];
}