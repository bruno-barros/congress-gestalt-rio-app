import { User } from '../../src/resources/user';
import useCurrentUser from '../hooks/useCurrentUser';
import Resolver from './resolver';

export const ac = (user: User, requires: string[], args?: any, relation?: 'OR' | 'AND') => {
  const resolver = new Resolver()
  return resolver.resolve(requires, user, args, relation)
}

interface AcProps {
  children: any
  requires: string[]
  args?: any
  relation?: 'OR' | 'AND'
}
export default function Ac(props: AcProps) {

  const { user, authLoading} = useCurrentUser()
  const { children, requires, args, relation } = props
  const resolver = new Resolver()

  if(authLoading){
    return null
  }

  return resolver.resolve(requires, user, args, relation) ?  children : null
}
