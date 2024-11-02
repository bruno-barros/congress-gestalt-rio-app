import { useQuery } from "react-query";
import WpEcommerce from "../../src/http/wp-ecommerce";
import Product from "../../src/resources/product";

export default function useProducts(category?: number) {
  async function fetch(): Promise<Product[]> {
    const axios = await WpEcommerce.products({ categoryId: category });
    const resp = axios.data;
    return resp?.data?.products?.nodes
      ? resp?.data?.products?.nodes.map((p: any) => Product.make(p))
      : [];
  }

  const query = useQuery(["products", category], fetch, {
    staleTime: Infinity,
  });

  return query;
}
