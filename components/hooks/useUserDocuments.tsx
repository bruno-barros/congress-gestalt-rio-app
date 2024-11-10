import { QueryClient, useQuery } from "react-query";
import WpDocument from "../../src/http/wp-document";
import { DocumentSchema } from "../../src/types/document";

export default function useUserDocuments(userId: number) {
  async function fetch(): Promise<DocumentSchema[]> {
    const axios = await WpDocument.listFromUser({ userId });
    return axios.data?.data || [];
  }

  return useQuery<DocumentSchema[], any>(["user-documents", userId], fetch, {
    enabled: !!userId,
  });
}

export function invalidateQuery(
  queryClient: QueryClient,
  userId: number = null
) {
  return queryClient.invalidateQueries(["user-documents", userId]);
}
