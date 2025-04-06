
import Card from 'react-bootstrap/Card';
import s from './activities.module.scss'
import ProgressBar from '../ui/progressbar';
import { useMyActivitiesContext } from './my-actvities-context';
import AvailableActivitiesLine from './available-activity-line';
import moment from 'moment';

export default function AvailableActivities() {
    const { activities, loading, setLoading } = useMyActivitiesContext()
    let lastDate = '';
  return <div>
    {/* <h3 className={s.section_title}>Atividades disponíveis</h3> */}
    <Card>
        <Card.Header className={s.section_title}>Atividades disponíveis</Card.Header>
        {loading && <ProgressBar />}
        <div className="alert alert-warning m-0">filtros</div>
        <div className="list-group list-group-flush">
            {activities.map(a => {
                const ds = moment(a.start_at).format('DD/MM/YYYY')
                let showDiv = false;
                if(ds !== lastDate){
                    showDiv = true;
                    lastDate = ds;
                }
                
                return <>
                    {showDiv && (<div className={`list-group-item ${s.item_div}`}>{ds}</div>)}
                    <AvailableActivitiesLine key={a.id} activity={a} />
                </>
            })}
        </div>
        {/* <Card.Body>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam quo dolore necessitatibus esse asperiores magni aspernatur officia eveniet ab atque. Dolore veritatis placeat ipsa quidem dicta nostrum nulla numquam accusantium.
        </Card.Body> */}
    </Card>

  </div>;
}
