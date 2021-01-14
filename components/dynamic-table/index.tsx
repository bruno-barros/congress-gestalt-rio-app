import React, {CSSProperties, MouseEventHandler, PropsWithChildren, ReactElement, useCallback, useEffect} from 'react'
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
  useGlobalFilter,
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
import {RenderCell} from "./cells";
import AbstractFilters, {
  getAbstractFilterableFields,
  getOrderFilterableFields,
  getUSerFilterableFields,
  Text
} from "./abstract-filters";
import {
  AbstractsGroupActions,
  EvaluationsGroupActions,
  SubscriptionsGroupActions,
  UsersGroupActions
} from "./abstracts-group-actions";
import EvaluationStatus from "./evaluation-status";

// @ts-ignore
const IndeterminateCheckbox = React.forwardRef(({indeterminate, ...rest}, ref): any => {
    const defaultRef = React.useRef(null)
    const resolvedRef: any = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

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
      Header: ({getToggleAllRowsSelectedProps, getToggleAllPageRowsSelectedProps}: HeaderProps<any> & any) => (<>
        <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
      </>),
      // The cell can use the individual row's getToggleRowSelectedProps method
      // to the render a checkbox
      Cell: ({row}: CellProps<any> & any) => <>
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        </>,
    },
    ...columns,
  ])
}

const hooks = [
  useColumnOrder,
  useFilters,
  useGlobalFilter,
  // useGroupBy,
  useSortBy,
  useExpanded,
  // useFlexLayout,
  usePagination,
  useResizeColumns,
  useRowSelect,
  selectionHook,
]

const filterTypes: Record<string, any> = {
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

function DefaultColumnFilter<T extends object>(props: FilterProps<T> & any) {
// {column: {id, index, filterValue, setFilter, render, parent}
  return <Text {...props}/>
  // const [value, setValue] = React.useState(filterValue || '')
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue(event.target.value)
  // }
  // // ensure that reset loads the new value
  // useEffect(() => {
  //   setValue(filterValue || '')
  // }, [filterValue])
  //
  // const firstIndex = !(parent && parent.index)
  //
  // return (<>
  //   <div className="ss-group">
  //     <label htmlFor="">{render('Header')}</label>
  //     <input name={id} value={value} type="text" className="form-control"
  //            autoFocus={index === 0 && firstIndex}
  //            onChange={handleChange}
  //            onBlur={(e) => {
  //              setFilter(e.target.value || undefined)
  //            }}
  //     />
  //   </div>
  // </>)
}

export interface Table<T extends object = {}> extends TableOptions<T> {
  name: string
  hiddenColumns: string[]
  onAdd?: (instance: TableInstance<T>) => MouseEventHandler
  onDelete?: (instance: TableInstance<T>) => MouseEventHandler
  onEdit?: (instance: TableInstance<T>) => MouseEventHandler
  onClick?: (row: Row<T>) => void
}

export function DynamicTable<T extends object>(props: PropsWithChildren<Table<T>> & any) {

  const {name, hiddenColumns, columns, onAdd, onDelete, onEdit, onClick} = props
  const [initialState, setInitialState] = useLocalStorage(`tableState:${name}`, {
    hiddenColumns: hiddenColumns
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


  // @ts-ignore
  const {getTableProps, headerGroups, getTableBodyProps, page, prepareRow, state} = instance

  const debouncedState = useDebounce(state, 1000)
  useEffect(() => {
    const {sortBy, filters, pageSize, columnResizing, hiddenColumns} = debouncedState
    const val = {
      sortBy,
      filters,
      pageSize,
      columnResizing,
      hiddenColumns,
    }
    setInitialState(val)
  }, [setInitialState, debouncedState])

  const filterableFields = useCallback(()=>{
    if(name === 'users') return getUSerFilterableFields()
    if(name === 'subscriptions') return getOrderFilterableFields()
    return getAbstractFilterableFields()
  }, [])

// console.log(debouncedState);
  return (<div className="">
    <div className="abstracts-action-bar border-bottom bg-light px-3 py-1">
      {name === 'evaluations' && <EvaluationsGroupActions instance={instance}/>}
      {name === 'abstracts' && <AbstractsGroupActions instance={instance}/>}
      {name === 'users' && <UsersGroupActions instance={instance}/>}
      {name === 'subscriptions' && <SubscriptionsGroupActions instance={instance}/>}
      <AbstractFilters instance={instance} filterableFields={filterableFields()}/>
      {name === 'evaluations' && <EvaluationStatus instance={instance}/>}
    </div>
    <div className="table-responsive">
      <table {...getTableProps()} className="table dynamic-table table-hover border-bottom" style={{}}>
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
                    <RenderCell cell={cell.render('Cell')}/>
                  </td>
                )
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
    {(!page || page.length === 0) && <div className="alert alert-info mx-3 text-center">Nenhum conteúdo disponível</div>}
    <TablePagination<T> instance={instance}/>
  </div>)
}
