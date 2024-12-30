import { OrderStatusEnum } from '../types/ecommerce.d';
import  Edition  from './edition';
export const OrderStatuses: OrderStatusEnum[] = [
  OrderStatusEnum.CANCELLED,
  OrderStatusEnum.COMPLETED,
  OrderStatusEnum.FAILED,
  OrderStatusEnum.ON_HOLD,
  OrderStatusEnum.PENDING,
  OrderStatusEnum.PROCESSING,
  OrderStatusEnum.REFUNDED,
];

export function orderStatusLabel(status: OrderStatusEnum) {
  switch (status) {
    case OrderStatusEnum.CANCELLED:
      return "Cancelado";
    case OrderStatusEnum.COMPLETED:
      return "Completo";
    case OrderStatusEnum.FAILED:
      return "Falhou";
    case OrderStatusEnum.ON_HOLD:
      return "Em espera";
    case OrderStatusEnum.PENDING:
      return "Pendente";
    case OrderStatusEnum.PROCESSING:
      return "Processando";
    case OrderStatusEnum.REFUNDED:
      return "Reembolsado";
    default:
      return status;
  }
}

export interface Product {
  databaseId: number;
  name: string;
  productCategories: {
    nodes: {
      databaseId: number;
      name: string;
      slug: string;
    }[];
  };
}

export class Order {
  databaseId: number;
  currency: string;
  date: string;
  dateCompleted: string | number | null;
  paymentMethodTitle: string;
  total: string;
  status: OrderStatusEnum;
  customer?: {
    databaseId: number;
    email: string;
    displayName: string;
    metaData: {key: string, value: string|null}[];
  };
  lineItems: {
    nodes: { product: Product }[];
  };

  constructor(data: any) {
    Object.assign(this, data);
  }

  static make(data: any) {
    return new Order(data);
  }

  getId() {
    return this.databaseId;
  }

  getItems(): any[] {
    return this.lineItems?.nodes || [];
  }

  isCompleted(){
    return this.status === OrderStatusEnum.COMPLETED;
  }

  getCustomerName(){
    return this.getMeta('social_name') || this.customer?.displayName || '-';
  }

  getMetas(){
    return this.customer?.metaData || [];
  }

  getMeta(key: string){
    return this.getMetas().find(meta => meta.key === key)?.value || null;
  }
}

export class OrderCollection {
  collection: Order[];

  constructor(rows: Order[]) {
    this.collection = rows;
  }

  static make(collection: Order[]) {
    return new OrderCollection(collection);
  }

  getOrders(): Order[] {
    return this.collection.map((order) => Order.make(order));
  }

  getCompleted(): Order[] {
    return this.getOrders().filter((order) => order.status === OrderStatusEnum.COMPLETED);
  }

  hasValidSubscription(edition: Edition) {
    // console.log({edition});
    const categoryId = edition?.Subscription()?.getCategoryId()

    const completed = this.getCompleted();

    if (completed.length === 0) return false;
    let hasValid = false;

    completed.map((order) => {
      order.lineItems?.nodes?.map((line) => {
        line.product?.productCategories?.nodes?.map(cat => {
          if(cat.databaseId === categoryId){
            hasValid = true;
          }
        })
      })
    })

    return hasValid;
  }
}
