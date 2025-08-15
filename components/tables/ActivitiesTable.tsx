import React, { useMemo } from "react";
import { useTable, useFilters, Column, useGlobalFilter, HeaderGroup } from "react-table";
import moment from "moment";
import { ActivitySchema } from "../../src/types/activity.type";
import { filter } from 'lodash';
import Link from "next/link";
import { useRouter } from "next/router";

function dataPatch(rows: ActivitySchema[]) {
    if(!rows || !Array.isArray(rows) || rows.length === 0) {
        return [];
    }
  return rows.map((row) => ({
    ...row,
    start_at: moment(row.start_at).format("DD/MM/YYYY HH:mm"),
    start_day: moment(row.start_at).format("DD/MM/YYYY"),
    start_time: moment(row.start_at).format("HH:mm"),
    end_at: moment(row.end_at).format("DD/MM/YYYY HH:mm"),
  }));

}


function ActivitiesTable({ data }) {
    const { query: {edition}} = useRouter()
    const patchedData = useMemo(() => dataPatch(data), [data]);
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        // Filter: DefaultColumnFilter,
      },
      {
        Header: "Data",
        accessor: "start_day",
      },
      {
        Header: "Hora",
        accessor: "start_time",
      },
      {
        Header: "Título (PT)",
        accessor: "title_pt",
        Cell: ({ row }) => <Link href={`/adm/checkin/activity/${row.original.id}?edition=${edition}`} passHref><a>{row.original.title_pt}</a></Link>
      },
      {
        Header: "Ocupação",
        accessor: "occupation",
        defaultCanFilter: false
      },
      {
        Header: "CheckIn",
        accessor: "checkedin",
      },
    ],
    []
  );

  const defaultColumn: any = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: patchedData,
        defaultColumn,
        // autoResetFilters: false, // Adicionado para evitar reset automático dos filtros
      },
      useFilters,
    //   useGlobalFilter
    );

  return (
    <table className="table table-striped table-bordered table-hover table-sm" {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps()}>
                {column.render("Header")}
                {column?.canFilter ? column.render("Filter") : null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function DefaultColumnFilter({ column: { filterValue, setFilter } }) {
  return (
    <input
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value || undefined)}
      placeholder="Filtrar..."
      className="form-control form-control-sm"
    />
  );
}



export default ActivitiesTable;
