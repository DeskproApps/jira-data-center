import { baseRequest } from "./baseRequest";
import type { IDeskproClient } from "@deskpro/app-sdk";
import type { IssueItem } from "./types";

/**
 * Get an issue's remote links
 */
export const getRemoteLinks = (
  client: IDeskproClient,
  key: IssueItem["key"],
) => {
  return baseRequest(client, {
    url: `/issue/${key}/remotelink`,
  });
};
