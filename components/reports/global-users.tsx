import Card from "react-bootstrap/Card";
import TitleDivisor from "./title-divisor";
import s from "../../styles/reports.module.scss";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import useReportsContext from "./reports-context";
import CenteredLabel from "./pieces/centered-label";
import CardNumber from "./pieces/card-number";
import useStats from "../hooks/useStats";
import LoadingData from "./pieces/loading-data";
import { getDataFromKey } from "./reports-helpers";

export default function GlobalUsers() {
    const { colors, edition } = useReportsContext()
    const { data, isLoading, isFetching } = useStats(edition)
    const locales = getDataFromKey('subscriptions_locale', data)
  return (
    <Card className={`mb-4 p-3 ${s.bg_hover}`}>
      <Card.Body>
        <TitleDivisor className="mb-3">Usuários</TitleDivisor>
        {(isFetching || isLoading) && <LoadingData />}
        {data && <>
        <div className="row">
            <div className="col-auto mb-4 mb-md-0">
                <CardNumber label="total de usuários" bg="secondary">
                    {getDataFromKey('users_total', data)}
                </CardNumber>
            </div>
            <div className="col-auto mb-4 mb-md-0">
                <CardNumber label="inscritos" bg="primary">
                {getDataFromKey('users_subscribers', data)}
                </CardNumber>
            </div>
            <div className="col-auto mb-4 mb-md-0">
                <CardNumber label="pareceristas" bg="info">
                    {getDataFromKey('users_colaborators', data)}
                </CardNumber>
            </div>
            <div className="col-auto">
                <div className="d-flex align-items-center" style={{gap: 10}}>
                <PieChart width={150} height={150}>
                <Pie data={locales} dataKey="value" nameKey="name" outerRadius={'100%'} fill="#8884d8" labelLine={false} label={CenteredLabel}>{
                    locales.map((entry, i) => {
                        return <Cell key={i} fill={colors[i]} />;
                    })
                }</Pie>
                </PieChart>
                <div className="d-flex flex-column" style={{gap: 5}}>
                    {locales.map((entry, i) => {
                        return <div className={s.legend}>
                            <div className={s.legend_color} style={{backgroundColor: colors[i]}}></div>
                            <div className={s.legend_label}>{entry.name}</div>
                        </div>;
                    })}
                </div>
                </div>
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
          "name": "Português",
          "value": 400
        },
        {
          "name": "Inglês",
          "value": 300
        },
        {
          "name": "Espanhol",
          "value": 90
        },
      ];
}