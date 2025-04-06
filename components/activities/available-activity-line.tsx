import moment from "moment";
import { ActivitySchema } from "../../src/types/activity.type";
import useTrans from "../hooks/useTrans";
import { useRouter } from "next/router";
import Model from "../../src/resources/activity";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useMyActivitiesContext } from "./my-actvities-context";
import LoadingButton from "../ui/loading-button";
import Speaker from "./line/speaker";
import { getTaxonomyTypeLabel, Taxonomy } from "../../src/resources/taxonomy";
import { TaxonomyType } from "../../src/types/taxonomy.type";
import { dump } from "../../src/helpers";
import s from './activities.module.scss';
import WpActivity from "../../src/http/wp-activity";
import useCurrentUser from "../hooks/useCurrentUser";
import { toast } from "react-toastify";


interface AvailableActivitiesLineProps {
  activity: ActivitySchema;
}

export default function AvailableActivitiesLine(
  props: AvailableActivitiesLineProps
) {
  const { activity } = props;
  const { user } = useCurrentUser()
  const { loading, setLoading } = useMyActivitiesContext();
  const Activity = Model.make(activity);
  const Venue = Taxonomy.make(activity.venue);
  const Room = Taxonomy.make(activity.room);
  const router = useRouter();
  const t = useTrans();
  const lang = router.locale || "pt";
  const hs = moment(activity.start_at).format("HH:mm");
  const he = moment(activity.end_at).format("HH:mm");
  const tag =
    activity.room?.label ||
    activity.venue?.label ||
    activity.group?.label ||
    "";
  const [show, setShow] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setShow(true);
  }
  async function handleApply() {
    // e.preventDefault();
    // e.stopPropagation();
    // router.push(`/activities/${activity.id}`);
    setLoading(true);
    const axios = await WpActivity.subscribe({
        activity_id: activity.id,
        user_id: user.getId(),
    })
    const resp = axios.data
    setLoading(false);

    if(resp.success){
        toast.success(t('atividades.inscricao-realizada'));
    } else {
        toast.error(t('atividades.inscricao-falhou'));
    }

  }

  return (
    <>
      <button
        className="list-group-item list-group-item-action d-md-flex align-items-center gap-3 justify-content-between"
        onClick={handleClick}
      >
        <div className="d-md-flex align-items-center gap-3">
          <div>{`${hs} - ${he}`}</div>
          <div>{Activity.getTitle(lang)}</div>
        </div>
        <div>
          <div className="badge badge-primary">{tag}</div>
        </div>
      </button>
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="modal-header--sticky">
          <Modal.Title>{Activity.getTitle(lang)}</Modal.Title>
        </Modal.Header>
        <div className="bg-light d-flex py-3">
            <div className="col-auto">
                <div className="text-xs text-uppercase">{t('atividades.vagas-disponiveis')}</div>
                <div className="font-weight-bold" style={{fontSize: '2em', lineHeight: '1em'}}>{Activity.vacancies} ???</div>
            </div>
            <div className="col-auto">
                <div className="text-xs text-uppercase">{t('atividades.carga-horaria')}</div>
                <div className="font-weight-bold" style={{fontSize: '2em', lineHeight: '1em'}}>{Activity.workload} <small style={{fontSize:'60%', lineHeight: '1em'}}>{t('tempo.minutos').toLowerCase()}</small></div>
            </div>
        </div>
        <Modal.Body>
            <div dangerouslySetInnerHTML={{__html: Activity.getDescription(lang)}}></div>

            {activity?.speakers?.length > 0 && 
            <div className="my-4">
                <div className={s.center_div}><div>{getTaxonomyTypeLabel(TaxonomyType.SPEAKER, lang, activity?.speakers?.length > 1)}</div></div>
            {activity.speakers.map((speaker) => {
                    return <Speaker key={speaker.id} speaker={speaker} />
                })}
            </div>}

            {Venue.exists() && <div className="my-4">
                <div className={s.center_div}><div>{getTaxonomyTypeLabel(TaxonomyType.VENUE, lang)}</div></div>
                <div className="font-weight-bold">{Venue.getLabel(lang)}</div>
                <div>{Venue.getDescription(lang)}</div>
                {Venue.img && <img src={Venue.img} alt={Venue.label} className="img-fluid" />}                
            </div>}
            {Room.exists() && <div className="my-4">
                <div className={s.center_div}><div>{getTaxonomyTypeLabel(TaxonomyType.ROOM, lang)}</div></div>
                <div className="font-weight-bold">{Room.getLabel(lang)}</div>
                <div>{Room.getDescription(lang)}</div>
                {Room.img && <img src={Room.img} alt={Room.label} className="img-fluid" />}                
            </div>}

            {/* {dump(Venue)} */}

        </Modal.Body>
        <Modal.Footer className="modal-footer--sticky">
            <Button variant="secondary" disabled={loading} onClick={()=> setShow(false)} type="button">{t('fechar')}</Button>
            <LoadingButton loading={loading} onClick={handleApply} type="button">{t('atividades.btn-inscrever')}</LoadingButton>
            
        </Modal.Footer>
      </Modal>
    </>
  );
}
