import { StatsSchema } from "../../src/types/stats.types";

export function getDataFromKey<T = any>(
  key: string,
  data?: StatsSchema[]
): T {

    if(!data || Array.isArray(data) === false || data.length === 0) {
        return [] as T
    }

  const found = data.find((item) => item.key === key);

  if(found.json) return JSON.parse(found.json);
  return found.value as T;
}
