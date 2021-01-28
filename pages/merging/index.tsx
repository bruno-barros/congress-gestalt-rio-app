import {Loading} from '@brunobarros/react-components'
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function Merging() {

  const router = useRouter()

  useEffect(()=>{
    router.push('/')
  }, [])

  return (<div className="">
    <Loading vspace={80}/>
  </div>)
}
