import { useQuery } from "react-query";
import { ProductCategory } from "../../src/@types/ecommerce";
import WpEcommerce from "../../src/http/wp-ecommerce";

export default function useProductCategories() {
  async function fetch(): Promise<ProductCategory[]> {
    const axios = await WpEcommerce.categories();
    const resp = axios.data;
    return resp?.data?.productCategories?.nodes
      ? resp?.data?.productCategories?.nodes
      : [];
  }

  const query = useQuery("productCategories", fetch, {
    staleTime: Infinity,
  });

  return query;
}
