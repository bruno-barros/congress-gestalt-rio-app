import { useQuery } from "react-query";
import { TaxonomySchema } from "../../../src/types/taxonomy.type";
import WpTaxonomy from "../../../src/http/wp-taxonomy";

export default function useTaxonomy(id: number) {
  async function fetch(): Promise<TaxonomySchema> {
    const axios = await WpTaxonomy.find(id);
    const response = axios.data;
    return response.data;
  }

  return useQuery(["taxonomy", id], fetch, {
    enabled: !!id,
  });
}
