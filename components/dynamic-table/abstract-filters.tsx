import React, {PropsWithChildren, ReactElement, useCallback, useEffect, useMemo, useState} from "react";
import {TableInstance} from "react-table";
import Curtain from "../ui/curtain";
import useEvent from "../hooks/useEvent";
import useTrans from "../hooks/useTrans";
import {useRouter} from "next/router";
import {MapRoles} from "../../src/resources/user";
import {OrderStatuses} from "../../src/resources/order";
import useEvaluators from "../hooks/useEvaluators";
import Icon from "../ui/ionicon";
import useSettings from "../hooks/useSettings";
import Edition from '../../src/resources/edition';


export function getEvaluationsFilterableFields() {
  const router = useRouter()
  const t = useTrans()
  const {data: event, currentEdition: edition} = useSettings(router.query.edition ? String(router.query.edition) : undefined)
  const {data: evaluators, isLoading, error} = useEvaluators({enabled: !!event})

  const lang = router.locale
  if (!event || isLoading) return null

  const users = evaluators.map(user => {
    return {value: user.databaseId, label: user.name}
  })
  const statuses = edition?.abstract?.statuses.map(s => {
    return {value: String(t(`status.${s}`)), label: t(`status.${s}`)}
  })

  return [
    {id: 'evaluator_id', label: 'Avaliador', options: users},
    {id: 'status_pt', label: 'Status', options: statuses},
  ]
}


export function getAbstractFilterableFields() {
  const router = useRouter()
  const t = useTrans()
  const {data: event, currentEdition: edition} = useSettings(router.query?.edition ? String(router.query.edition) : undefined)
  const lang = router.locale
  if (!event) return null

  const topics = edition?.abstract?.topics.map(top => {
    return {value: top[lang], label: top[lang]}
  })
  const modalities = edition?.abstract?.modalities.map(mod => {
    return {value: mod.id, label: mod[lang]}
  })
  const statuses = edition?.abstract?.statuses.map(s => {
    return {value: String(t(`status.${s}`)), label: t(`status.${s}`)}
  })

  return [
    {id: 'title', label: 'Título', options: null},
    {id: 'topic', label: 'Tópico', options: topics},
    {id: 'modality', label: 'Modalidade', options: modalities},
    {id: 'status_pt', label: 'Status', options: statuses},
  ]
}

export function getOrderFilterableFields() {
  // const router = useRouter()
  const t = useTrans()


  const statuses = OrderStatuses.map(s => {
    return {value: s, label: t(`status.${s.toLowerCase()}`)}
  })
  const pcdOptions = [
    {value: 'Sim', label: 'Sim'},
    {value: 'Não', label: 'Não'},
  ]

  return [
    // {id: 'customer_name', label: 'Participante', options: null},
    // {id: 'customer_email', label: 'E-mail', options: null},
    {id: 'status_woo', label: 'Status', options: statuses},
    {id: 'is_pdc', label: 'PcD', options: pcdOptions},
    {id: 'is_affirmative_action', label: 'Ações Afirmativas', options: pcdOptions},
  ]
}


export function getUSerFilterableFields() {

  const rolesOpts = MapRoles.filter(role => role.name !== 'administrator').map(role => ({value: role.label, label: role.label}))
  const locales = [
    {value: 'BR', label: 'Portugues'},
    {value: 'US', label: 'Inglês'},
    {value: 'ES', label: 'Espanhol'},
  ]
  const yesNo = [
    {value: true, label: 'Sim'},
    {value: false, label: 'Não'},
  ]
  return [
    {id: 'name', label: 'Nome', options: null},
    {id: 'email', label: 'E-mail', options: null},
    {id: 'cellphone', label: 'Telefone', options: null},
    {id: 'rolesString', label: 'Perfil', options: rolesOpts},
    {id: 'locale', label: 'Idioma', options: locales},
    {id: 'aa', label: 'Ação Afir.', options: yesNo},
  ]
}

type AbstractFilters<T extends object> = {
  instance: TableInstance<T>
  filterableFields: { id: string; label: string; options: null | { value: string; label: string }[] }[]
  // onAdd?: TableMouseEventHandler
  // onDelete?: TableMouseEventHandler
  // onEdit?: TableMouseEventHandler
}
export default function AbstractFilters<T extends object>({filterableFields, instance}: PropsWithChildren<AbstractFilters<T>> & any): ReactElement | null {

  const router = useRouter()
  const t = useTrans()
  const {columns, allColumns, setAllFilters, setGlobalFilter, state: {globalFilter, filters}} = instance
  const [filterOpen, setFilterOpen] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [globalState, setGlobalState] = useState<'' | 'focused'>('')
  const {data: event, currentEdition: edition} = useSettings(router.query?.edition ? String(router.query.edition) : undefined)
  const lang = router.locale

  useMemo(() => {
    if (filters && filters.length > 0) setIsFiltering(true)
  }, [filters]);

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
    let filters = filterableFields.map(field => ({id: field.id, value: e.target.elements[field.id].value || undefined}))

    setAllFilters(filters)

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
            {filterableFields
            && filterableFields.map(field => {
              return <div className="ss-group" key={field.id}>
                <label htmlFor={`ss-filter_${field.id}`}>{field.label}</label>
                {field.options
                  ? <select id={`ss-filter_${field.id}`} name={field.id} className="form-control">
                    <option value=""></option>
                    {field.options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
                  </select>
                  : <input id={`ss-filter_${field.id}`} name={field.id} type="text" className="form-control"/>}
              </div>
            })}
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
