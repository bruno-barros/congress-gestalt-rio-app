import { useState } from "react";
import { AuthorSchema } from "../../../src/types/authors-panel";
import s from "./authors-panel.module.scss";
import ButtonDeleteConfirmation from "./button-delete-confirmation";
import ButtonSpeacker from "./button-speacker";
import useTrans from "../../hooks/useTrans";
import { useAuthorsContext } from "./authors-context";
import Button from "react-bootstrap/Button";
import ToolTip from "../../ui/tooltip";
import useSettings from "../../hooks/useSettings";
import Icon from "../../ui/ionicon";
import { Field } from "formik";
interface AuthorListItemProps {
  abstractId: number | null | undefined;
  tempId: string | null | undefined;
  author: AuthorSchema;
  isMainAuthor?: boolean;
}
export default function AuthorListItem(props: AuthorListItemProps) {
  const { abstractId, tempId, author, isMainAuthor } = props;
  const t = useTrans();
  const [deleted, setDeleted] = useState(false);
  const { data, setData, setSelectedAuthor } = useAuthorsContext();
  const { currentEdition: edition } = useSettings();
  const AbstractCnf = edition?.Abstract()
  const FieldAuthors2 = AbstractCnf?.getField('authors2')

//   console.log({
//     ...AbstractCnf.getField('authors2')
//   })

  function handleDelete() {
    setDeleted(true);
    handleOnChange({ ...author, _active: false });
  }
  function handleOnChange(author: AuthorSchema) {
    // update author on data with setData
    const index = data.findIndex((a) => a.id === author.id);
    if (index === -1) return;
    const newData = [...data];
    newData[index] = author;
    setData(newData);
  }
  function isProfileComplete(){
    if(!FieldAuthors2 || FieldAuthors2.allowed === false) return true
    if(!author.name || !author.email) return false
    if(FieldAuthors2.bio_max > 0 && !author.bio) return false
    if(FieldAuthors2.bio2_max > 0 && !author.bio2) return false
    if(FieldAuthors2.bio3_max > 0 && !author.bio3) return false
    return true
  }

  function handleSelectAuthor(){
    setSelectedAuthor(author)
  }

  return (
    <div className={`${s.list_item} ${deleted ? s.list_item_deleted : ""}`}>
      <div className="d-flex align-items-center">
        {!isProfileComplete() && <ToolTip text={t('cadastro.incompleto')}>
            <Icon name="alert-circle-outline" style={{ fontSize: 15, color: 'red' }} />
        </ToolTip>}
        
        <ToolTip text={t('autor.editar')} position="right">            
        <Button variant="link" size="sm" onClick={handleSelectAuthor}>
          {author.name}
        </Button>
        </ToolTip>        
      </div>
      <div className="d-flex align-items-center">
        {isMainAuthor && (
          <span className="badge badge-dark">
            {t("trabalho.autor-de-contato")}
          </span>
        )}
        <ButtonSpeacker author={author} onChange={handleOnChange} />
        {!isMainAuthor && <ButtonDeleteConfirmation author={author} onDelete={handleDelete} />}        
      </div>
    </div>
  );
}
