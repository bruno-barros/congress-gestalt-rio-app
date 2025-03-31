import { useQuery } from "react-query";
import { ActivitySchema } from "../../../src/types/activity.type";
import WpActivity from "../../../src/http/wp-activity";

export default function useActivities(edition: string) {
  async function fetch(): Promise<ActivitySchema[]> {
    const axios = await WpActivity.list({ edition });
    const response = axios.data;
    return response.data;
  }

  return useQuery(["activities", edition], fetch, {
    enabled: !!edition,
  });
}
