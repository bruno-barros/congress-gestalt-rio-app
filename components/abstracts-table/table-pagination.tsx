import React, {PropsWithChildren, ReactElement, useCallback} from "react";
import {TableInstance} from "react-table";
import useTrans from "../hooks/useTrans";


export default function TablePagination<T extends object>({instance}: PropsWithChildren<{ instance: TableInstance<T> }> & any): ReactElement | null {

  const t = useTrans()
  const {
    state: {pageIndex, pageSize, rowCount = instance.rows.length},
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount
  } = instance


  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {
      if (newPage === pageIndex + 1) {
        nextPage()
      } else if (newPage === pageIndex - 1) {
        previousPage()
      } else {
        gotoPage(newPage)
      }
    },
    [gotoPage, nextPage, pageIndex, previousPage]
  )

  const onChangeRowsPerPage = useCallback(
    (e) => {
      setPageSize(Number(e.target.value))
    },
    [setPageSize]
  )

  return rowCount ? (
    <div className="">
      <div className="table-pagination pr-3 pb-3 pl-3 d-flex flex-wrap align-items-center">
        <div className="btn-group btn-group-sm">
          <button className="btn btn-outline-secondary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
        <div className="mx-3 text-lowercase">
          {t('pagina')}{' '}
          <strong>
            {pageIndex + 1} {t('de')} {pageOptions.length}
          </strong>{' '}
        </div>
        <span>|</span>
        <span className="mx-3 d-flex align-items-center">
          <div className="text-nowrap mr-2 text-lowercase">{t('ir-para')}</div>
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            className="form-control form-control-sm"
            style={{width: 50}}
          />
        </span>
        <div className="d-flex align-items-center">
          <div className="mr-2 text-lowercase">{t('exibir-linhas')}</div>
          <select
            value={pageSize}
            className="form-control form-control-sm d-inline-block"
            style={{width: 55}}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[5, 10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>

      </div>
      {/*<code>{JSON.stringify({*/}
      {/*  pageIndex, pageSize, pageCount, pageOptions, rowCount, canPreviousPage,*/}
      {/*  canNextPage*/}
      {/*}, null, 2)}</code>*/}
    </div>
  ) : null
}
