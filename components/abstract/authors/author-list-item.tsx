import { useState } from "react";
import { AuthorSchema } from "../../../src/types/authors-panel";
import s from "./authors-panel.module.scss";
import ButtonDeleteConfirmation from "./button-delete-confirmation";
import ButtonSpeacker from "./button-speacker";
import useTrans from "../../hooks/useTrans";
import { useAuthorsContext } from "./authors-context";
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
  const { data, setData } = useAuthorsContext();

  function handleDelete() {
    setDeleted(true);
  }
  function handleOnChange(author: AuthorSchema) {
    // update author on data with setData
    const index = data.findIndex((a) => a.id === author.id);
    if (index === -1) return;
    const newData = [...data];
    newData[index] = author;
    setData(newData);

  }

  return (
    <div className={`${s.list_item} ${deleted ? s.list_item_deleted : ""}`}>
      <div className="">{author.name}</div>
      <div className="d-flex align-items-center">
        {isMainAuthor && (
          <span className="badge badge-dark">
            {t("trabalho.autor-de-contato")}
          </span>
        )}
        <ButtonSpeacker author={author} onChange={handleOnChange} />
        <ButtonDeleteConfirmation author={author} onDelete={handleDelete} />
      </div>
    </div>
  );
}
