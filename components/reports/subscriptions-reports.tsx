import s from "../../styles/reports.module.scss";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useReportsContext from "./reports-context";
import Card from "react-bootstrap/Card";
import TitleDivisor from "./title-divisor";
import CardNumber from "./pieces/card-number";
import useStats from "../hooks/useStats";
import { useEffect, useState } from "react";
import { getDataFromKey } from "./reports-helpers";
import LoadingData from "./pieces/loading-data";

export default function SubscriptionsReports() {

  const { colors, edition } = useReportsContext()
    const { data, isLoading, isFetching } = useStats(edition)
    const [total, setTotal] = useState(0)
    const byStates = getDataFromKey('subscriptions_states', data)
    const byProduct = getDataFromKey('subscriptions_products', data)

     useEffect(()=>{
        if(data) setTotal(getDataFromKey('users_subscribers', data))
    }, [data])

  return (
    <Card className={`mb-4 p-3 ${s.bg_hover}`}>
      <Card.Body>
        <TitleDivisor className="mb-3">Inscrições</TitleDivisor>
        {(isFetching || isLoading) && <LoadingData />}
        {data && <>
        <div className="row mb-4">
          <div className="col-auto mb-4 mb-md-0">
            <CardNumber label="total de inscritos" bg="primary" minWidth={200}>
              {total}
            </CardNumber>
          </div>
          <div className="col-auto mb-4 mb-md-0">
            <CardNumber
              label="necessidades especiais"
              bg="secondary"
              minWidth={200}
            >
              {getDataFromKey('subscriptions_pdc', data)}
            </CardNumber>
          </div>
          <div className="col-auto mb-4 mb-md-0">
            <CardNumber
              label="ações afirmativas"
              bg="secondary"
              minWidth={200}
            >
              {getDataFromKey('subscriptions_ac_afirmativas', data)}
            </CardNumber>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <TitleDivisor level={2} className="mb-2">
              Por estado
            </TitleDivisor>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={500}
                height={500}
                data={byStates}
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
                //   domain={[0, 100]}
                  tickFormatter={(value, i) => {
                    const percent = (value / total) * 100;
                    return `${percent.toFixed(0)}%`;
                  }}
                  type="number"
                />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="value" label={{ position: "top" }}>
                  {byStates.map((entry, i) => {
                    return <Cell key={i} fill={colors[i % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <TitleDivisor level={2} className="mb-2">
              Por Plano
            </TitleDivisor>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                width={500}
                height={500}
                data={byProduct}
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
                //   domain={[0, 100]}
                  tickFormatter={(value, i) => {
                    const percent = (value / total) * 100;
                    // return `${value}%`;
                    return `${percent.toFixed(0)}%`;
                  }}
                  type="number"
                />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="value" label={{ position: "top" }}>
                  {byProduct.map((entry, i) => {
                    return <Cell key={i} fill={colors[i % colors.length]} />;
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

function mockDataByState() {
  return [
    { name: "AC", value: 10 },
    { name: "AL", value: 10 },
    { name: "AP", value: 10 },
    { name: "AM", value: 10 },
    { name: "BA", value: 10 },
    { name: "CE", value: 10 },
    { name: "DF", value: 10 },
    { name: "ES", value: 300 },
    { name: "GO", value: 10 },
    { name: "MA", value: 10 },
    { name: "MT", value: 10 },
    { name: "MS", value: 10 },
    { name: "MG", value: 10 },
    { name: "PA", value: 10 },
    { name: "PB", value: 10 },
    { name: "PR", value: 10 },
    { name: "PE", value: 10 },
    { name: "PI", value: 10 },
    { name: "RJ", value: 10 },
    { name: "RN", value: 10 },
    { name: "RS", value: 10 },
    { name: "RO", value: 10 },
    { name: "RR", value: 10 },
    { name: "SC", value: 10 },
    { name: "SP", value: 10 },
    { name: "SE", value: 10 },
    { name: "TO", value: 10 },
    { name: "OUTRO", value: 10 },
  ];
}



function mockDataByPlan() {
  return [
    { name: "Plano 1", value: 87 },
    { name: "Plano 2", value: 106 },
    { name: "Plano 3", value: 170 },
    { name: "Plano 4", value: 170 },
    { name: "Plano 5", value: 10 },
  ];
}
