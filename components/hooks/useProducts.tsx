import { useQuery } from "react-query";
import WpEcommerce from "../../src/http/wp-ecommerce";
import Product from "../../src/resources/product";
import useSettings from "./useSettings";
import Subscription from '../access-control/resolvers/Subscription';
/**
 * const {data} = useproducts(CAT_ID, filterByCountry({currentUserCountry}))
 * 
 * @param category 
 * @returns 
 */
export default function useProducts(category?: number|undefined, filter?: any) {
  async function fetch(): Promise<Product[]> {
    const axios = await WpEcommerce.products({ categoryId: category });
    const resp = axios.data;
    const nodes =  resp?.data?.products?.nodes
      ? resp?.data?.products?.nodes.map((p: any) => Product.make(p))
      : [];

      return filter ? filter(nodes, category) : nodes;
  }

  const query = useQuery(["products", category], fetch, {
    staleTime: Infinity,
    enabled: !!category,
  });

  return query;
}


export function filterByCountry(currentUserCountry: string) {

  const { data: event, currentEdition } = useSettings();
  const subs = currentEdition?.Subscription();
  const exclude = currentUserCountry === 'BR' ? [] : subs.produts_excluded_for_foreign;
  // console.log(subs.produts_excluded_for_foreign)

  return (products: Product[], category?:number) =>
    products.filter((p) => !exclude.includes(String(p.databaseId)));

}