import {useRouter} from "next/router";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {useCallback, useMemo} from "react";
import MainLayout from "../../components/layout";
import {DynamicTable} from "../../components/dynamic-table";
import {Loading} from "@brunobarros/react-components";
import {MapRoles} from "../../src/resources/user";
import useAllUsers from "../../components/hooks/useAllUsers";
import privateRoute from "../../components/hoc/private-route";


const AdmUsers = () => {

  const router = useRouter()
  const t = useTrans()
  const {user} = useCurrentUser()
  const {data: users, isLoading} = useAllUsers()

  const columns = useMemo(() => {
    return [
      {
        Header: '#',
        accessor: 'databaseId',
      }, {
        Header: 'Nome',
        accessor: 'name',
      }, {
        Header: 'E-mail',
        accessor: 'email',
      }, {
        Header: 'Telefone',
        accessor: 'cellphone',
      }, {
        Header: 'Perfil',
        accessor: 'roles',
      }, {
        Header: 'Idioma',
        accessor: 'locale',
      },
      // {
      //   Header: 'Trabalhos',
      //   accessor: 'abstracts_count'
      // },{
      //   Header: 'Inscrições',
      //   accessor: 'subscriptions_count',
      // },
      {
        Header: 'Cadastro em',
        accessor: 'date',
      }
    ]
  }, [])
  const data = useMemo(() => {
    if (!users || users.length === 0) return []
    return users.map(row => {
      if (row?.roles?.nodes) {
        let rolesStr = row?.roles?.nodes?.map(role => role.name).join(',')
        row.roles = rolesStr?.split(',').map(role => {
          return MapRoles.find(r => role === r.name)?.label
        }).join(',')
      }
      row.date = row.registeredDate
      row.locale = row.locale.substr(-2)

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

export default privateRoute(AdmUsers)
