import { useQuery } from "react-query";
import { ActivitySchema } from "../../../src/types/activity.type";
import WpActivity from "../../../src/http/wp-activity";

export default function useActivity(id: number) {
  async function fetch(): Promise<ActivitySchema> {
    const axios = await WpActivity.find(id);
    const response = axios.data;
    return response.data;
  }

  return useQuery(["activity", id], fetch, {
    enabled: !!id,
  });
}
