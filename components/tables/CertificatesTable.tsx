import React, { useMemo, useState } from "react";
import {
  useTable,
  useFilters,
  Column,
  useGlobalFilter,
  HeaderGroup,
} from "react-table";
import moment from "moment";
import { filter } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { CertificatesModelSchema } from "../../src/types/certificates";
import LoadingButton from "../ui/loading-button";
import WpCertificate from "../../src/http/wp-certificate";
import { QueryClient, useQueryClient } from "react-query";

function dataPatch(rows: CertificatesModelSchema[]) {
  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return [];
  }
  return rows.map((row) => ({
    ...row,
    created_at: moment(row.created_at).format("DD/MM/YYYY HH:mm"),
  }));
}

function CertificatesTable({ data }) {
  const {
    query: { edition },
  } = useRouter();
  const queryClient = useQueryClient();
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
        accessor: "created_at",
      },
      {
        Header: "Tipo",
        accessor: "type",
      },
      {
        Header: "Nome",
        accessor: "user.display_name",
        // Cell: ({ row }) => (
        //   <Link
        //     href={`/adm/checkin/activity/${row.original.id}?edition=${edition}`}
        //     passHref
        //   >
        //     <a>{row.original.title_pt}</a>
        //   </Link>
        // ),
      },
      {
        Header: "Certificado",
        accessor: "url",
        defaultCanFilter: false,
         Cell: ({ row }) => (
          <div className="d-flex gap-2 align-items-center">
          {row.original.url &&
             (<Link href={row.original.url} passHref><a target="_blank" className="btn btn-sm btn-primary">Ver</a></Link>) }
           <GenerateCertificate cert={row.original} />
          </div>
        ),
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
      useFilters
      //   useGlobalFilter
    );

  return (
    <table
      className="table table-striped table-bordered table-hover table-sm"
      {...getTableProps()}
    >
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

interface GenerateCertificateProps {
  cert?: CertificatesModelSchema;
}
function GenerateCertificate(props: GenerateCertificateProps){
    const { cert} = props;
    const [loading, setLoading] = useState(false);
    const queryClient = useQueryClient();

    async function handleRegenerate(){
        setLoading(true);
        const axios = await WpCertificate.generate({
            type: cert.type,
            user_id: cert.user_id,
            edition: cert.edition,
        })
        const resp = axios.data;
        queryClient.invalidateQueries(["adm-certificates"]);
        setLoading(false);
    }

    return <>
    <LoadingButton loading={loading} size="sm" variant="outline-secondary" onClick={handleRegenerate}>Gerar</LoadingButton>
    </>
}

export default CertificatesTable;
