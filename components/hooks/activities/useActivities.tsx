import { useQuery } from "react-query";
import { ActivitySchema } from "../../../src/types/activity.type";
import WpActivity from "../../../src/http/wp-activity";

export default function useActivities(edition: string, args?: { active?: 0 | 1; user_id?: number | string }) {
  async function fetch(): Promise<ActivitySchema[]> {
    const axios = await WpActivity.list({ 
      edition: edition,
      user_id: args?.user_id,
      active: args?.active,
    });
    const response = axios.data;
    return response.data;
  }

  return useQuery(["activities", edition, args], fetch, {
    enabled: !!edition,
  });
}
