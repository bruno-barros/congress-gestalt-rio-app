interface SearchAuthorProps {
    abstractId: number | null | undefined;
    onAdded: () => void;
}
export default function SearchAuthor(props: SearchAuthorProps) {
  return (
    <>
      <div>Busque o autor pelo email de cadastro.</div>
      <div className="form-group- input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          placeholder="E-mail de cadastro"
        />
        <div className="input-group-append">
          <button className="btn btn-outline-primary btn-sm">Pesquisar</button>
        </div>
      </div>
    </>
  );
}
