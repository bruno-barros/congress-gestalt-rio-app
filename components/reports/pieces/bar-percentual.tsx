import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useReportsContext from "../reports-context";

interface BarPercentualProps {
  data: { name: string; value: number }[];
  total: number;
  height?: number;
  colors?: string[];
}
export default function BarPercentual(props: BarPercentualProps) {
  const { colors, edition } = useReportsContext();
  const { data, total, height = 200 } = props;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        barSize={200/** max width */}
        barCategoryGap={3}
        margin={{
          top: 20,
          // right: 30,
          // left: 20,
          // bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" style={{fontSize: 12}} />
        <YAxis
          // domain={[0, 100]}
          tickFormatter={(value, i) => {
            const percent = (value / total) * 100;
            // console.log({value, total, percent})
            // return `${value}%`
            return `${percent.toFixed(0)}%`;
          }}
          type="number"
        />
        <Tooltip />
        {/* <Legend /> */}
        <Bar dataKey="value" label={{ position: "top" }}>
          {data.map((entry, i) => {
            return <Cell key={i} fill={colors[i % colors.length]} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
