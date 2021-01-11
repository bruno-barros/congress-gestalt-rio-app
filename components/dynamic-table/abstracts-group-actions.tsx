import DropdownButton from "react-bootstrap/cjs/DropdownButton";
import Dropdown from "react-bootstrap/cjs/Dropdown";
import {PropsWithChildren, ReactElement, useState} from "react";
import {TableInstance} from "react-table";
import SetEvaluatorsModal from "../abstract/set-evaluators-modal";
import {useQueryClient} from "react-query";
import useEvent from "../hooks/useEvent";
import SetStatusModal from "../abstract/set-status-modal";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import DownloadCsv from "../ui/download-csv";


type GroupActions<T extends object> = {
  instance: TableInstance<T>
}

export function AbstractsGroupActions<T extends object>({instance}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {

  const queryClient = useQueryClient()
  const {selectedFlatRows, toggleAllPageRowsSelected, state: {selectedRowIds}} = instance
  const selected = selectedFlatRows.map(row => row.original)
  const selectedCount = selected.length
  const [activeModal, setActiveModal] = useState<'designar' | 'status' | string>('')
  const {data: event} = useEvent()
  const [exportData, setExportData] = useState([])
  const [loading, setLoading] = useState(false)
  const edition = event && event.currentEdition()

  function openModal(id: string) {
    setActiveModal(id)
  }

  function handleExportData(e) {
    e.preventDefault()
    setExportData([])
    setLoading(true)
    WpAbstract.export({
      abstracts: selected.map(row => row.databaseId)
    })
      .then(resp => {
        if (resp.data.success) {
          setExportData(resp.data.data)
          setLoading(false)
        }
      }, err => {
        errorNotification({error: err})
        setLoading(false)
      })

  }

  function refreshAbstracts() {
    queryClient.refetchQueries(['abstracts', edition?.id])
  }


  return (<>
    <DropdownButton id="dynamic-table-dropdown-actions" title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ''}`}
                    variant="outline-secondary">
      <Dropdown.Item disabled={selectedCount === 0} onClick={handleExportData}>Exportar</Dropdown.Item>
      <Dropdown.Item onClick={() => openModal('designar')} disabled={selectedCount === 0}>Designar
        avaliador</Dropdown.Item>
      <Dropdown.Item onClick={() => openModal('status')} disabled={selectedCount === 0}>Mudar status</Dropdown.Item>
      <Dropdown.Item className="text-danger" onClick={() => {
      }}
                     disabled={selectedCount === 0}>Apagar</Dropdown.Item>
    </DropdownButton>
    <DownloadCsv data={exportData} fileBaseName={`trabalhos_${edition.id}`} loading={loading}/>
    <SetEvaluatorsModal
      abstract_ids={selected?.map(abs => abs.databaseId)} show={activeModal === 'designar'}
      onDismiss={() => {
        setActiveModal('')
      }} onUpdate={() => {
      toggleAllPageRowsSelected(false)
      refreshAbstracts()
    }}/>
    <SetStatusModal
      abstract_ids={selected?.map(abs => abs.databaseId)} show={activeModal === 'status'}
      onDismiss={() => {
        setActiveModal('')
      }}
      onUpdate={() => {
        toggleAllPageRowsSelected(false)
        refreshAbstracts()
      }}/>
  </>)
}


export function EvaluationsGroupActions<T extends object>({instance}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {

  const {selectedFlatRows, state: {selectedRowIds}} = instance
  const selected = selectedFlatRows.map(row => row.original)
  const selectedCount = selected.length


  function exportToExcel(e) {
    e.preventDefault()
    console.log({selected});
  }

  // console.log(selectedCount);


  return (
    <DropdownButton id="dynamic-table-dropdown-actions" title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ''}`}
                    variant="outline-secondary">
      <Dropdown.Item onClick={exportToExcel} disabled={selectedCount === 0}>Mudar status</Dropdown.Item>
    </DropdownButton>)
}


export function UsersGroupActions<T extends object>({instance}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {

  const {selectedFlatRows, state: {selectedRowIds}} = instance
  const selected = selectedFlatRows.map(row => row.original)
  const selectedCount = selected.length


  function exportToExcel(e) {
    e.preventDefault()
    console.log({selected});
  }

  // console.log(selectedCount);


  return (
    <DropdownButton id="dynamic-table-dropdown-actions" title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ''}`}
                    variant="outline-secondary">
      <Dropdown.Item onClick={exportToExcel} disabled={selectedCount === 0}>Exportar</Dropdown.Item>
      <Dropdown.Item onClick={exportToExcel} disabled={selectedCount === 0}>Atribuir perfil</Dropdown.Item>
    </DropdownButton>)
}
