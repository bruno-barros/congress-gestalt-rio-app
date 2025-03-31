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

export default function AbstractsReports() {
 
    const { colors, edition } = useReportsContext()
    const { data, isLoading, isFetching } = useStats(edition)
    const [total, setTotal] = useState(0)
    const statuses = getDataFromKey('abstracts_status', data)
    

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
                <div className="col">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                    width={500}
                    height={500}
                    data={statuses}
                    margin={{
                        top: 20,
                        // right: 30,
                        // left: 20,
                        // bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis  
                    // domain={[0, 100]} 
                    tickFormatter={(value, i) => {
                        const percent = (value / total) * 100
                        // console.log({value, total, percent})
                        // return `${value}%`
                        return `${percent.toFixed(0)}%`
                    }} type="number"  />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Bar dataKey="value" label={{ position: 'top' }}>
                    {statuses.map((entry, i) => {
                        return <Cell key={i} fill={colors[i]}/>
                    })}
                    </Bar>            
                    </BarChart>
                </ResponsiveContainer>
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