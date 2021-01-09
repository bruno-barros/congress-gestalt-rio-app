import ButtonGroup from "react-bootstrap/cjs/ButtonGroup";
import Button from "react-bootstrap/cjs/Button";
import DropdownButton from "react-bootstrap/cjs/DropdownButton";
import Dropdown from "react-bootstrap/cjs/Dropdown";
import {PropsWithChildren, ReactElement, useState} from "react";
import {TableInstance} from "react-table";
import {useRouter} from "next/router";
import useTrans from "../hooks/useTrans";
import SetEvaluatorsModal from "../abstract/set-evaluators-modal";


type GroupActions<T extends object> = {
  instance: TableInstance<T>
}

export function AbstractsGroupActions<T extends object>({instance}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {

  const {selectedFlatRows, state: {selectedRowIds}} = instance
  const selected = selectedFlatRows.map(row => row.original)
  const selectedCount = selected.length
  const [activeModal, setActiveModal] = useState<'designar'|string>('')


  function openModal(id:string){
    setActiveModal(id)
  }
  function exportToExcel(e){
    e.preventDefault()
    console.log({selected});
  }
  // console.log(selectedCount);


  return (<>
    <DropdownButton id="dynamic-table-dropdown-actions" title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ''}`} variant="outline-secondary">
      <Dropdown.Item  onClick={exportToExcel} disabled={selectedCount === 0}>Exportar</Dropdown.Item>
      <Dropdown.Item  onClick={()=>openModal('designar')} disabled={selectedCount === 0}>Designar avaliador</Dropdown.Item>
      <Dropdown.Item  onClick={exportToExcel} disabled={selectedCount === 0}>Mudar status</Dropdown.Item>
      <Dropdown.Item className="text-danger" onClick={exportToExcel} disabled={selectedCount === 0}>Apagar</Dropdown.Item>
    </DropdownButton>
    <SetEvaluatorsModal abstract_ids={selected?.map(abs => abs.databaseId)} show={activeModal==='designar'} onDismiss={()=>setActiveModal('')}/>
  </>)
}


export function EvaluationsGroupActions<T extends object>({instance}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {

  const {selectedFlatRows, state: {selectedRowIds}} = instance
  const selected = selectedFlatRows.map(row => row.original)
  const selectedCount = selected.length


  function exportToExcel(e){
    e.preventDefault()
    console.log({selected});
  }
  // console.log(selectedCount);


  return (<DropdownButton id="dynamic-table-dropdown-actions" title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ''}`} variant="outline-secondary">
    <Dropdown.Item  onClick={exportToExcel} disabled={selectedCount === 0}>Mudar status</Dropdown.Item>
  </DropdownButton>)
}



export function UsersGroupActions<T extends object>({instance}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {

  const {selectedFlatRows, state: {selectedRowIds}} = instance
  const selected = selectedFlatRows.map(row => row.original)
  const selectedCount = selected.length


  function exportToExcel(e){
    e.preventDefault()
    console.log({selected});
  }
  // console.log(selectedCount);


  return (<DropdownButton id="dynamic-table-dropdown-actions" title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ''}`} variant="outline-secondary">
    <Dropdown.Item  onClick={exportToExcel} disabled={selectedCount === 0}>Exportar</Dropdown.Item>
    <Dropdown.Item  onClick={exportToExcel} disabled={selectedCount === 0}>Atribuir perfil</Dropdown.Item>
  </DropdownButton>)
}
