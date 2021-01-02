import React, {CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useEffect} from 'react'
import {
  Cell,
  CellProps,
  FilterProps, FilterTypes,
  HeaderGroup,
  HeaderProps,
  Hooks,
  Meta,
  Row,
  TableInstance,
  TableOptions,
  useColumnOrder,
  useExpanded,
  useFilters,
  useFlexLayout,
  useGroupBy,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table'
import {useLocalStorage} from "../hooks/useLocalStorage";
import {fuzzyTextFilter, numericTextFilter} from "./filters";
import {camelToWords} from "../../src/resources/objects";
import {useDebounce} from "../hooks/useDebounce";
import SortedLabel from "./sorted-label";
import TablePagination from "./table-pagination";


const selectionHook = (hooks: Hooks<any>) => {
  hooks.allColumns.push((columns) => [
    // Let's make a column for selection
    {
      id: '_selector',
      disableResizing: true,
      disableGroupBy: true,
      minWidth: 45,
      width: 45,
      maxWidth: 45,
      // The header can use the table's getToggleAllRowsSelectedProps method
      // to render a checkbox
      Header: ({getToggleAllRowsSelectedProps}: HeaderProps<any> & any) => (
        <input type="checkbox" {...getToggleAllRowsSelectedProps()} className=""/>
      ),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({row}: CellProps<any> & any) => <input type="checkbox" {...row.getToggleRowSelectedProps()} className=""/>,
    },
    ...columns,
  ])
}

const hooks = [
  useColumnOrder,
  useFilters,
  useGroupBy,
  useSortBy,
  useExpanded,
  // useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  selectionHook,
]

const filterTypes: FilterTypes<any> = {
  fuzzyText: fuzzyTextFilter,
  numeric: numericTextFilter,
}
const DefaultHeader: React.FC<HeaderProps<any>> = ({column}) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
)
const defaultColumn = {
  Filter: DefaultColumnFilter,
  // Cell: TooltipCell,
  Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 30, // minWidth is only used as a limit for resizing
  width: 150, // width is used for both the flex-basis and flex-grow
  maxWidth: 200, // maxWidth is only used as a limit for resizing
}

function DefaultColumnFilter<T extends object>(
  {
    column: {id, index, filterValue, setFilter, render, parent},
  }: FilterProps<T> & any) {
  const [value, setValue] = React.useState(filterValue || '')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '')
  }, [filterValue])

  const firstIndex = !(parent && parent.index)

  return (<>
    <label htmlFor="">{render('Header')}</label>
    <input
      name={id}
      // label={render('Header')}
      value={value}
      autoFocus={index === 0 && firstIndex}

      onChange={handleChange}
      onBlur={(e) => {
        setFilter(e.target.value || undefined)
      }}
    />
  </>)
}

export interface Table<T extends object = {}> extends TableOptions<T> {
  name: string
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onClick?: (row: Row<T>) => void
}

export function AbstractsTable<T extends object>(props: PropsWithChildren<Table<T>>) {

  const {name, columns, onAdd, onDelete, onEdit, onClick} = props
  const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {
    pageIndex: 1
  })
  const instance = useTable<T>(
    {
      ...props,
      columns,
      filterTypes,
      defaultColumn,
      initialState,
    },
    ...hooks
  )

  const {getTableProps, headerGroups, getTableBodyProps, page, prepareRow, state} = instance
  const debouncedState = useDebounce(state, 500)

  return (<div className="">
    <div className="abstracts-action-bar border-bottom bg-light p-3">
      ACOES
    </div>
    <div className="table-responsive">
      <table {...getTableProps()} className="table dynamic-table -table-bordered" style={{}}>
        <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{}}>
                {column.canSort
                  ? <SortedLabel
                    active={column.isSorted}
                    direction={column.isSortedDesc ? 'desc' : 'asc'}
                    {...column.getSortByToggleProps()}
                  >{column.render('Header')}</SortedLabel>
                  : <div>{column.render('Header')}</div>}

              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map(row => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return (
                  <td {...cell.getCellProps()} style={{}}>
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
    <TablePagination<T> instance={instance}/>
  </div>)
}
