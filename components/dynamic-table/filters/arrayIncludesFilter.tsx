import { FilterValue, IdType, Row } from 'react-table'

export function arrayIncludesFilter<T extends object>(rows: Array<Row<T>>, ids: Array<IdType<T>>, filterValue: FilterValue) {
  return rows.filter((row) =>
    ids.some((id) => Array.isArray(row.values[id]) && row.values[id].includes(filterValue))
  )
}

// Let the table remove the filter if the value is empty
arrayIncludesFilter.autoRemove = (val: any) => !val
