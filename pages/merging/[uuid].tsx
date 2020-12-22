import {useRouter} from "next/router";
import useCurrentUser from "../../components/hooks/useCurrentUser";


const Merging = () => {

  const router = useRouter()
  const {authLoading, user} = useCurrentUser()

  return (<div className="">
    <h1>Merging</h1>
    <pre>{JSON.stringify(router.query, null, 2)}</pre>
  </div>)
}

export default Merging
