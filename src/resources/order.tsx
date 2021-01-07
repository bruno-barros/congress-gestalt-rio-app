export interface Product {
  databaseId: number
  name: string
  productCategories: {
    nodes: {
      databaseId: number
      name: string
      slug: string
    }[]
  }
}

export class Order {

  databaseId: number
  currency: string
  date: string
  dateCompleted: string | number | null
  paymentMethodTitle: string
  total: string
  status: 'CANCELLED' | 'COMPLETED' | 'FAILED' | 'ON_HOLD' | 'PENDING' | 'PROCESSING' | 'REFUNDED'
  lineItems: {
    nodes: { product: Product }[]
  }

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Order(data)
  }

  getId() {
    return this.databaseId
  }

  getItems(): any[] {
    return this.lineItems?.nodes || []
  }

}


export class OrderCollection {
  collection: Order[]

  constructor(rows: Order[]) {
    this.collection = rows
  }

  static make(collection: Order[]) {
    return new OrderCollection(collection)
  }

  getOrders(): Order[] {
    return this.collection.map(order => Order.make(order))
  }

  getCompleted(): Order[] {
    return this.getOrders().filter(order => order.status === 'COMPLETED')
  }

  hasValidSubscription(editionCategorySlug: string) {
    const completed = this.getCompleted()
    if(completed.length === 0) return false

    const category = completed.filter(order => {
      let orders = order.lineItems.nodes.filter(line => line.product.productCategories?.nodes.filter(cat => cat.slug === editionCategorySlug))
      return (orders && orders.length > 0) || false
    })

    return category.length > 0
  }
}
