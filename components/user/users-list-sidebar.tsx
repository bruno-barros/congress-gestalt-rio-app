import useAllUsers from "../hooks/useAllUsers";
import {Loading} from "@brunobarros/react-components";
import {Icon} from "@brunobarros/react-components";
import {useRouter} from "next/router";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function UsersListSidebar() {

  const router = useRouter()
  const {data: users, isLoading} = useAllUsers()
  const [filtered, setFiltered] = useState(users)
  const [filterVar, setFilterVar] = useState('')

  useEffect(()=>{
    if(!filtered) setFiltered(users)
  }, [users, filtered])

  function handleFilter(e) {
    e.preventDefault()
    setFilterVar(e.target.elements['filterVar'].value)
    doFilter(e.target.elements['filterVar'].value)
  }

  function doFilter(string: string){
    if(string.length <= 1) setFiltered(users)
    else setFiltered(users.filter(u => u.name.toLowerCase().indexOf(string.toLowerCase()) !== -1))
  }

  if(isLoading) return <Loading/>

  return (<div className="">
    <form onSubmit={handleFilter} className="sticky-top">
      <div className="form-group m-2">
        {/*<Text name="filter_user" label="Filtrar usuários" floatLabel/>*/}
        <div className="input-group input-group-lg">
          <div className="input-group-prepend">
            <button className="btn btn-light border" style={{lineHeight: 0}}>
              <Icon name={`search-outline`} style={{fontSize: 30}}/>
            </button>
          </div>
          <input name="filterVar" type="text" className="form-control" placeholder="Pesquisar usuário..."/>
        </div>
      </div>
    </form>


    <div className="list-group m-2">
      {filtered && filtered.map(u => (<>
        <Link href={`/users/${u.databaseId}`} passHref key={u.databaseId}>
          <a className={`py-1 list-group-item list-group-item-action ${parseInt(String(router.query.id)) === u.databaseId && 'active'}`}>
            {u.name}
          </a>
        </Link>
      </>))}

    </div>

  </div>)
}
