import { useEffect, useState } from "react";
import ProgressBar_ from "react-bootstrap/cjs/ProgressBar";

interface ProgressBarProps {
    seconds?: number
}
export default function ProgressBar(props: ProgressBarProps) {

    const {seconds: t} = props
    const seconds = t || 5
    const ms = (seconds / 100) * 1000

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((old) => {
                if(old === 100){
                    clearInterval(interval)
                    return 0
                }
                return old + 1
            })
        }, ms)
        return () => clearInterval(interval)
    }, [])
    return <ProgressBar_ animated striped variant="success" now={progress} min={3} style={{height: 5}} />
}