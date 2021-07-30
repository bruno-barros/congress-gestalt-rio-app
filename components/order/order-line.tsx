import moment from "moment";
import ToolTip from "../ui/tooltip";
import {Order} from "../../src/resources/order";

interface OrderLineProps {
  order: Order
}

export default function OrderLine(props: OrderLineProps) {

  const {order} = props

  return (<div className={`border-top border-bottom px-3 px-md-5 py-4 order-line ${order.status.toLowerCase()}`}>
    <div className="border-bottom pb-2 d-flex text-sm">
      <div className="mr-5">#{order.databaseId}</div>
      <div className="mr-5">{order.total} ({order.paymentMethodTitle})</div>
      <div className="">{moment(order.date).format('DD/MM/YYYY H:mm')}</div>
    </div>
    <div className="pt-3 pb-1" style={{fontSize: '1.4em'}}>
      {order.getItems().map(line => (<div key={line.product.databaseId} className="d-flex align-items-center">
        <ToolTip text={order.status}>
          <div className={`status-ball ${order.status.toLowerCase()}`}></div>
        </ToolTip>
        <strong className="mx-4">{line.product.name}</strong>
        <div className="">{line.product?.productCategories?.nodes[0]?.name}</div>
      </div>))}
    </div>
  </div>)
}
