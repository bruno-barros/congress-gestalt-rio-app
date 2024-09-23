import {useRouter} from "next/router";
import {useEffect} from "react";
import Loading from "../../components/ui/loading";

export default function Merging() {

  const router = useRouter()

  useEffect(()=>{
    router.push('/')
  }, [])

  return (<div className="">
    <Loading vspace={80}/>
  </div>)
}
