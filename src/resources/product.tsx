import { ProductStatusEnum } from "../@types/ecommerce";
import { moneyFormat } from "../helpers";

export default class Product {
  databaseId: number;
  description: string;
  shortDescription: string;
  featured: boolean;
  id: string;
  image?: {
    url: string;
  };
  link: string;
  name: string;
  status: ProductStatusEnum;
  type: string;
  price: string;
  salePrice: string;
  regularPrice: string;

  constructor(data: any) {
    this.databaseId = data?.databaseId;
    this.description = data?.description;
    this.shortDescription = data?.shortDescription;
    this.featured = data?.featured;
    this.id = data?.id;
    this.image = data?.image?.url;
    this.link = data?.link;
    this.name = data?.name;
    this.status = data?.status;
    this.type = data?.type;
    this.price = data?.price;// preço com desconto
    this.salePrice = data?.salePrice;// preço com desconto
    this.regularPrice = data?.regularPrice;// preço cheio
  }

  static make(data: any) {
    return new Product(data);
  }

  getId(){
    return this.databaseId || this.id
  }

  getName(){
    return this.name || 'Sem nome'
  }

  getFullPrice(formated: boolean = false){
    const value =  this.regularPrice || this.price
    return formated ? moneyFormat(value) : value
  }

  getSalePrice(formated: boolean = false){
    const value = this.salePrice || this.price
    return formated ? moneyFormat(value) : value
  }

  getShortDescription(){
    return this.shortDescription || this.description
  }

  getLongDescription(){
    return this.description || this.shortDescription
  }
}
