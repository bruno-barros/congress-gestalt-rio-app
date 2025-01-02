import { useState } from "react";
import { isEmailValid } from "../../../src/helpers";
import WpAuthor from "../../../src/http/wp-author";
import { toast } from "react-toastify";
import Loading from "../../ui/loading";
import {
  AuthorSchema,
  SearchAuthorSchema,
} from "../../../src/types/authors-panel";
import Button from "react-bootstrap/Button";
import Icon from "../../ui/ionicon";
import ToolTip from "../../ui/tooltip";
import ProgressBar from "../../ui/progressbar";
import { useAuthorsContext } from "./authors-context";
import useTrans from "../../hooks/useTrans";

interface SearchAuthorProps {
  abstractId: number | null | undefined;
  onAdded: (author: AuthorSchema) => void;
}
export default function SearchAuthor(props: SearchAuthorProps) {
    const t = useTrans();
  const { abstractId, onAdded } = props;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [found, setFound] = useState<SearchAuthorSchema[]>([]);
  const [notFound, setNotFound] = useState(false);
  const { data, setData } = useAuthorsContext();

  function handleKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    setEmail(e.currentTarget.value);
  }
  async function handleSearch() {
    if (!isEmailValid(email)) {
      toast.error(t('validacao.email'));
      return;
    }

    setLoading(true);
    setFound([]);
    setNotFound(false);
    const axios = await WpAuthor.search({
      search: email,
      abstractId: abstractId,
    });
    const resp = axios.data;
    if (resp.success) {
    //   console.log(resp.data);
      setFound(resp.data);
      setNotFound(resp.data.length === 0);
    } else {
        toast.error(resp.message)
    }
    setLoading(false);
    // console.log({ email }, isEmailValid(email));
  }

  async function handleAddAuthor(author: SearchAuthorSchema) {
    setAdding(true);
    const axios = await WpAuthor.createUpdate({
      wp_user_id: author.id,
      abstract_id: abstractId,
      name: author.name,
      email: author.email,      
    });
    const resp = axios.data;
    if (resp.success) {
      toast.success(t('adicionado-com-sucesso'));
      onAdded(resp.data);
      setData([...data, resp.data]);
    }
    setAdding(false);
    setFound([]);
    setNotFound(false);
    setEmail("");
  }

  return (
    <>
      <div className="d-flex align-items-center gap-2 mb-1">
        <div className="label">{t('autor.busque-autor')}</div>
        <ToolTip text={t('autor.requisito-trabalho')}>
          <Icon name="information-circle-outline" />
        </ToolTip>
      </div>
      <div className="form-group- input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          placeholder={t('cadastro.email-cadastro')}
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          disabled={loading}
        />
        {loading && (
          <div className="input-group-append border px-2">
            <Loading size="sm" />
          </div>
        )}
        <div className="input-group-append">
          <button
            type="button"
            onClick={handleSearch}
            className="btn btn-outline-secondary btn-sm"
            disabled={loading}
          >
            {t('pesquisar')}
          </button>
        </div>
      </div>
      {notFound && (
        <div className="text-danger text-sm my-2">
          {t('autor.nenhum-autor-encontrado')}: {email}.
        </div>
      )}

      {adding && <ProgressBar />}

      {found.length > 0 && (
        <div>
          {found.map((author) => {
            const isSub = author.isSubscribed;
            return (
              <div
                key={author.id}
                className="border-bottom text-sm py-3 text-primary d-flex justify-content-between align-items-center gap-4"
              >
                <div
                  className="text-"
                  style={{ textDecoration: !isSub ? "line-through" : "none" }}
                >
                  {author.name} {author.obs && <small>({author.obs})</small>}
                </div>
                <div className="d-flex align-items-center gap-2">
                  {isSub ? (
                    t('inscrito')
                  ) : (
                    <div className="text-danger">{t('nao-inscrito')}</div>
                  )}
                  {isSub && (
                    <Button
                      size="sm"
                      onClick={() => handleAddAuthor(author)}
                      disabled={adding}
                    >
                      {t('trabalho.adicionar-autor')}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
