import { useQuery } from "react-query";
import { ActivitySchema } from "../../../src/types/activity.type";
import WpUser from "../../../src/http/wp-user";

export default function useUserActivities(userId:number, edition: string) {
  async function fetch(): Promise<ActivitySchema[]> {
    const axios = await WpUser.activities({ user_id: userId, edition });
    const response = axios.data;
    return response.data;
  }

  return useQuery(["user_activities", userId, edition], fetch, {
    enabled: !!edition && !!userId,
  });
}
