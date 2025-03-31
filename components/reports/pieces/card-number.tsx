import Card, { CardProps } from "react-bootstrap/Card";
import s from "../../../styles/reports.module.scss";

interface CardNumberProps extends CardProps{
   minWidth?: number
   label: string
}
export default function CardNumber(props: React.PropsWithChildren<CardNumberProps>) {
    const { children, bg, minWidth, label } = props
    const mw = minWidth || 150
    return <>
    <Card bg={bg || 'primary'} text="white" className="h-100" style={{minWidth: mw}}>
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
            <div className={s.big_number}>{children}</div>
            <div className={s.small_label}>{label}</div>
        </Card.Body>
    </Card>
</>
}