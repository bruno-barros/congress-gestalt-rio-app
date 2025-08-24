import moment from "moment";
import { dump } from "../../../src/helpers";
import useActivity from "../../hooks/activities/useActivity";
import ProgressBar from "../../ui/progressbar";
import { useAdmActivitiesContext } from "./adm-activities-context";
import Button from "react-bootstrap/Button";
import exportToExcel, {
  exportHTMLToExcel,
} from "../../../src/resources/export-to-excel";
import TableBuilder from "table-builder";
import DoCheckinModal from "../checkin/do-checkin-modal";
import CancelCheckinModal from "../checkin/cancel-checkin-modal";
import CancelSubscriptionModal from "../cancel-subscription-modal";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Icon from "../../ui/ionicon";
import ToolTip from "../../ui/tooltip";
import FindUser from "../../user/find-user";
import { useState } from "react";
import WpActivity from "../../../src/http/wp-activity";
import { toast } from "react-toastify";
import { User } from "../../../src/resources/user";
import useCurrentUser from "../../hooks/useCurrentUser";

export default function SubscriptionsPanel() {
  const { activityId } = useAdmActivitiesContext();
  const {user} = useCurrentUser();
  const { data, isLoading, refetch } = useActivity(activityId);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const subs = data?.valid_subscriptions || [];

  function findCpf(metas: any[]) {
    if (!metas || metas.length === 0) return "";
    const cpf = metas.find((m) => m.meta_key === "cpf");
    if (cpf) {
      return cpf.meta_value;
    }
    return "";
  }
  function export_() {
    const id = `inscricoes_${activityId}`;
    let dt = parseJsonToTable();

    let table = new TableBuilder({ id: id, class: "sr-only" });
    table.setHeaders(dt.header).setData(dt.body);

    exportHTMLToExcel(id, table.render());
  }

  function parseJsonToTable() {
    const header = {
      id: "ID",
      name: "Nome",
      email: "Email",
      cpf: "CPF",
      date: "Data",
      checkin: "CheckIn",
    };

    const body = subs.map((s) => {
      return {
        id: s.id,
        name: s.user.display_name,
        email: s.user.user_email,
        cpf: findCpf(s.user.metas),
        date: moment(s.created_at).format("DD/MM/YYYY HH:mm"),
        checkin: s.checkin_at
          ? moment(s.checkin_at).format("DD/MM/YYYY HH:mm")
          : "Não",
      };
    });

    return {
      header: header,
      body: body,
    };
  }

  async function handleSubcribeUser(user: User | null) {
    if(!user) {
      return;
    }
    setLoading(true);
    try {
        const axios = await WpActivity.subscribe({
            activity_id: activityId,
            user_id: user?.getId() || null,
        })
        const resp = axios.data;
        setLoading(false);
        if(resp.success){
            toast.success("Usuário inscrito com sucesso!");
            refetch();
        } else {
            toast.error("Erro ao inscrever usuário: " + resp.message);
        }
        setSelectedUser(null);

    }catch(e){
        toast.error("Erro ao inscrever usuário: " + e?.message);
    }
  }

  async function handleSubcribeAll(){
    setLoading(true);
    try {
        const axios = await WpActivity.subscribeAll({
            activity_id: activityId,
        })
        const resp = axios.data;
        setLoading(false);
        if(resp.success){
            const count = resp.data?.length || 0;
            toast.success(`${count} usuários inscritos com sucesso!`);
            refetch();
        } else {
            toast.error("Erro ao inscrever usuários: " + resp.message);
        }
    }catch(e){
        toast.error("Erro ao inscrever usuários: " + e?.message);
    }
  }

  return (
    <>
      {(isLoading || loading) && <ProgressBar />}
      <div>
        <h2>
          <small>#{activityId}</small> {data?.title}
        </h2>
      </div>
      <div className="d-flex gap-4 -justify-content-between align-items-center">
        {subs.length === 0 && (
          <div className="alert alert-warning">
            Nenhuma inscrição encontrada.
          </div>
        )}
        {subs.length > 0 && (
          <div className="alert alert-info d-flex justify-content-between align-items-center gap-3">
            <div>{subs.length} inscrições.</div>
            <div>
              <Button size="sm" onClick={export_}>
                baixar inscrições
              </Button>
            </div>
          </div>
        )}
        <div className="alert border d-flex gap-2 align-items-center">
            {/* {dump(selectedUser)} */}
            Adicionar inscrição
            <FindUser actionBtnLabel="Inscrever" submitBtnLabel="Buscar" preSelected={selectedUser} onUpdate={(user) => {
              setSelectedUser(user);
              handleSubcribeUser(user);
            }} />
            {user.isAdmin() && <div>
                <ToolTip text="Adicionar todos os inscritos na atividade">
                    <Button variant="outline-secondary" onClick={handleSubcribeAll}>Adicionar todos</Button>
                </ToolTip>
            </div>}
        </div>
      </div>
      <div>
        <table className="table table-striped table-sm table-hover" style={{fontSize: '0.8em'}}>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">CPF</th>
              <th scope="col">Data</th>
              <th scope="col">Checkin</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s, i) => {
              const d = moment(s.created_at).format("DD/MM/YYYY HH:mm");
              const c = s.checkin_at
                ? moment(s.checkin_at).format("DD/MM/YYYY HH:mm")
                : "Não realizado";
              const cpf = findCpf(s.user?.metas);
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.user.display_name}</td>
                  <td>{s.user.user_email}</td>
                  <td>{cpf}</td>
                  <td>{d}</td>
                  <td>{c}</td>
                  <td>
                    <ButtonGroup size="sm">
                        <CancelSubscriptionModal activityId={s.activity_id} userId={s.user_id} callable={<Button variant="warning">
                            <ToolTip text="Cancelar inscrição">
                            <Icon name="trash-outline" className="mr-1" />
                            </ToolTip>
                        </Button>} onUpdate={()=>refetch()}/>
                      {s.checkin_at ? (
                        <CancelCheckinModal
                          subscriptionId={s.id}
                          callable={<Button variant="danger">Checkout</Button>}
                          onUpdate={() => refetch()}
                        />
                      ) : (
                        <DoCheckinModal
                          subscriptionId={s.id}
                          callable={<Button>Checkin</Button>}
                          onUpdate={() => refetch()}
                        />
                      )}
                      
                    </ButtonGroup>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* {dump(subs)} */}
      </div>
    </>
  );
}
