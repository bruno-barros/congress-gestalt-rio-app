import {useRouter} from "next/router";
import useTrans from "../../components/hooks/useTrans";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import {useCallback, useMemo} from "react";
import MainLayout from "../../components/layout";
import {DynamicTable} from "../../components/dynamic-table";
import { MapRoles, User } from '../../src/resources/user';
import useAllUsers from "../../components/hooks/useAllUsers";
import privateRoute from "../../components/hoc/private-route";
import {siteTitle} from "../../src/helpers";
import Head from "next/head";
import {useQueryClient} from "react-query";
import Loading from "../../components/ui/loading";
import { UserGraphQl } from '../../src/types/users';

interface UserTable extends UserGraphQl {
  rolesString?: string
  date?: string
  aa?: boolean
}

const AdmUsers = () => {

  const queryClient = useQueryClient()
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
        accessor: 'rolesString',
      }, {
        Header: 'AA',
        accessor: 'aa',
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
  const data = useMemo((): UserTable[] => {
    if (!users || users.length === 0) return []
    return users.map(row => {
      const newUser: UserTable = {...row}
      if (newUser?.roles?.nodes) {
        let rolesStr = newUser?.roles?.nodes?.map(role => role.name).join(',')
        newUser.rolesString = rolesStr?.split(',').map(role => {
          return MapRoles.find(r => role === r.name)?.label
        }).join(',')
      }
      newUser.date = newUser.registeredDate
      newUser.locale = newUser.locale.substr(-2)
      newUser.aa = newUser.is_affirmative_action === '1'

      return newUser
    })
  }, [users])

  const dummy = useCallback(() => () => null, [])

  if (isLoading) {
    return (<MainLayout>
      <Loading vspace={80}/>
    </MainLayout>)
  }

  return (<MainLayout fullWidth>
    <Head>
      <title>{siteTitle('Admin - Usuários', queryClient)}</title>
    </Head>
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
