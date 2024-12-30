import ToolTip from "../../ui/tooltip";
import useTrans from "../../hooks/useTrans";
import Button from "react-bootstrap/cjs/Button";
import { AuthorSchema } from "../../../src/types/authors-panel";
import Loading from "../../ui/loading";
import Icon from "../../ui/ionicon";
import WpAuthor from "../../../src/http/wp-author";
import { useState } from "react";
import { set } from "lodash";
import { useAuthorsContext } from "./authors-context";

interface ButtonSpeackerProps {
  author: AuthorSchema;
  loading?: boolean;
  onChange: (author: AuthorSchema) => void;
}
export default function ButtonSpeacker(props: ButtonSpeackerProps) {
  const { author, onChange } = props;
  const [loading, setLoading] = useState(false);
  const t = useTrans();

  async function handleSpeaker() {
    if (loading) return;
    setLoading(true);
    const is = author.is_speaker === 1 ? 0 : 1;
    const axios = await WpAuthor.update(author.id, { is_speaker: is });
    const resp = axios.data;
    if(resp.success) {
        onChange({...author, is_speaker: is});
    }
    setLoading(false);
  }

  return (
    <ToolTip
      text={`${t(
        author.is_speaker
          ? "trabalho.e-apresentador"
          : "trabalho.nao-e-apresentador"
      )} (clique para mudar)`}
    >
      <button
        type="button"
        className="btn btn-sm py-0 d-flex align-items-center"
        disabled={loading}
        style={{ lineHeight: 1 }}
        onClick={() => {
          handleSpeaker();
        }}
      >
        {loading && <Loading size="sm" />}
        <Icon
          name={`${author.is_speaker ? "mic-outline" : "mic-off-outline"}`}
          style={{ fontSize: 20 }}
        />
        <div
          className={`badge ${
            author.is_speaker ? "badge-warning" : "text-muted"
          }`}
          style={{ opacity: `${author.is_speaker ? 1 : 0.7}` }}
        >
          {t("trabalho.autor-de-apresentacao")}
        </div>
        
      </button>
    </ToolTip>
  );
}
