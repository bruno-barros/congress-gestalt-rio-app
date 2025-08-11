import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import privateRoute from "../../components/hoc/private-route";
import useCurrentUser from "../../components/hooks/useCurrentUser";
import s from "./checkin.module.scss";
import ProgressBar from "../../components/ui/progressbar";
import { useQuery } from "react-query";
import WpActivity from "../../src/http/wp-activity";
import useSettings from "../../components/hooks/useSettings";
import { dump } from "../../src/helpers";
import Icon from "../../components/ui/ionicon";
import Button from "react-bootstrap/Button";
import LoadingButton from "../../components/ui/loading-button";
import { AxiosResponse } from "axios";
import { CheckUpActivitySchema, WpRestResponse } from "../../src/types/restapi";
import { set } from "lodash";
import moment from "moment";

function CheckinPage() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { data, isLoading, isFetching } = useQuery(
    ["checkin", String(router.query.id)],
    fetchActivity,
    {
      enabled: !!router.query.id && !!user?.getId(),
    }
  );
  const {
    data: event,
    currentEdition: edition,
    isLoading: loadEdition,
  } = useSettings(data?.activity?.edition as string);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const logo = event?.logoSecondary || event?.logoPrimary || null;
  const sd = data?.activity?.start_at ? moment(data?.activity?.start_at) : null;
  const ed = data?.activity?.end_at ? moment(data?.activity?.end_at) : null;

  async function fetchActivity(): Promise<CheckUpActivitySchema> {
    const id = String(router.query.id);
    const axios = await WpActivity.findCheckin(id);
    const resp = axios.data;
    // Implementação da função para buscar atividade usando o argumento id
    return resp.data;
  }

  function handleCheckIn() {
    setLoading(true);
    WpActivity.doCheckin(data?.activity?.id as number)
      .then((resp: AxiosResponse<WpRestResponse<CheckUpActivitySchema>>) => {
        setSuccess(resp.data.data.allowed_to_checkin)
        if (resp.data.success) {
        //   router.push("/checkin/sucesso");
        } else {
            // Exibir mensagem de erro
            //   alert(resp.data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // Tratar erro
        console.error("Erro ao fazer check-in:", error);
      });
  }

  useEffect(() => {
    const { id } = router.query;

    if (!id) {
      router.push("/checkin/erro");
    }
  }, [router.query]);

  if (isLoading || isFetching || loadEdition) {
    return (
      <div className={s.container} style={{ marginTop: "20px" }}>
        <div className="text-center">Aguarde...</div>
        <ProgressBar seconds={5} />
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.container_header}>
        {logo && (
          <>
            <img src={logo} alt="" className={s.brand_logo} />
          </>
        )}
      </div>
      <div className={s.container_content}>
        {data.allowed_to_checkin === false && <>
        {data.allowed_error_code === 'already_checked_in' 
            ? (<div className={s.success_banner}
            dangerouslySetInnerHTML={{ __html: data.allowed_error }}
          />) 
            : (<div className={s.error_banner}
            dangerouslySetInnerHTML={{ __html: data.allowed_error }}
          />)}
          
        </>}
        {success && <AnimatedCheckIn />}
        

        <div className={s.info_group}>
          <div className={s.label}>Atividade</div>
          <div className={s.title}>
            {data?.activity?.title_pt || "Atividade não encontrada"}
          </div>
        </div>
        <div className={`${s.info_group} d-flex align-items-center`}>
          <div className={s.icon}>
            <Icon name="calendar-outline" className="mr-2" />
          </div>
          <div className={s.icon_label}>{sd?.format("DD/MM/YYYY")}</div>
        </div>
        <div className={`${s.info_group} d-flex align-items-center`}>
          <div className={s.icon}>
            <Icon name="time-outline" className="mr-2" />
          </div>
          <div className={s.icon_label}>
            {sd?.format("HH:mm")} — {ed?.format("HH:mm")}
          </div>
        </div>
        {data?.allowed_error_code !== 'already_checked_in' && 
        <div className="my-3">
          <div className="my-2">
            <strong>Deseja fazer o checkin?</strong>
          </div>
          <LoadingButton
            loading={loading}
            disable={!data.allowed_to_checkin}
            size="lg"
            block
            onClick={handleCheckIn}
          >
            Confirmar
          </LoadingButton>
        </div>}
        
      </div>
      {dump({
        // logo: event.logoSecondary,
        // edition: edition,
      })}
    </div>
  );
}

function AnimatedCheckIn() {
  return (
    <div
      style={{
        backgroundColor: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "calc(100% - var(--content-pad) - var(--content-pad))",
        height: "calc(100% - var(--content-pad) - var(--content-pad))",
        borderRadius: "10px",
        position: "absolute",
        zIndex: 1000,
        boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
        animation: "slideUp 0.5s ease-out",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="100"
        height="100"
        style={{
          animation: "pulse 1s ease-out .5s",
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="green"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M8 12l2 2 4-4"
          stroke="green"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default privateRoute(CheckinPage);
