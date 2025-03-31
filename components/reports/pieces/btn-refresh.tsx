import { useState } from "react";
import LoadingButton from "../../ui/loading-button";
import { WpStats } from "../../../src/http/wp-stats";
import useReportsContext from "../reports-context";
import useStats from "../../hooks/useStats";


export default function BtnRefresh(){
    const { edition } = useReportsContext()
    const [loadig, setLoading] = useState(false)
    const { refetch } = useStats(edition)

    async function handleRefresh(){   
        setLoading(true)
        const axios = await WpStats.refresh({edition})
        const resp = axios.data
        refetch()
        setLoading(false)
    }

    return <div>
        <LoadingButton onClick={handleRefresh} loading={loadig} type="button" variant="outline-secondary" size="sm">Atualizar</LoadingButton>
    </div>
}