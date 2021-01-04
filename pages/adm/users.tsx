import {useRouter} from "next/router";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import useEvent from "../../components/hooks/useEvent";
import {useQuery} from "react-query";
import {WpAbstract} from "../../src/http/wp-abstract";
import {errorNotification} from "../../src/resources/responses";
import {useCallback, useMemo} from "react";
import MainLayout from "../../components/layout";
import {DynamicTable} from "../../components/dynamic-table";
import {Loading} from "@brunobarros/react-components";
import WpUser from "../../src/http/wp-user";
import {MapRoles} from "../../src/resources/user";


const AdmUsers = () => {

  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  const {data: users, error, isLoading} = useQuery<any[], any>(['users', 'admin'], queryUsers, {
    enabled: user.canManageAbstracts()
  })

  function queryUsers(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      WpUser.all().then(resp => {
        if (resp.data.data?.users?.nodes) {
          resolve(resp.data.data.users.nodes)
        } else {
          reject([])
          errorNotification({error: resp.data.errors})
        }
      }, err => {
        reject([])
        errorNotification({error: err})
      })
    })
  }

  const columns = useMemo(() => {
    return [
      {
        Header: '#',
        accessor: 'databaseId',
      },{
        Header: 'Nome',
        accessor: 'name',
      },{
        Header: 'E-mail',
        accessor: 'email',
      },{
        Header: 'Telefone',
        accessor: 'cellphone',
      },{
        Header: 'Perfil',
        accessor: 'roles',
      },{
        Header: 'Trabalhos',
        accessor: 'abstracts_count'
      },{
        Header: 'Inscrições',
        accessor: 'subscriptions_count',
      },{
        Header: 'Cadastro em',
        accessor: 'date',
      }
    ]}, [])
  const data = useMemo(() => {
    if(!users || users.length === 0) return []
    return users.map(row => {
      let rolesStr = row?.roles?.nodes?.map(role => role.name).join(',')
      row.date = row.registeredDate
      row.roles = rolesStr?.split(',').map(role => {
        return MapRoles.find(r => role === r.name)?.label
      }).join(',')
      return row
    })
  }, [users])

  const dummy = useCallback(() => () => null, [])

  if (isLoading) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  return (<MainLayout fullWidth>
    <DynamicTable<any>
      name={`users`}
      columns={columns}
      data={data}
      hiddenColumns={[]}
      onAdd={dummy}
      onEdit={dummy}
      onDelete={dummy}/>
  </MainLayout>)
}

export default AdmUsers
