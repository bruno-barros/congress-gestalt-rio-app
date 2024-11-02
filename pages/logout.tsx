import React, {useEffect} from "react";
import {useQueryClient} from "react-query";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {logout} from "../src/store/user.actions";
import Loading from "../components/ui/loading";

const Logout = ({location}) => {

  const queryClient = useQueryClient()
  const router = useRouter()
  const disp = useDispatch()

  useEffect(() => {

    queryClient.clear();
    disp(logout())
    router.push(`/`)

  }, [])


  return (<div className="">
    <div className="text-center" style={{margin: '80px 0'}}>
      <Loading/>
      <div>Aguarde, por favor...</div>
    </div>
  </div>)
}

export default Logout
