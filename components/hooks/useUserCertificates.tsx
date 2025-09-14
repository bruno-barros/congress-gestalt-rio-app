import { QueryClient, useQuery } from "react-query";
import { CertificatesSchema } from "../../src/types/certificates";
import WpUser from "../../src/http/wp-user";

export default function useUserCertificates(userId: number, edition: string) {
  async function fetch(): Promise<CertificatesSchema[]> {
    const axios = await WpUser.certificates({ 
        user_id: userId,
        edition: edition
     });
    return axios.data?.data || [];
  }

  return useQuery<CertificatesSchema[], any>(["user-certificates", userId, edition], fetch, {
    enabled: !!userId,
  });
}

export function invalidateQuery(
  queryClient: QueryClient,
  userId: number = null
) {
  return queryClient.invalidateQueries(["user-certificates", userId]);
}
