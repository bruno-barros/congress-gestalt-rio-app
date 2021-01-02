import MainLayout from "../../components/layout";
import {
  Column,
  ColumnInstance,
  UseExpandedOptions,
  UsePaginationOptions,
  useSortBy,
  UseSortByHooks, UseSortByOptions,
  useTable
} from "react-table";
import {useCallback, useMemo} from "react";
import demo from '../../src/resources/demo'
import {AbstractsTable} from "../../components/abstracts-table";

const AdmAbstracts = () => {

  const columns = useMemo(() => {
    const row = Object.keys(demo[0])
    return row.map(field => {
      return {
        Header: field.toUpperCase(),
        accessor: field.toLowerCase(),
      }
    })
  }, [])
  const data = useMemo(() => {
    const keys = Object.keys(demo[0])
    return demo.map((row) => {
      let line = {}
      keys.map(k => {
        line[k.toLowerCase()] = row[k]
      })

      return line
    })
  }, [])
  // console.log(data);
  // console.log(columns);


  const dummy = useCallback(() => () => null, [])
  return (<MainLayout fullWidth>
    <AbstractsTable<any>
      name={`abstracts`}
      columns={columns}
      data={data}
      onAdd={dummy}
      onEdit={dummy}
      onDelete={dummy}/>
  </MainLayout>)
}

export default AdmAbstracts
