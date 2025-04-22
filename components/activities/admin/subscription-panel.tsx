import moment from "moment"
import { dump } from "../../../src/helpers"
import useActivity from "../../hooks/activities/useActivity"
import ProgressBar from "../../ui/progressbar"
import { useAdmActivitiesContext } from "./adm-activities-context"
import Button from "react-bootstrap/Button"
import exportToExcel, { exportHTMLToExcel } from "../../../src/resources/export-to-excel"
import TableBuilder from "table-builder"

export default function SubscriptionsPanel() {

    const { activityId } = useAdmActivitiesContext()
    const { data, isLoading } = useActivity(activityId)

    const subs = data?.valid_subscriptions || []


    function findCpf(metas: any[]){
        if(!metas || metas.length === 0) return ''
        const cpf = metas.find((m) => m.meta_key === 'cpf')
        if(cpf){
            return cpf.meta_value
        }
        return ''
    }
    function export_(){
        const id = `inscricoes_${activityId}`
        let dt = parseJsonToTable()

        let table = new TableBuilder({id: id, class: 'sr-only'});
        table.setHeaders(dt.header)
        .setData(dt.body)   
        
        exportHTMLToExcel(id, table.render())
    
    }

    function parseJsonToTable(){
        const header = {
            id: 'ID',
            name: 'Nome',
            email: 'Email',
            cpf: 'CPF',
            date: 'Data',
            checkin: 'CheckIn',
        }

        const body = subs.map((s) => {
            return {
                id: s.id,
                name: s.user.display_name,
                email: s.user.user_email,
                cpf: findCpf(s.user.metas),
                date: moment(s.created_at).format('DD/MM/YYYY HH:mm'),
                checkin: s.checkin_at ? moment(s.checkin_at).format('DD/MM/YYYY HH:mm') : 'Não'
            }
        })

        return {
            header: header,
            body: body
        }
    }

    return <>
    {isLoading && <ProgressBar />}
    <div>
        <h2><small>#{activityId}</small> {data?.title}</h2>
    </div>
    <div>
        {subs.length === 0 && <div className="alert alert-warning">Nenhuma inscrição encontrada.</div>}
        {subs.length > 0 && <div className="alert alert-info d-flex justify-content-between align-items-center">
            <div>{subs.length} inscrições.</div>
            <div>
                <Button size="sm" onClick={export_}>baixar inscrições</Button>
            </div>
            </div>}
    </div>
    <div>
        <table className="table table-striped table-sm table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nome</th>
                    <th scope="col">Email</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Data</th>
                    <th scope="col">Checkin</th>
                </tr>
            </thead>
            <tbody>
                {subs.map((s, i) => {
                    const d = moment(s.created_at).format('DD/MM/YYYY HH:mm')
                    const c = s.checkin_at ? moment(s.checkin_at).format('DD/MM/YYYY HH:mm') : 'Não realizado'
                    const cpf = findCpf(s.user?.metas)
                    return <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.user.display_name}</td>
                        <td>{s.user.user_email}</td>
                        <td>{cpf}</td>
                        <td>{d}</td>
                        <td>{c}</td>
                    </tr>
                })}
            </tbody>
        </table>

{/* {dump(subs)} */}
    </div>    
    </>
} 