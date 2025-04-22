import moment from "moment";
import { ActivitySchema } from "../../src/types/activity.type";
import { dump } from "../../src/helpers";
import { Dispatch, SetStateAction, useState } from "react";
import { filter } from "lodash";
import useTrans from "../hooks/useTrans";

interface ActivitiesFiltersProps {
    activities: ActivitySchema[];
    filtered: Dispatch<SetStateAction<ActivitySchema[]>>;
}
export default function ActivitiesFilters(props: ActivitiesFiltersProps) {
    const { activities, filtered } = props;
    const [filtering, setFiltering] = useState(false);
    const t = useTrans();

    const startTimeOptions = activities.map((a) => {
        const st = moment(a.start_at).format("HH:mm");
        return st
    }).sort()
    .filter((item, idx, arr) => arr.indexOf(item) === idx )
    .map(st => ({ value: st, label: st }))
    const speakersOptions_ = activities.map((a) => {
        const speakers = a.speakers.map(s => ({value: s.id, label: s.label}));
        return speakers
    }).flat().sort((a, b) => (a.label > b.label ? 1 : -1))
    const speakersOptions = removeArrDupes(speakersOptions_, 'value')
    const [localFilters, setLocalFilters] = useState({
        start_time: null,
        speaker: null
    })



    function removeArrDupes(arr: any[], key: string){
        return arr.reduce((acc, current) => {
            const x = acc.find(item => item[key] === current[key]);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
    }
    
    function handleFilter(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // filtered(activities);

        let newFilters = {
            start_time: e.currentTarget.start_time.value || null,
            speaker: e.currentTarget.speaker.value || null,
            occupation: !!e.currentTarget.occupation.checked

        }
        let tmp = filterBySpeaker(activities, newFilters.speaker);
        tmp = filterByStartTime(tmp, newFilters.start_time);
        tmp = filterByOccupation(tmp, newFilters.occupation);
        // console.log(tmp, newFilters);
        filtered(old => tmp);
        setFiltering(isFiltering(newFilters));
    }
    function filterBySpeaker(activities: ActivitySchema[], speaker: string) {
        if (!speaker) return activities;
        let tmp = activities.filter((activity) => {
            const speakers = activity.speakers.map(s => s.id);
            return speakers.includes(Number(speaker));
        })
        return tmp;
    }
    function filterByStartTime(activities: ActivitySchema[], start_time: string) {
        if (!start_time) return activities;
        let tmp = activities.filter((activity) => {
            const st = moment(activity.start_at).format("HH:mm");
            return st === start_time;
        })
        return tmp;
    }
    function filterByOccupation(activities: ActivitySchema[], checked: boolean) {
        if(!checked) return activities;

        return activities.filter((activity) => {
            return (activity.vacancies - activity.occupation) > 0;
        })   
    }
    function isFiltering(filters: any) {
        if(filters.start_time || filters.speaker || filters.occupation){
            return true;
        } 
            return false;
        

    }
    function handleReset(e: React.FormEvent<HTMLFormElement>) {
        // e.preventDefault();
        setLocalFilters({
            start_time: null,
            speaker: null
        })
        filtered(activities);
    }
    
  return <div className=" m-0">
    {/* {dump(speakersOptions)} */}
    <form onSubmit={handleFilter} onReset={handleReset} className="d-flex ">
        <div className="d-flex w-100 gap-2">
            <div className="form-group m-0">
                <select name="start_time" id="start_time" className="form-control form-control-sm border-top-0 border-bottom-0" defaultValue={""} style={{borderRadius: 0}}>
                    <option value="">{t('atividades.hora-inicio')}</option>
                    {startTimeOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="form-group m-0">
                <select name="speaker" id="speaker" className="form-control form-control-sm  border-top-0 border-bottom-0" defaultValue={""} style={{borderRadius: 0}}>
                    <option value="">{t('atividades.palestrante')}</option>
                    {speakersOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div className="form-check mx-2 mt-1">
                <input className="form-check-input" type="checkbox" value="" name="occupation" id="occupation" />
                <label className="form-check-label text-xs" htmlFor="occupation" style={{lineHeight: '.8em'}}>
                    {t('atividades.com-vagas')}
                </label>
            </div>

        </div>
        <div className="d-flex">
            <button type="submit" className="btn btn-primary btn-sm" style={{borderRadius: 0}}>{t('atividades.filtrar')}</button>
            {filtering && <button type="reset" className="btn btn-secondary btn-sm" style={{borderRadius: 0}}>{t('atividades.limpar')}</button>}
        </div>
    </form>
  </div>;
}