import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { JiraUser } from "./types";

/** Returns a list of users that match the search string */
const searchUsers = (client: IDeskproClient, q: string ) => {
  return baseRequest<JiraUser[]>(client, {
    url: "/user/search",
    queryParams: {
      username: q,
    },
  });
};

export { searchUsers };
