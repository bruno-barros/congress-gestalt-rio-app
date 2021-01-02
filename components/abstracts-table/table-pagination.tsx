import React, {PropsWithChildren, ReactElement, useCallback} from "react";
import {TableInstance} from "react-table";


export default function TablePagination<T extends object>({instance}: PropsWithChildren<{ instance: TableInstance<T> }> & any): ReactElement | null {

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
      <div className="table-pagination p-3">
        <div className="btn-group">
          <button className="btn btn-outline-secondary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          {' '}
          <button className="btn btn-outline-secondary" onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          {' '}
          <button className="btn btn-outline-secondary" onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          {' '}
          <button className="btn btn-outline-secondary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
        {' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{width: '100px'}}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <code>{JSON.stringify({
        pageIndex, pageSize, pageCount, pageOptions, rowCount, canPreviousPage,
        canNextPage
      }, null, 2)}</code>
    </div>
  ) : null
}
