import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts";

export default function BarPage(){
    
    // Dados baseados na análise manual dos artigos
const data = [
    { year: 2014, publications: 1 },
    { year: 2015, publications: 1 },
    { year: 2016, publications: 5 },
    { year: 2017, publications: 8 },
    { year: 2018, publications: 5 },
    { year: 2019, publications: 6 },
    { year: 2020, publications: 5 },
    { year: 2021, publications: 7 },
    { year: 2022, publications: 6 },
    { year: 2023, publications: 15 },
    { year: 2024, publications: 33 }
  ];
  

    return (
      <div className="w-full h-[400px] p-4">
        <h2 className="text-xl font-bold mb-4 text-center">Number of Publications about Baricitinib by Year</h2>
        <BarChart
          width={800}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="publications" fill="#8884d8" name="Number of Publications" />
        </BarChart>
      </div>
    );

  
}