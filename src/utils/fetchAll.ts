import { times, floor, flatten } from "lodash";
import { IDeskproClient } from "@deskpro/app-sdk";
import type { SearchResponse } from "../services/jira/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchAll = <T>(fn: (...args: any) => Promise<SearchResponse<T>>) => {
  const MAX = 50;

  return async (client: IDeskproClient, method: string, baseUrl: string) => {
    const firstResponses = await fn(client, method, `${baseUrl}?maxResults=${MAX}&startAt=0`)
    const { total } = firstResponses;

    if (total < MAX) {
      return firstResponses.values;
    }

    const requests = times(floor(total / MAX), (idx) =>
      fn(client, method, `${baseUrl}?maxResults=${MAX}&startAt=${(idx + 1) * MAX}`)
    );

    const responses = await Promise.all(requests);

    return [
      ...firstResponses.values,
      ...flatten(responses.map(({ values }) => values)),
    ];
  };
};

export { fetchAll };
