import { useEffect, useMemo, useRef, useState } from "react";
import { User } from "../../src/resources/user";
import InputGroup from "react-bootstrap/InputGroup";
import LoadingButton from "../ui/loading-button";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import ProgressBar from "../ui/progressbar";
import { useQuery } from "react-query";
import WpUser from "../../src/http/wp-user";
import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { dump } from "../../src/helpers";
import { ac } from "../access-control";


enum StateEnum {
  INITIAL = "INITIAL",
  LOADING = "LOADING",
  SELECTED = "SELECTED",
  ERROR = "ERROR",
}

interface FindUserProps {
  onUpdate: (user: User | null) => void;
  preSelected?: User;
  appendFilter?: boolean;
  actionBtnLabel?: string;
  submitBtnLabel?: string;
}
export default function FindUser(props: FindUserProps) {
  const { onUpdate, preSelected, appendFilter = false, actionBtnLabel = 'Selecionar', submitBtnLabel = 'Buscar usuário' } = props;
  const router = useRouter();
  const fil = router.query.filters;
  const filters = fil ? JSON.parse(String(fil)) : {};
  const [state, setState] = useState(StateEnum.INITIAL); // Substituindo stateRef por useState
  console.log({ filters });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(
    preSelected || null
  );

  useEffect(() => {
    const fil = router.query.filters;
    const filters = fil ? JSON.parse(String(fil)) : {};
    if (filters?.user_id && appendFilter) {
      console.log("Selected user from filters:", filters.user_id);
      setState(StateEnum.SELECTED);
    }
  }, [router.events, router.query.filters]);

  useEffect(()=>{
    if(!preSelected && !appendFilter){
        setState(StateEnum.INITIAL);
    }
  }, [preSelected])

  const { data, isLoading, isFetching } = useQuery(
    ["findUser", searchTerm],
    async () => {
      try {
        const axios = await WpUser.searchUser({
          by_name: searchTerm,
        });
        const resp = axios.data;
        if (resp.data?.evUserSearch?.nodes) {
          return resp.data.evUserSearch.nodes.map(
            (user: any) => new User(user)
          );
        } else {
          throw new Error("Erro ao buscar usuário");
        }
      } catch (error) {
        toast.error("Erro ao buscar usuário: " + error?.message);
      }
    },
    {
      enabled: state === StateEnum.LOADING,
    }
  );

  function handleCloseSearch() {
    setState(StateEnum.INITIAL);
    // setSearchTerm("");
  }
  function handleForgetUser() {
    setSelectedUser(null);
    setState(StateEnum.INITIAL);
    onUpdate(null);

    if(appendFilter){
        const url = new URL(window.location.href);
        url.searchParams.delete("filters");
        router.replace(url.toString(), undefined, { shallow: true });
    }
  }
  function handleSelectUser(user: User) {
    setSelectedUser(user);
    setState(StateEnum.SELECTED);
    onUpdate(user);

    const filters = {
      user_id: user.getId(),
      s: searchTerm,
      nome: user.getFullName(),
    };
    if (appendFilter) {
      const url = new URL(window.location.href);
      url.searchParams.set("filters", JSON.stringify(filters));
      router.replace(url.toString(), undefined, { shallow: true });
    }
  }

  const handleSearchUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get("s") as string;

    if (!searchValue || searchValue.length < 3) {
      toast.error("O termo de busca deve ter pelo menos 3 caracteres.");
      return;
    }

    setSearchTerm(searchValue);
    setState(StateEnum.LOADING);

    // console.log("Search term from form:", searchValue);
    // Adicione lógica para buscar o usuário aqui
  };

  function SearchInput() {
    return (
      <form onSubmit={handleSearchUser}>
        {/* {dump({ state })} */}
        <InputGroup>
          {state === StateEnum.SELECTED ? (
            <>
              <div className="form-control bg-secondary text-white">
                {preSelected?.getFullName() || (appendFilter && filters?.nome) || ""}
              </div>
              <InputGroup.Append>
                <Button variant="warning" onClick={handleForgetUser}>
                  &times;
                </Button>
              </InputGroup.Append>
            </>
          ) : (
            <>
              <input
                name="s"
                type="text"
                className="form-control"
                placeholder="Nome ou email do usuário"
                defaultValue={searchTerm}
                // value={searchTerm}
                // onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroup.Append>
                <LoadingButton
                  type="submit"
                  loading={state === StateEnum.LOADING}
                  variant="secondary"
                >
                  {submitBtnLabel}
                </LoadingButton>
              </InputGroup.Append>
            </>
          )}
        </InputGroup>
      </form>
    );
  }

  function ResultModal() {
    return (
      <Modal show centered onHide={handleCloseSearch}>
        <Modal.Header closeButton className="modal-header--sticky">
          <Modal.Title>Resultados da Busca</Modal.Title>
        </Modal.Header>
        {(isLoading || isFetching) && <ProgressBar />}

        <Modal.Body>
            {data && data.length === 0 && (
              <div className="alert alert-warning">Nenhum usuário encontrado com <b>{searchTerm}</b></div>)}
          {data &&
            data.length > 0 &&
            data.map((user: User) => {
              return (
                <div
                  key={user.getId()}
                  className="d-flex justify-content-between border-bottom py-2"
                >
                  <div>
                    <h6 className="m-0">{user.getFullName()}</h6>
                    <div>{user.getUserData().email}</div>
                  </div>
                  <button
                  type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleSelectUser(user)}
                  >
                    {actionBtnLabel}
                  </button>
                </div>
              );
            })}
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <>
      <SearchInput />
      {state === StateEnum.LOADING && <ResultModal />}
    </>
  );
}
