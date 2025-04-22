
import Card from 'react-bootstrap/Card';
import s from './activities.module.scss'
import ProgressBar from '../ui/progressbar';
import { useMyActivitiesContext } from './my-actvities-context';
import AvailableActivitiesLine from './available-activity-line';
import moment from 'moment';
import useUserActivities from '../hooks/activities/useUserActivities';
import useCurrentUser from '../hooks/useCurrentUser';
import useTrans from '../hooks/useTrans';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import ActivitiesFilters from './activities-filters';
import { dump } from '../../src/helpers';

export default function AvailableActivities() {
    const { user } = useCurrentUser()
    const t = useTrans();
    const { activities, loading, setLoading, edition } = useMyActivitiesContext()
    const { data: userActivities } = useUserActivities(user?.getId(), edition);
    const [filtered, setFiltered] = useState(activities)
    let lastDate = '';
    useEffect(()=>{
        setFiltered(activities)
    }, [activities])
  return <div>
    {/* {dump(filtered)} */}
    <Card>
        <Card.Header className={s.section_title}>{t('atividades.atividades-disponiveis')}</Card.Header>
        {loading && <ProgressBar />}
        <ActivitiesFilters activities={activities} filtered={setFiltered} />
        <div className="list-group list-group-flush">
            {filtered.map((a, idx) => {
                const ds = moment(a.start_at).format('DD/MM/YYYY')
                let showDiv = false;
                if(ds !== lastDate){
                    showDiv = true;
                    lastDate = ds;
                }
                
                return <div key={idx}>
                    {showDiv && (<div className={`list-group-item ${s.item_div}`}>{ds}</div>)}
                    <AvailableActivitiesLine context='subscribe' activity={a} userActivities={userActivities} />
                </div>
            })}
            {filtered.length === 0 && <div className="list-group-item text-sm text-center">{t('atividades.nenhuma-atividade')}</div>}
        </div>
        {/* <Card.Body>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam quo dolore necessitatibus esse asperiores magni aspernatur officia eveniet ab atque. Dolore veritatis placeat ipsa quidem dicta nostrum nulla numquam accusantium.
        </Card.Body> */}
    </Card>

  </div>;
}
