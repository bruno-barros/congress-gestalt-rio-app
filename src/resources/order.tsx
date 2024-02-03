import { Edition } from './event';
export const OrderStatuses = [
  "CANCELLED",
  "COMPLETED",
  "FAILED",
  "ON_HOLD",
  "PENDING",
  "PROCESSING",
  "REFUNDED",
];

export function orderStatusLabel(status: string) {
  switch (status) {
    case "CANCELLED":
      return "Cancelado";
    case "COMPLETED":
      return "Completo";
    case "FAILED":
      return "Falhou";
    case "ON_HOLD":
      return "Em espera";
    case "PENDING":
      return "Pendente";
    case "PROCESSING":
      return "Processando";
    case "REFUNDED":
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
  status:
    | "CANCELLED"
    | "COMPLETED"
    | "FAILED"
    | "ON_HOLD"
    | "PENDING"
    | "PROCESSING"
    | "REFUNDED";
  customer?: {
    databaseId: number;
    email: string;
    displayName: string;
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
    return this.getOrders().filter((order) => order.status === "COMPLETED");
  }

  hasValidSubscription(edition: Edition) {
    // console.log({edition});
    const editionCategorySlug = edition?.subscription?.products_category?.slug

    const completed = this.getCompleted();
    if (completed.length === 0) return false;
    let hasValid = false;

    completed.map((order) => {
      order.lineItems?.nodes?.map((line) => {
        line.product?.productCategories?.nodes?.map(cat => {
          if(cat.slug === editionCategorySlug){
            hasValid = true;
          }
        })
      })
    })

    return hasValid;
  }
}
