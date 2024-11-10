import { OrderStatus } from "../../components/dynamic-table/cells";
export interface ProductCategory {
  databaseId: number;
  description: null | string;
  id: string; // graphql id
  image?: {
    path: string;
  };
  name: string;
  parentId: null | string; // graphql id
  parentDatabaseId: null | number;
  slug: string;
}

export interface ProductSchema {
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
}

export enum ProductStatusEnum {
  PUBLISH = "publish",
  DRAFT = "draft",
  PENDING = "pending",
  PRIVATE = "private",
}

export enum OrderStatusEnum {
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  ON_HOLD = "ON_HOLD",
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  REFUNDED = "REFUNDED",
}
