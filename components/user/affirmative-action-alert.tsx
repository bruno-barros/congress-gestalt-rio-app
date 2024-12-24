import { Trans } from "react-i18next"
import CurtainDelayed from "../ui/curtain-delayed"
import { useRouter } from "next/router"
import useCurrentUser from "../hooks/useCurrentUser"
import useUserDocuments from "../hooks/useUserDocuments"
import { dump } from "../../src/helpers"
import Link from "next/link"

export default function AffirmativeActionAlert(){
    const router = useRouter()
    const {user} = useCurrentUser()
    const { data: docs, isLoading } = useUserDocuments(user?.getId())
    const isAffirmative = user?.applyToAffirmativeAction()
    const hasDocs = (docs && docs.length > 0 && !isLoading) 
        ? docs.find(doc => doc.context === 'affirmative_action') 
        : false

    if(!isAffirmative){
        return null
    }

    if(hasDocs){
        return null
    }

    return <CurtainDelayed>
        {/* {dump({hasDocs, isAffirmative})} */}
    <div className="alert alert-warning text-center mb-0">
      <div>Para participar das Ações Afirmativas <Link href="/register3">envie o documento de comprovação</Link>.</div>
    </div>
  </CurtainDelayed>

}