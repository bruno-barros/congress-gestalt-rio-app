import { useRouter } from "next/router";
import useTrans from "../hooks/useTrans";
import useUserDocuments from "../hooks/useUserDocuments";
import Loading from "../ui/loading";
import { User } from '../../src/resources/user';
import { DocumentContexts } from "../../src/resources/document";
import { DocumentContext } from '../../src/types/document.d';


interface UserDocumentsProps {
    user: User;
}
export default function UserDocuments(props: UserDocumentsProps) {
    const { user } = props;
  const t = useTrans();
  const router = useRouter();
  const lang = router.locale;
  const { data, isLoading } = useUserDocuments(user.getId());

  if (isLoading) {
    return <Loading />;
  }

  return <div className="mt-3">
    {(data && data.length > 0) && data.map(doc => {
        return <div key={doc.id} className="mb-2 border bg-light p-3 d-md-flex justify-content-between align-items-center">
            <div><a href={doc.url} target="_blank">{doc.name}</a></div>
            
            <div className="d-flex" style={{gap: 30}}>
                <div className="badge badge-primary badge-pill">{DocumentContexts(doc.context)?.[0]?.name || '—'}</div>
                <div className=" text-sm">{doc.created_at}</div>
            </div>
        </div>
    })}
  </div>
}
