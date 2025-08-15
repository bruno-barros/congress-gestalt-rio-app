import React, { useMemo } from "react";
import { Column, Row, useFilters, useTable } from "react-table";
import { ActivityUserSchema } from "../../src/types/activity.type";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import CancelCheckinModal from "../activities/checkin/cancel-checkin-modal";
import DoCheckinModal from "../activities/checkin/do-checkin-modal";
function dataPatch(rows: any[]): ActivityUserSchema[] {
    if(!rows || !Array.isArray(rows) || rows.length === 0) {
        return [];
    }
  return rows.map((row) => ({
    ...row,
    created_at: new Date(row.created_at).toLocaleString(),
    checkin_at: row.checkin_at ? new Date(row.checkin_at).toLocaleString() : null,
  }));

}
function SubscribersTable({ data, onUpdate }) {

     const patchedData = useMemo(() => dataPatch(data), [data]);
  const columns:Array<Column<any>> = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
        disableFilters: true,
      },
      {
        Header: "Nome",
        accessor: "user.display_name",
      },
      {
        Header: "Email",
        accessor: "user.user_email",
      },
      {
        Header: "Data de Inscrição",
        accessor: "created_at",
      },
      {
        Header: "Data de CheckIn",
        accessor: "checkin_at",
      },
      {
        Header: "Ações",
        accessor: "actions",
        disableFilters: true,
        Cell: ({ row }: { row: Row<ActivityUserSchema> }) => {
          const checkin = !!row.original.checkin_at;
          return (
            <ButtonGroup size="sm">
              {checkin ? (
                <CancelCheckinModal activityId={Number(row.original.id)} callable={<Button variant="danger">Cancelar</Button>} onUpdate={onUpdate}/>                
              ) : (
                <DoCheckinModal activityId={Number(row.original.id)} callable={<Button variant="success">Fazer Checkin</Button>} onUpdate={onUpdate} />
              )}
            </ButtonGroup>
          );
        },
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
    useTable<any>({ columns, data: patchedData, defaultColumn }, useFilters);

  return (
    <table {...getTableProps()} className="table table-striped table-bordered">
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
        {rows.map((row: Row<ActivityUserSchema>) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className={row.original?.checkin_at ? 'bg-light-success' : ''}>
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

export default SubscribersTable;

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
