import DropdownButton from "react-bootstrap/cjs/DropdownButton";
import Dropdown from "react-bootstrap/cjs/Dropdown";
import { PropsWithChildren, ReactElement, useState } from "react";
import { TableInstance } from "react-table";
import SetEvaluatorsModal from "../abstract/set-evaluators-modal";
import { useQueryClient } from "react-query";
import useEvent from "../hooks/useEvent";
import SetStatusModal from "../abstract/set-status-modal";
import { WpAbstract } from "../../src/http/wp-abstract";
import {
  errorNotification,
  successNotification,
} from "../../src/resources/responses";
import DownloadCsv from "../ui/download-csv";
import WpUser from "../../src/http/wp-user";
import omit from "lodash/omit";
import useCurrentUser from "../hooks/useCurrentUser";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import NotificationModal from "../notification-modal";
import WpEvaluation from "../../src/http/wp-evaluation";
import { blockUi } from "../../src/store/ui.actions";
import { useDispatch } from "react-redux";
import SetStatusByCriteriaModal from "../abstract/set-status-by-criteria-modal";
import SetEvaluationVisibilityModal from "../abstract/set-evaluation-visibility-modal";
import { formatCPF, getGenres } from "../../src/helpers";
import useSettings from "../hooks/useSettings";
import { countries as  COUNTRIES } from "../../src/countries";

type GroupActions<T extends object> = {
  instance: TableInstance<T>;
};

export function AbstractsGroupActions<T extends object>({
  instance,
}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {
  const disp = useDispatch();
  const queryClient = useQueryClient();
  const {
    selectedFlatRows,
    toggleAllPageRowsSelected,
    state: { selectedRowIds },
  } = instance;
  const selected = selectedFlatRows.map((row) => row.original);
  const selectedCount = selected.length;
  const [activeModal, setActiveModal] = useState<
    "designar" | "status" | "status_criteria" | "evaluation_visibility" | string
  >("");
  const { data: event , currentEdition: edition} = useSettings();
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);

  function openModal(id: string) {
    setActiveModal(id);
  }

  function handleExportData(e) {
    e.preventDefault();
    setExportData([]);
    setLoading(true);
    WpAbstract.export({
      abstracts: selected.map((row) => row.databaseId),
    }).then(
      (resp) => {
        if (resp.data.success) {
          setExportData(resp.data.data);
          setLoading(false);
        }
      },
      (err) => {
        errorNotification({ error: err });
        setLoading(false);
      }
    );
  }

  function refreshAbstracts() {
    queryClient.refetchQueries(["abstracts"]);
    queryClient.refetchQueries(["abstract"]);
  }

  function handleDelete(e) {
    e.preventDefault();
    disp(blockUi(true));
    WpAbstract.delete({
      abstracts: selected.map((row) => row.databaseId),
    }).then(
      (resp) => {
        if (resp.data.success) {
          successNotification({ message: resp.data.data.msg });
          disp(blockUi(false));
          refreshAbstracts();
        }
      },
      (err) => {
        errorNotification({ error: err });
        disp(blockUi(false));
      }
    );
  }

  return (
    <>
      <DropdownButton
        id="dynamic-table-dropdown-actions-abstracts"
        title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ""}`}
        variant="outline-secondary"
      >
        <Dropdown.Item onClick={() => openModal("status_criteria")}>
          Mudar status por critérios
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header>
          Seleção {`${selectedCount > 0 ? `(${selectedCount})` : "(nenhum)"}`}
        </Dropdown.Header>
        <Dropdown.Item
          disabled={selectedCount === 0}
          onClick={handleExportData}
        >
          Exportar CSV
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => openModal("designar")}
          disabled={selectedCount === 0}
        >
          Designar avaliador
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => openModal("status")}
          disabled={selectedCount === 0}
        >
          Mudar status
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => openModal("message")}
          disabled={selectedCount === 0}
        >
          Enviar mensagem
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => openModal("evaluation_visibility")}
          disabled={selectedCount === 0}
        >
          Visibilidade dos comentários
        </Dropdown.Item>
        <Dropdown.Item
          className="text-danger"
          onClick={handleDelete}
          disabled={selectedCount === 0}
        >
          Apagar
        </Dropdown.Item>
      </DropdownButton>
      <DownloadCsv
        data={exportData}
        fileBaseName={`trabalhos_${edition.getId()}`}
        loading={loading}
      />
      <SetEvaluatorsModal
        abstract_ids={selected?.map((abs) => abs.databaseId)}
        show={activeModal === "designar"}
        onDismiss={() => {
          setActiveModal("");
        }}
        onUpdate={() => {
          refreshAbstracts();
          toggleAllPageRowsSelected(false);
        }}
      />
      <SetStatusModal
        abstract_ids={selected?.map((abs) => abs.databaseId)}
        show={activeModal === "status"}
        onDismiss={() => {
          setActiveModal("");
        }}
        onUpdate={() => {
          refreshAbstracts();
          toggleAllPageRowsSelected(false);
        }}
      />
      <SetStatusByCriteriaModal
        abstract_ids={selected?.map((abs) => abs.databaseId)}
        show={activeModal === "status_criteria"}
        onDismiss={() => {
          setActiveModal("");
        }}
        onUpdate={() => {
          refreshAbstracts();
          toggleAllPageRowsSelected(false);
        }}
      />
      <SetEvaluationVisibilityModal
        abstract_ids={selected?.map((abs) => abs.databaseId)}
        show={activeModal === "evaluation_visibility"}
        onDismiss={() => {
          setActiveModal("");
        }}
        onUpdate={() => {
          refreshAbstracts();
          toggleAllPageRowsSelected(false);
        }}
      />
      <NotificationModal
        context="abstracts"
        ids={selected?.map((abs) => abs.databaseId)}
        show={activeModal === "message"}
        onDismiss={() => {
          setActiveModal("");
          toggleAllPageRowsSelected(false);
        }}
      />
    </>
  );
}

export function AdmEvaluatorsGroupActions<T extends object>({
  instance,
}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {
  const queryClient = useQueryClient();
  const {
    selectedFlatRows,
    toggleAllPageRowsSelected,
    state: { selectedRowIds },
  } = instance;
  const selected = selectedFlatRows.map((row) => row.original);
  const selectedCount = selected.length;
  const [activeModal, setActiveModal] = useState<
    "designar" | "status" | string
  >("");
  const { data: event } = useEvent();
  const [loading, setLoading] = useState(false);
  const edition = event && event.currentEdition();

  function openModal(id: string) {
    setActiveModal(id);
  }

  function handleDeleteEvaluation(evaluationIds: number[]) {
    setLoading(true);
    WpEvaluation.delete(evaluationIds)
      .then(
        (resp) => {
          if (resp.data.success) {
            successNotification({ message: resp.data.message });
            refreshEvaluations();
          } else errorNotification({ message: resp.data.message });
        },
        (err) => {
          errorNotification({ error: err });
        }
      )
      .finally(() => setLoading(false));
  }

  function refreshEvaluations() {
    queryClient.refetchQueries(["evaluations", "adm"]);
  }

  return (
    <>
      <DropdownButton
        id="dynamic-table-dropdown-actions-abstracts"
        title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ""}`}
        variant="outline-secondary"
      >
        <Dropdown.Item
          onClick={() => openModal("message")}
          disabled={selectedCount === 0}
        >
          Enviar mensagem
        </Dropdown.Item>
        <Dropdown.Item
          className="text-danger"
          onClick={() => {
            handleDeleteEvaluation(selected?.map((evals) => evals.databaseId));
          }}
          disabled={selectedCount === 0 || loading}
        >
          Apagar
        </Dropdown.Item>
      </DropdownButton>
      <NotificationModal
        context="evaluations"
        ids={selected?.map((evals) => evals.databaseId)}
        title="Enviar mensagem aos avaliadores"
        show={activeModal === "message"}
        onDismiss={() => {
          setActiveModal("");
          toggleAllPageRowsSelected(false);
        }}
      />
    </>
  );
}

export function EvaluationsGroupActions<T extends object>({
  instance,
}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {
  const router = useRouter();
  const { user } = useCurrentUser();
  const {
    selectedFlatRows,
    toggleAllPageRowsSelected,
    state: { selectedRowIds },
  } = instance;
  const selected = selectedFlatRows.map((row) => row.original);
  const selectedCount = selected.length;
  // const [activeModal, setActiveModal] = useState('')

  function handleFinalApprove(e) {
    e.preventDefault();
    // console.log(selected.map(s => s.abstract_id));
    Swal.fire({
      icon: "warning",
      title: "Aguarde...",
      confirmButtonText: "...",
    });
    WpAbstract.updateStatus({
      abstracts: selected.map((s) => s.abstract_id),
      notify: true,
      status: "approved",
    }).then(
      (resp) => {
        if (resp.data.success) {
          Swal.update({
            icon: "success",
            title: resp.data.message,
            confirmButtonText: "OK",
            didClose(): void {
              router.reload();
            },
          });
        } else {
          Swal.update({
            icon: "error",
            title: "",
            text: resp.data.message,
            confirmButtonText: "OK",
          });
        }
      },
      (err) => {
        errorNotification({ error: err });
      }
    );
  }

  // console.log(selected);

  return (
    <>
      <DropdownButton
        id="dynamic-table-dropdown-actions-evals"
        title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ""}`}
        variant="outline-secondary"
      >
        {user.canManageAbstracts() && (
          <>
            <Dropdown.Item
              onClick={handleFinalApprove}
              disabled={selectedCount === 0}
              className="text-success font-weight-bold"
            >
              Aprovar trabalhos
            </Dropdown.Item>
          </>
        )}
      </DropdownButton>
    </>
  );
}

export function UsersGroupActions<T extends object>({
  instance,
}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {
  const {
    selectedFlatRows,
    toggleAllPageRowsSelected,
    state: { selectedRowIds },
  } = instance;
  const selected = selectedFlatRows.map((row) => row.original);
  const selectedCount = selected.length;
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  function handleExportData(e) {
    e.preventDefault();
    setExportData([]);
    setLoading(true);
    WpUser.export({
      ids: selected.map((row) => row.databaseId),
    }).then(
      (resp) => {
        if (resp.data.success) {
          setExportData(resp.data.data);
          setLoading(false);
        }
      },
      (err) => {
        errorNotification({ error: err });
        setLoading(false);
      }
    );
  }

  return (
    <>
      <DropdownButton
        id="dynamic-table-dropdown-actions-users"
        title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ""}`}
        variant="outline-secondary"
      >
        <Dropdown.Item
          onClick={handleExportData}
          disabled={selectedCount === 0}
        >
          Exportar CSV
        </Dropdown.Item>
        {/*<Dropdown.Item onClick={() => {*/}
        {/*}} disabled={selectedCount === 0}>Atribuir perfil</Dropdown.Item>*/}
        <Dropdown.Item
          onClick={() => setActiveModal("message")}
          disabled={selectedCount === 0}
        >
          Enviar mensagem
        </Dropdown.Item>
      </DropdownButton>
      <DownloadCsv
        data={exportData}
        fileBaseName={`usuarios_`}
        loading={loading}
      />
      <NotificationModal
        context="users"
        ids={selected?.map((row) => row.databaseId)}
        show={activeModal === "message"}
        onDismiss={() => {
          setActiveModal("");
          toggleAllPageRowsSelected(false);
        }}
      />
    </>
  );
}

export function SubscriptionsGroupActions<T extends object>({
  instance,
}: PropsWithChildren<GroupActions<T>> & any): ReactElement | null {
  const {
    selectedFlatRows,
    toggleAllPageRowsSelected,
    state: { selectedRowIds },
  } = instance;
  const selected: any[] = selectedFlatRows.map((row) => row.original);
  const selectedCount = selected.length;
  const [exportData, setExportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeModal, setActiveModal] = useState("");

  function handleExportData(e) {
    e.preventDefault();
    setExportData([]);
    setLoading(true);

    setTimeout(() => {
      console.log(selected);
      setExportData(
        selected.map((item) => {
          return {
            PEDIDO: item.databaseId,
            DATA: item.date,
            METODO: item.paymentMethodTitle,
            TOTAL: item.total.replace("&nbsp;", " "),
            PLANO: item.package,
            NOME: item.customer_name,
            NOME_CRACHA: usermeta(item, "badge_name"),
            CPF: formatCPF(usermeta(item, "cpf")),
            EMAIL: item.customer_email,
            STATUS: item.order_status,
            PDC: usermeta(item, "is_pdc") === "1" ? "Sim" : "Não",
            NECESSIDADES: usermeta(item, "pdc_needs"),
            // CRIANÇA: usermeta(item, "is_child_care") === "1" ? "Sim" : "Não",
            USO_EMAIL: usermeta(item, "allow_newsletter") === "1" ? "Sim" : "Não",
            ACAO_AFIRMATIVA: usermeta(item, "affirmative_action") ? "Sim" : "Não",
            TIPO_ACAO: usermeta(item, "affirmative_action"),
            RACA: usermeta(item, 'race') || 'Parda',
            GENERO: genderName(item, 'gender'),
            PAIS: countryName(item, 'country'),  
            //
          };
        })
      );
      setLoading(false);
    }, 2000);
  }

  function usermeta(item: any, key: string) {
    if (!item?.customer?.metaData) return "";
    let meta = item.customer.metaData.find((m) => m.key === key);
    return meta ? meta.value : "";
  }

  function genderName(item: any, key: string) {
    const v = usermeta(item, key);
    const s = getGenres().find((g) => g.value === v);
    return s ? s.name : "";
  }

  function countryName(item: any, key: string) {
    const v = usermeta(item, key);
    const s = COUNTRIES.find((g) => g.code === v);
    return s ? s.name : "";
  }

  return (
    <>
      <DropdownButton
        id="dynamic-table-dropdown-actions-subscription"
        title={`Ações ${selectedCount > 0 ? `(${selectedCount})` : ""}`}
        variant="outline-secondary"
      >
        <Dropdown.Item
          onClick={handleExportData}
          disabled={selectedCount === 0}
        >
          Exportar CSV
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setActiveModal("message")}
          disabled={selectedCount === 0}
        >
          Enviar mensagem
        </Dropdown.Item>
      </DropdownButton>
      <DownloadCsv
        data={exportData}
        fileBaseName={`inscricoes_`}
        loading={loading}
      />
      <NotificationModal
        context="users"
        ids={selected?.map((row) => row.customer.databaseId)}
        show={activeModal === "message"}
        onDismiss={() => {
          setActiveModal("");
          toggleAllPageRowsSelected(false);
        }}
      />
    </>
  );
}
