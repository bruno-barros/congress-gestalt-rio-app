import React, {FormEvent, PropsWithChildren, ReactElement, useCallback, useEffect, useState} from "react";
import {TableInstance} from "react-table";
import {Icon} from "@brunobarros/react-components";
import Curtain from "../ui/curtain";
import {Status} from "../abstract/abstract.d";
import useEvent from "../hooks/useEvent";
import useTrans from "../hooks/useTrans";
import {useRouter} from "next/router";

type AbstractFilters<T extends object> = {
  instance: TableInstance<T>
  // onAdd?: TableMouseEventHandler
  // onDelete?: TableMouseEventHandler
  // onEdit?: TableMouseEventHandler
}
export default function AbstractFilters<T extends object>({instance}: PropsWithChildren<AbstractFilters<T>> & any): ReactElement | null {

  const router = useRouter()
  const t = useTrans()
  const {columns, allColumns, setAllFilters, setGlobalFilter, state: {globalFilter, filters}} = instance
  const [anchorEl, setAnchorEl] = useState<Element | undefined>(undefined)
  const [filterOpen, setFilterOpen] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [globalState, setGlobalState] = useState<'' | 'focused'>('')
  const {data: event} = useEvent()
  let edition = event && event.currentEdition()
  const editionId = String(router.query.edition) || edition?.id
  if (editionId !== edition.id) edition = event.getEdition(editionId)
  const lang = router.locale
  // const [filterValue, setFilterValue] = useState(globalFilter)

  useEffect(() => {
    if (globalFilter) setIsFiltering(true)
  }, [globalFilter])


  useEffect(() => {
    document.body.addEventListener('click', handleOutClick)
    return () => {
      document.body.removeEventListener('click', handleOutClick)
    }
  }, [isFiltering])

  function handleOutClick(e) {
    const inside = document.getElementById('super-search').contains(e.target)
    if (!inside) {
      setFilterOpen(false)
    }
  }

  function handleGlobalSearch(e) {
    e.preventDefault()
    const term = e.target.elements['global-search'].value
    setGlobalFilter(term || undefined)
  }

  function handleSubmitFilters(e) {
    e.preventDefault()
    setAllFilters([
      {id: 'title', value: e.target.elements['title'].value || undefined},
      {id: 'status_pt', value: e.target.elements['status_pt'].value || undefined},
      {id: 'topic', value: e.target.elements['topic'].value || undefined},
    ])
    setIsFiltering(true)
    setFilterOpen(false)
  }

  function globalFocus() {
    setGlobalState('focused')
  }

  function globalBlur() {
    setGlobalState('')
  }

  const reset = useCallback(() => {
    let input: HTMLInputElement = document.querySelector('input[name="global-search"]')
    if (input) input.value = ''
    let form: any = document.getElementById("ss-filters-form")
    if (form) form.reset()
    setGlobalFilter('')
    setGlobalState('')
    setIsFiltering(false)
    setAllFilters([])
  }, [globalFilter, filters])

  function handleFiltersDropdown() {
    setFilterOpen(!filterOpen)
  }

  return (<div id="super-search" className="super-search">
    <div className={`ss-global ${['focused', 'filtering'].indexOf(globalState) !== -1 ? 'focused' : ''}`}>
      <form onSubmit={handleGlobalSearch}>
        <button type="submit" className="btn btn-go"><Icon name={`search-outline`}/></button>
        <input type="text" name="global-search" className="form-control" placeholder="Pesquisar..."

               onFocus={globalFocus}
               onBlur={globalBlur}
        />
        <button type="button" className="btn btn-reset" disabled={!isFiltering} onClick={reset}><Icon
          name={`close-outline`}/></button>
        <button type="button" className="btn btn-advanced" onClick={handleFiltersDropdown}><Icon
          name={`chevron-down-outline`}/></button>
      </form>
    </div>
    <div className="ss-filters">
      <Curtain isOpened={filterOpen} duration={.5}>
        <div className="p-3">
          <form id="ss-filters-form" onSubmit={handleSubmitFilters}>
            <div className="ss-group">
              <label htmlFor="ss-filter_title">Título</label>
              <input id="ss-filter_title" name="title" type="text" className="form-control"/>
            </div>
            <div className="ss-group">
              <label htmlFor="ss-filter_topic">Tópico</label>
              <select id="ss-filter_topic" name="topic" className="form-control">
                <option value=""></option>
                {edition?.abstract?.topics.map(top => (<option value={top[lang]}>{top[lang]}</option>))}
              </select>
            </div>
            <div className="ss-group">
              <label htmlFor="ss-filter_status">Status</label>
              <select id="ss-filter_status" name="status_pt" className="form-control">
                <option value=""></option>
                {edition?.abstract?.statuses.map(s => (<option value={String(t(`status.${s}`))}>{t(`status.${s}`)}</option>))}
              </select>
            </div>
            <div className="ss-group mb-0">
              <button onClick={reset} type="button" className="btn btn-link ml-auto">limpar filtros</button>
              <button type="submit" className="btn btn-primary">Pesquisar</button>
            </div>
          </form>
        </div>
      </Curtain>
    </div>
  </div>)
}


export function Text({column: {id, index, filterValue, setFilter, render, parent}}: any) {

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
      name={id} value={value} type="text" className="form-control"
      autoFocus={index === 0 && firstIndex}
      onChange={handleChange}
      onBlur={(e) => {
        setFilter(e.target.value || undefined)
      }}
    />
  </>)
}
