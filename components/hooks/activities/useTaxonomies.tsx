import { useQuery } from "react-query";
import WpTaxonomy from "../../../src/http/wp-taxonomy";
import { TaxonomySchema, TaxonomyType } from "../../../src/types/taxonomy.type";

export default function useTaxonomies(edition: string, select?: (data: TaxonomySchema[]) => TaxonomySchema[]) {
  async function fetch(): Promise<TaxonomySchema[]> {
    const axios = await WpTaxonomy.list({ edition });
    const response = axios.data;
    return response.data;
  }

  function filterTax(type: TaxonomyType) {
    if(!query.data || query.data?.length === 0) return []    
    return query.data?.filter((t) => t.type === type && t.active);
  }

  const query = useQuery(["taxonomies", edition], fetch, {
    enabled: !!edition,
    select: select || null
  });

  return {
    ...query,
    filterTax,
    }
}
