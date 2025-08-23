import MainLayout from "../../components/layout";
import { useCallback, useMemo } from "react";
import { DynamicTable } from "../../components/dynamic-table";
import useTrans from "../../components/hooks/useTrans";
import { useQueryClient } from "react-query";
import { useRouter } from "next/router";
import privateRoute from "../../components/hoc/private-route";
import { siteTitle } from "../../src/helpers";
import Head from "next/head";
import Loading from "../../components/ui/loading";
import useSettings from "../../components/hooks/useSettings";
import useActivities from "../../components/hooks/activities/useActivities";
import AdmActivitiesContextProvider, {
  useAdmActivitiesContext,
} from "../../components/activities/admin/adm-activities-context";
import ActivitiesFilters from "../../components/activities/admin/activities-filter";
import ActivitiesPage from "../../components/activities/admin/activities-page";
import FindUser from "../../components/user/find-user";
import useActivityContext from "../../components/settings/activities/activities-context";
import Dropdown from "react-bootstrap/Dropdown";
import Icon from "../../components/ui/ionicon";
import WpActivity from "../../src/http/wp-activity";
import Swal from "sweetalert2";

const AdmActivities = () => {
  return (
    <AdmActivitiesContextProvider>
      <InnerPage />
    </AdmActivitiesContextProvider>
  );
};

const InnerPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const t = useTrans();
  const edition = String(router.query.edition || "");
  // const { setFilters } = useAdmActivitiesContext();

  async function handleExport() {
    Swal.fire({
      title: "Aguarde...",
      text: "Gerando arquivo CSV",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const axios = await WpActivity.exportSubscriptions({
      edition: edition,
    });
    const resp = axios.data;
    Swal.hideLoading();

    if (resp.success && resp.data) {
      Swal.fire({
        icon: "success",
        title: "OK",
        text: "O arquivo CSV foi gerado. Clique em OK para baixar.",
        showCancelButton: true,
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          const BOM = "\uFEFF"; // Adicionando o caractere BOM
          const header = resp.data.header.join(";"); // Convertendo o array em string com separador ;
          const body = resp.data.body.map((row) => row.join(";")).join("\n"); // Convertendo cada linha do corpo
          const csvContent = `${header}\n${body}`; // Construindo o conteúdo do CSV
          const blob = new Blob([BOM + csvContent], {
            type: "text/csv;charset=utf-8;",
          });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "subscriptions.csv";
          link.click();
        }
      });
    }
  }

  function PageHeader() {
    return (
      <div className="d-flex justify-content-between align-items-center">
        <div className="title">Atividades</div>
        <div className="d-flex gap-3">
          <FindUser
            appendFilter
            onUpdate={(user) => {
              // setFilters(p => ({user_id: user?.getId() || null}));
              // console.log('Selected user:', user);
            }}
          />
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <Icon name="list" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="right">
              <Dropdown.Item onClick={handleExport}>Exportar CSV</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }

  return (
    <MainLayout fullWidth pageHeader={<PageHeader />}>
      <Head>
        <title>{siteTitle("Admin - Atividades", queryClient)}</title>
      </Head>
      <div className="row">
        {/* <div className="col-12 col-md-2 border-right py-3 px-md-3">
            <ActivitiesFilters />
        </div> */}
        <div className="col-12 mb-3">
          <ActivitiesPage />
        </div>
      </div>
    </MainLayout>
  );
};

export default privateRoute(AdmActivities);
